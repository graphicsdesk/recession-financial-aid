<script>
  import { draw } from 'svelte/transition';
  import { select } from 'd3-selection';
  import { line } from 'd3-shape';
  import { scaleTime, scaleLinear } from 'd3-scale';
  import { extent } from 'd3-array';
  import { axisBottom, axisLeft } from 'd3-axis';

  const width = document.body.clientWidth;
  const height = document.body.clientHeight;
  const margin = { top: 50, bottom: 50, left: 50, right: 50 };

  let xScale = scaleTime().range([ 0, width - margin.left - margin.right ]);
  let yScale = scaleLinear().range([ height - margin.bottom - margin.top, 0 ]);

  let lineFn = line();
  let xAxisFn = axisBottom().ticks(width / 100);
  let yAxisFn = axisLeft();

  let xAxis, yAxis;

  export let data;
  export let index = 0;

  $: {
    xScale = xScale.domain(extent(data, d => d.date));
    yScale = yScale.domain(extent(data, d => d.close));

    lineFn = lineFn.x(d => xScale(d.date)).y(d => yScale(d.close));
    xAxisFn = xAxisFn.scale(xScale);
    yAxisFn = yAxisFn.scale(yScale);

    xAxis && select(xAxis).call(xAxisFn);
    yAxis && select(yAxis).call(yAxisFn);
  }
</script>

<svg viewBox="0 0 {width} {height}" width={width} height={height}>
  <g transform="translate({margin.left}, {margin.top})">
    {#if index % 2 === 0}
      <path
        transition:draw={{ duration: 1200 }}
        class=line
        d={lineFn(data)}
        fill=none
        stroke=steelblue
        stroke-width=1.5
      ></path>
    {/if}
    <g bind:this={xAxis} transform="translate(0, {height - margin.bottom - margin.top})"></g>
    <g bind:this={yAxis}></g>
  </g>
</svg>

<style>
  .line {
    vector-effect: non-scaling-stroke;
  }
</style>
