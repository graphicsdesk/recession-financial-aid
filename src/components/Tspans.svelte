<script>
  export let text, x;
  export let useOutline = true;
  export let lineHeight = 20;
  export let bottomAlign = false;

  $: lines = text.split('\n');

  $: initialDY = bottomAlign ? -lineHeight * (lines.length - 1) : 0;
</script>

<style>
  .useOutline {
    stroke: #fff;
    opacity: 0.8;
    stroke-width: 3.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>


{#each lines as line, i}
  <tspan {x} class:useOutline dy={i === 0 ? initialDY : lineHeight}>
    {line}
  <!-- prettier-ignore -->
  </tspan>{#if useOutline}
    <tspan {x}>{line}</tspan>
  {/if}
{/each}
