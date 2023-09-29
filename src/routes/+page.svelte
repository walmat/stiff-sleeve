<script>
  import { Canvas } from '@threlte/core'
  import Scene from '$components/sleeve/scene.svelte'

  import { preparePageTransition } from '$lib/page-transition';

  preparePageTransition();

  /** @type {import('./$types').PageData} */
  export let data;

  let screenSize;

  $: products = data.products;
</script>

<svelte:head>
  <title>Stiff Sleeve Co.</title>
</svelte:head>

<svelte:window bind:innerWidth={screenSize} />

<main class="h-full grid grid-cols-1 w-full max-w-full">
  {#each products as { node: product }}
    <a data-sveltekit-preload-data href="/product/{product.handle}" class="relative w-full">
      <Canvas>
        <Scene product={product} />
      </Canvas>
    </a>
  {/each}
</main>