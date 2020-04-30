import App from '../components/App.svelte';
import stocksRaw from '../../data/stocks.json';

const stocks = stocksRaw
  .map(d => ({ date: new Date(d.date), close: d.close }))
  .sort((a, b) => a.date - b.date);

// Render root Svelte component. Run in page.js

const target = document.getElementById('tuition-lead-root');

export default function() {
  new App({
    target,
    intro: true,
    props: {
      steps: JSON.parse(target.getAttribute('data-steps')),
      data: stocks,
    }
  });
}
