<script>
</script>

<svelte-scroller-outer>
  <svelte-scroller-background>
    <slot name="background"></slot>
  </svelte-scroller-background>

  <svelte-scroller-foreground>
    <slot name="foreground"></slot>
  </svelte-scroller-foreground>
</svelte-scroller-outer>

<style>
  svelte-scroller-outer {
    display: block;
    position: relative;
  }

  svelte-scroller-background {
    display: block;
    position: relative;
    width: 100%;
    will-change: transform;
    z-index: 1;
    position: sticky;
    top: 0;
    /* -webkit-transform: translate3d(0, 0, 0); */
  }

  svelte-scroller-foreground {
    display: block;
    position: relative;
    z-index: 2;
  }
</style>
