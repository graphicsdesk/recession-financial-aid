<script>
  import Scroller from './Scroller.svelte';
  import LineChart from './LineChart.svelte';
  import stocksRaw from '../../data/stocks.json';

  const stocks = stocksRaw
    .map(d => ({ date: new Date(d.date), close: d.close }))
    .sort((a, b) => a.date - b.date);

  let index;
</script>

<style>
  section { height: 80vh; }
</style>

<Scroller bind:index>
  <div slot="background">
    <LineChart data={stocks}/>
    <p>Section {index + 1} is currently active.</p>
  </div>

  <div slot="foreground">
    <section>This is the first section.</section>
    <section>This is the second section.</section>
    <section>This is the third section.</section>
  </div>
</Scroller>
