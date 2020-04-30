<script>
  import LineChart from './LineChart.svelte';
  import stocksRaw from '../../data/stocks.json';

  const stocks = stocksRaw
    .map(d => ({ date: new Date(d.date), close: d.close }))
    .sort((a, b) => a.date - b.date);
</script>

<LineChart data={stocks}/>
