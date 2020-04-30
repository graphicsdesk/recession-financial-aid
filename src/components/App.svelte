<script>
  import { onMount } from 'svelte';
  import Scroller from './Scroller.svelte';
  import LineChart from './LineChart.svelte';
  import scrollama from 'scrollama';
  import throttle from 'lodash.throttle';

  export let steps, data;

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

  let handleResize = throttle(() => {
    scroller.resize();
    console.log('hi')
  }, 200);

</script>

<svelte:window on:resize={handleResize}/>

<Scroller>
  <div slot="background">
    <LineChart data={data} index={index}/>
  </div>

  <div slot="foreground">
    {#each steps as step}
      <div class="step">
        <p>{@html step}</p>
      </div>
    {/each}
  </div>
</Scroller>

<style>
  .step {
    padding-top: 0;
    padding-bottom: 80vh;
  }

  .step p {
    padding: 20px;
    margin: 0 0 0 120px;
    font-family: Georgia, serif;
    font-size: 20px;
    line-height: 30px;
    background: hsla(0,0%,100%,.9);
    box-shadow: 0 2px 5px 0 #e4e4e4;
    width: calc(100% - 40px);
    max-width: 470px;
  }
</style>
