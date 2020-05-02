<script>
  import { draw } from 'svelte/transition';
  import { select } from 'd3-selection';
  import { line } from 'd3-shape';
  import { scaleLinear } from 'd3-scale';
  import { extent } from 'd3-array';
  import { axisBottom, axisRight } from 'd3-axis';

  /* Data preprocessing */

  import fakeTuitionData from '../../data/fake-tuition.json';
  const dataArray = fakeTuitionData.map(({ name, data }) => ({
    name,
    data: data.sort((a, b) => a.year - b.year),
  }));

  /* Some constants */

  const TICK_PADDING = 11;
  const margin = {};
  margin.top = margin.left = 30;
  margin.right = TICK_PADDING * 2 + 35; // padding on both sides + label width
  margin.bottom = TICK_PADDING * 2 + 19 + 2; // padding + label height + some more

  /* Props */

  export let width;
  export let height;
  export let index = 0;

  /* Declare and instantiate variables */

  let xScale = scaleLinear().domain(flatExtent(dataArray, d => d.year));
  let yScale = scaleLinear().domain(flatExtent(dataArray, d => d.tuition));
  function flatExtent(dataArray, accessor) {
    return extent(dataArray.map(data => data.data).flat(), accessor);
  }

  let lineFn = line();
  let xAxisFn = axisBottom()
    .tickPadding(TICK_PADDING)
    .tickFormat(d => d);
  let yAxisFn = axisRight().tickPadding(TICK_PADDING);

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
    yAxisFn.scale(yScale).tickSize(-gWidth);

    lineFn = lineFn.x(d => xScale(d.year)).y(d => yScale(d.tuition));

    xAxis && select(xAxis).call(xAxisFn);
    yAxis && select(yAxis).call(yAxisFn);
  }

  /* Filtering out lines */

  $: lines = dataArray.filter((_, i) => i <= index);

  $: console.log(gWidth, lineFn([{ year: 0, tuition: 0 }]));
</script>

<style lang="scss">
  /* Axis styles in styles.scss because Svelte doesn't control the DOM there */
  /* Styles that require global SCSS variables are also in styles.scss */

  #y-axis-dollars-label {
    text-anchor: end;
    fill: #999;
  }
</style>

<svg {width} {height}>
  <text x={width - TICK_PADDING} y={margin.top - 10} id="y-axis-dollars-label">
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

    {#each lines as line (line.name)}
      <path
        transition:draw={{ duration: 1200 }}
        class="line"
        d={lineFn(line.data)}
        fill="none"
        stroke="steelblue"
        stroke-width="1.5"
      />
    {/each}
  </g>
</svg>
