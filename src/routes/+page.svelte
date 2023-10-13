<script>
  import { Canvas } from '@threlte/core';
  import { cn } from '$lib/utils';
  import Scene from '$components/sleeve/scene.svelte'
  import { preparePageTransition } from '$lib/page-transition';

  preparePageTransition();

  /** @type {import('./$types').PageData} */
  export let data;

  export let form;

  let screenSize;

  $: products = data.products;
</script>

<svelte:head>
  <title>Stiff Sleeve Co.</title>
</svelte:head>

<svelte:window bind:innerWidth={screenSize} />

{#if !data.authenticated}
  <main class="h-full w-full flex flex-col justify-center gap-y-20 items-center">  
      
    <form 
      class="group flex flex-col gap-2"
      action="?/password"
      method="post"
    >
      <input name="password" class={cn(
        'font-[Aachen] placeholder:text-neutral-400 px-2 py-3 rounded-sm focus:placeholder:text-neutral-600 bg-transparent outline-none focus:bg-stone-200 text-center',
        {
          ' placeholder:text-red-600': form?.success === false
        }
      )} placeholder={form?.message || "enter password"} />
      <button type="submit" class="group:focus:bg-black font-[Aachen]">view website</button>
    </form>
  </main>
{:else}
  <main class="h-full grid grid-cols-1 w-full max-w-full">
    {#each products as { node: product }}
      <a data-sveltekit-preload-data href="/product/{product.handle}" class="relative w-full">
        <Canvas>
          <Scene product={product} position={[0, screenSize < 400 ? -1 : 0, 0]} />
        </Canvas>
      </a>
    {/each}
  </main>
{/if}

