<script>
  import { onMount } from 'svelte';
  import { draw } from 'svelte/transition';
  import { select, event, mouse as d3Mouse } from 'd3-selection';
  import { line } from 'd3-shape';
  import { scaleLinear } from 'd3-scale';
  import { extent, bisectLeft, least } from 'd3-array';
  import { axisBottom, axisLeft } from 'd3-axis';

  /* Data preprocessing */

  import schoolCosts from '../../data/school-costs.json';

  /* Some constants */

  const TICK_PADDING = 11;
  const margin = { top: 40, right: 30 };
  margin.left = TICK_PADDING * 2 + 43; // padding on both sides + label width
  margin.bottom = TICK_PADDING * 2 + 19 + 2; // padding + label height + some more

  /* Props */

  export let width;
  export let height;
  export let index = 0;

  /* Declare and instantiate variables */

  let xScale = scaleLinear().domain(flatExtent(schoolCosts, d => d.year));
  let yScale = scaleLinear().domain(flatExtent(schoolCosts, d => d.cost));
  function flatExtent(dataArray, accessor) {
    return extent(dataArray.map(data => data.data).flat(), accessor);
  }

  let lineFn = line();
  let xAxisFn = axisBottom()
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

    xScale.range([0, gWidth]);
    yScale.range([gHeight, 0]);

    xAxisFn
      .scale(xScale)
      .tickSize(-gHeight)
      .ticks(gWidth / 90);
    yAxisFn.scale(yScale).tickSize(gWidth);

    lineFn = lineFn.x(d => xScale(d.year)).y(d => yScale(d.cost));

    xAxis && select(xAxis).call(xAxisFn);
    yAxis && select(yAxis).call(yAxisFn);
  }

  /* Filtering out lines */

  $: lines = schoolCosts.filter((_, i) => i <= index * 2);

  /* Mouse events */

  let svgNode;

  onMount(() => {
    const svg = select(svgNode);
    svg.on('mousemove', mouseMoved);
  });

  const years = schoolCosts[0].data.map(d => d.year);
  function mouseMoved() {
    event.preventDefault();
    const mouse = d3Mouse(this);
    const x = xScale.invert(mouse[0]);
    const y = yScale.invert(mouse[1]);

    const indexRight = bisectLeft(years, x, 1);
    const indexLeft = indexRight - 1;
    const index = x - years[indexLeft] > years[indexRight] - x ? indexRight: indexLeft;

    const series = schoolCosts.map(x => x.data);

    // TODO
  }
</script>

<style lang="scss">
  /* Axis styles in styles.scss because Svelte doesn't control the DOM there */
  /* Styles that require global SCSS variables are also in styles.scss */

  #y-axis-dollars-label {
    text-anchor: start;
    fill: #999;
  }

  .line {
    mix-blend-mode: multiply;
    stroke-linejoin: round;
    stroke-linecap: round;
    fill: none;
    stroke: steelblue;
    stroke-width: 1.5;
  }
</style>

<svg {width} {height} bind:this={svgNode}>
  <text x={margin.left} y={margin.top - 10} id="y-axis-dollars-label">
    Inflation-adjusted dollars
  </text>

  <g transform="translate({margin.left}, {margin.top})">
    <g
      bind:this={xAxis}
      class="axis x-axis"
      transform="translate(0, {gHeight})"
    />
    <g
      bind:this={yAxis}
      class="axis y-axis"
      transform="translate({gWidth}, 0)"
    />

    {#each lines as line (line.school)}
      <path
        transition:draw={{ duration: 1200 }}
        class="line"
        d={lineFn(line.data)}
      />
    {/each}
  </g>
</svg>
