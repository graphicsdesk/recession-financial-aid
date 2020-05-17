<script>
  import { onMount } from 'svelte';
  import { draw } from 'svelte/transition';
  import { select, event, mouse as d3Mouse } from 'd3-selection';
  import { line } from 'd3-shape';
  import { scaleLinear } from 'd3-scale';
  import { axisTop, axisLeft } from 'd3-axis';

  import { indexClosest, valuesExtent } from './utils';
  import { IVIES } from './constants';

  import LineLabel from './LineLabel.svelte';
  import Tspans from './Tspans.svelte';

  /* Data preprocessing */

  import schoolCosts from '../../data/school-costs.json';
  import nationalData from '../../data/national-data.json';

  const series = [
    ...schoolCosts.map(d => ({
      name: d.school,
      values: d.data.map(x => x.cost),
    })),
    { name: 'nat-income', values: nationalData.slice(3).map(d => d.income) },
    { name: 'nat-cost', values: nationalData.slice(3).map(d => d.cost) },
  ];

  /* Some constants */

  const TICK_PADDING = 11;
  const margin = { top: 20, right: 100, bottom: 40 };
  margin.left = TICK_PADDING * 2 + 43; // padding on both sides + label width
  margin.top += TICK_PADDING * 2 + 19 + 2; // padding + label height + some more

  /* Props */

  export let width;
  export let height;
  export let lineNames = [];

  /* Declare and instantiate variables */

  let xScale = scaleLinear().domain([2003, 2018]);
  let yScale = scaleLinear().domain(valuesExtent(series, 1.07));

  let lineFn = line().defined(d => d !== undefined);
  let xAxisFn = axisTop()
    .tickPadding(TICK_PADDING)
    .tickFormat(d => d);
  let yAxisFn = axisLeft().tickPadding(TICK_PADDING);

  let gWidth, gHeight;
  let xAxis, yAxis;

  /* Rescaling when dimensions change. */

  // Variables only need to be reassigned if they are referenced in the markup.
  $: {
    gWidth = width - margin.left - margin.right;
    gHeight = height - margin.top - margin.bottom;

    xScale = xScale.range([0, gWidth]);
    yScale = yScale.range([gHeight, 0]);

    xAxisFn
      .scale(xScale)
      .tickSize(-gHeight)
      .ticks(gWidth / 90);
    yAxisFn.scale(yScale).tickSize(gWidth);

    lineFn = lineFn.x((_, i) => xScale(2003 + i)).y(yScale);

    xAxis && select(xAxis).call(xAxisFn);
    yAxis && select(yAxis).call(yAxisFn);
  }

  /* Filtering out lines */

  $: visibleSeries = series.filter(s => lineNames.includes(s.name));

  /* Mouse events */

  let svgNode;

  let hoverIndex;

  onMount(() => {
    const svg = select(svgNode);
    svg.on('mousemove', function() {
      event.preventDefault();
      const mouse = d3Mouse(this);
      const x = xScale.invert(mouse[0] - margin.left);
      const y = yScale.invert(mouse[1] - margin.top);
      hoverIndex = indexClosest(visibleSeries, x, y);
    });
  });

  /* Positioning y-axis-dependent things like blur and axis label */

  let blurTransform, axisLabelTransform;
  $: {
    if (yAxis) {
      const firstTick = yAxis.firstElementChild.nextElementSibling;
      blurTransform = firstTick.getAttribute('transform');
      const lastTick = yAxis.lastElementChild;
      axisLabelTransform = lastTick.getAttribute('transform');
    }
  }
</script>

<style lang="scss">
  /* Axis styles in styles.scss because Svelte doesn't control the DOM there */
  /* Styles that require global SCSS variables are also in styles.scss */

  svg {
    cursor: pointer;
  }

  path {
    mix-blend-mode: multiply;
    stroke-linejoin: round;
    stroke-linecap: round;
    fill: none;
    stroke: #34495e;
    stroke-width: 1.5;
  }

  g[data-name='Columbia'] path {
    stroke: #02a9c0;
    stroke-width: 2;
  }

  g.isIvy path {
    stroke: #aae6ec;
  }
</style>

<svg {width} {height} bind:this={svgNode}>
  <defs>
    <linearGradient id="blur-down" gradientTransform="rotate(90)">
      <stop offset="0%" stop-color="white" stop-opacity="0" />
      <stop offset="10%" stop-color="white" stop-opacity="0.7" />
      <stop offset="50%" stop-color="white" stop-opacity="1" />
    </linearGradient>
  </defs>

  <g transform="translate({margin.left}, {margin.top})">
    <g bind:this={xAxis} class="axis x-axis" />
    <g
      bind:this={yAxis}
      class="axis y-axis"
      transform="translate({gWidth}, 0)"
    />
    <text y="0" class="axis-label" transform={axisLabelTransform}>
      <Tspans x="-7" text="inflation-adjusted dollars" />
    </text>
    <rect
      x="-60"
      y="-10"
      transform={blurTransform}
      {width}
      height="100"
      fill="url('#blur-down')"
    />

    {#each visibleSeries as line, i (line.name)}
      <g data-name={line.name} class:isIvy={IVIES.includes(line.name)}>
        <path transition:draw={{ duration: 1200 }} d={lineFn(line.values)} />
        <LineLabel {line} {xScale} {yScale} hovered={i === hoverIndex} />
      </g>
    {/each}
  </g>
</svg>
