<script>
  import { fade } from 'svelte/transition';

  export let line, xScale, yScale;

  let lastIndex;
  $: {
    let i = line.values.length - 1;
    while (line.values[i] === undefined) i--;
    lastIndex = i;
  }
</script>

<style>
  text {
    fill: #bbb;
  }
  text.highlight {
    fill: #121212;
  }
</style>

<text
  transition:fade={{ duration: 100 }}
  class={line.name === 'Columbia' ? 'highlight' : ''}
  x={xScale(2003 + lastIndex) + 6}
  y={yScale(line.values[lastIndex])}
>
  {line.name}
</text>
