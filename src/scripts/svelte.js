import App from '../components/App.svelte';

// Render root Svelte component. Run in page.js

const target = document.getElementById('tuition-lead-root');

export default function() {
  new App({
    target,
    intro: true,
    props: {
      steps: JSON.parse(target.getAttribute('data-steps')),
    }
  });
}
