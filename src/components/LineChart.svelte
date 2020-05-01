<script>
  import { draw } from "svelte/transition";
  import { select } from "d3-selection";
  import { line } from "d3-shape";
  import { scaleTime, scaleLinear } from "d3-scale";
  import { extent } from "d3-array";
  import { axisBottom, axisLeft } from "d3-axis";

  export let width;
  export let height;
  const margin = { top: 50, bottom: 50, left: 50, right: 50 };

  $: gWidth = width - margin.left - margin.right;
  $: gHeight = height - margin.top - margin.bottom;

  let xScale = scaleTime();
  let yScale = scaleLinear();

  let lineFn = line();
  let xAxisFn = axisBottom();
  let yAxisFn = axisLeft();

  let xAxis, yAxis;

  export let data;
  export let index = 0;

  $: {
    xScale = xScale
      .range([0, gWidth])
      .domain(extent(data, d => d.date));
    yScale = yScale
      .range([gHeight, 0])
      .domain(extent(data, d => d.close));

    lineFn = lineFn.x(d => xScale(d.date)).y(d => yScale(d.close));

    // Don't need to reassign axis generators as they aren't used in the markup
    xAxisFn.scale(xScale);
    yAxisFn.scale(yScale);

    xAxis && select(xAxis).call(xAxisFn);
    yAxis && select(yAxis).call(yAxisFn);
  }
</script>

<svg {width} {height}>
  <g transform="translate({margin.left}, {margin.top})">
    {#if index % 2 === 0}
      <path
        transition:draw={{ duration: 1200 }}
        class="line"
        d={lineFn(data)}
        fill="none"
        stroke="steelblue"
        stroke-width="1.5" />
    {/if}
    <g
      bind:this={xAxis}
      class="axis x-axis"
      transform="translate(0, {gHeight})" />
    <g bind:this={yAxis} class="axis y-axis" />
  </g>
</svg>

<style lang="scss">
.axis {
  .domain {
    display: none;
  }
}
</style>
