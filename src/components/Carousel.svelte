<script>
  export let items = [];
</script>

<div class="relative w-full overflow-scroll bg-light">
  <div class="flex">
    {#each items as item (item.node.id)}
      <img
        alt={item.node.title}
        class="h-full"
        decoding="async"
        loading="lazy"
        src={item.node.originalSrc}
      />
    {/each}
  </div>
</div>

<style>
  @-webkit-keyframes scroll {
    0% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
    100% {
      -webkit-transform: translateX(calc(-250px * 7));
      transform: translateX(calc(-250px * 7));
    }
  }

  @keyframes scroll {
    0% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
    100% {
      -webkit-transform: translateX(calc(-250px * 7));
      transform: translateX(calc(-250px * 7));
    }
  }

  .slider::after {
    -webkit-transform: rotateZ(180deg);
    transform: rotateZ(180deg);
  }

  .slider .slide-track {
    -webkit-animation: scroll 40s linear infinite;
    animation: scroll 40s linear infinite;
  }
</style>
