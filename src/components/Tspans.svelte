<script>
  export let text, x;
  export let useOutline = true;
  export let lineHeight = 20;

  $: lines = text.split('\n');
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
  <tspan {x} class:useOutline dy={i === 0 ? 0 : lineHeight}>{line}</tspan>
  {#if useOutline}
    <tspan {x}>{line}</tspan>
  {/if}
{/each}
