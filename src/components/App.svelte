<script>
  import { onMount } from 'svelte';
  import Scroller from './Scroller.svelte';
  import LineChart from './LineChart.svelte';
  import scrollama from 'scrollama';
  import debounce from 'just-debounce-it';

  export let steps;

  let index;
  const scroller = scrollama();
  onMount(() => {
    scroller
      .setup({
        step: '.step',
      })
      .onStepEnter(response => {
        index = response.index;
      });
  });

  let width = document.body.clientWidth;
  let height = document.body.clientHeight;
  assignDimensions();

  let handleResize = debounce(() => {
    scroller.resize();
    assignDimensions();
  }, 200);

  function assignDimensions() {
    width = Math.min(1050, document.body.clientWidth);
    height = document.body.clientHeight;
  }

  const x = [];
</script>

<style lang="scss">
  $step-margin-left: 120px;
  $step-max-width: 470px;

  .step {
    padding-top: 0;
    padding-bottom: 80vh;

    p {
      padding: 20px;
      margin: 0 0 0 $step-margin-left;
      font-family: Georgia, serif;
      font-size: 20px;
      line-height: 30px;
      background: hsla(0, 0%, 100%, 0.9);
      box-shadow: 0 2px 5px 0 #e4e4e4;
      width: calc(100% - 40px);
      max-width: $step-max-width;
    }
  }

  @media (max-width: $step-max-width + 2 * $step-margin-left) {
    .step p {
      margin: 0 auto;
      box-sizing: border-box;
    }
  }
</style>

<svelte:window on:resize={handleResize} />

<Scroller>
  <div slot="background">
    <LineChart {index} {width} {height} />
  </div>

  <div slot="foreground">
    {#each steps as step}
      <div class="step">
        <p>
          {@html step}
        </p>
      </div>
    {/each}
  </div>
</Scroller>
