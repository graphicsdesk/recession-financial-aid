<script>
  import { fade } from 'svelte/transition';
  import Tspans from './Tspans.svelte';
  import { IVIES } from './constants';

  export let line, xScale, yScale, hovered;

  let lastIndex;
  $: {
    let i = line.values.length - 1;
    while (line.values[i] === undefined) i--;
    lastIndex = i;
  }

  $: x = xScale(2003 + lastIndex) + 6;

  const LONG_LABELS = {
    'nat-income': 'Median U.S.\nIncome',
    'nat-tuition': 'Average tuition for\na private college',
  };
  function longLabel(name) {
    return LONG_LABELS[name] || name;
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

{#if !IVIES.includes(line.name) || hovered}
  <text
    transition:fade={{ duration: 100 }}
    class={line.name === 'Columbia' ? 'highlight' : ''}
    y={yScale(line.values[lastIndex])}
  >
    <Tspans text={longLabel(line.name)} {x} />
  </text>
{/if}
