import App from '../components/App.svelte';

// Render root Svelte component. Run in page.js

export default function() {
  new App({
    target: document.getElementById('tuition-lead-root'),
    intro: true,
  });
}
