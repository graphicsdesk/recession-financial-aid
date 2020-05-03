<script>

</script>

<style>
  scroller-background {
    display: block;
    width: 100%;
    will-change: transform;
    z-index: 1;
    position: sticky;
    top: 0;
    /* -webkit-transform: translate3d(0, 0, 0); */
  }

  scroller-foreground {
    display: block;
    position: relative;
    z-index: 2;
    margin-top: -60vh;
    /* pointer-events: none; */
  }
</style>

<scroller-background>
  <slot name="background" />
</scroller-background>

<scroller-foreground>
  <slot name="foreground" />
</scroller-foreground>
