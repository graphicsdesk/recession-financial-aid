<script>
  export let text, x;
  export let lineHeight = 20;
</script>

<style>
  .background {
    stroke: #fff;
    opacity: 0.8;
    stroke-width: 3.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>

{#each text.split('\n') as line, i}
  <tspan {x} class="background" dy={i === 0 ? 0 : lineHeight}>{line}</tspan>
  <tspan {x} dy="0">{line}</tspan>
{/each}
