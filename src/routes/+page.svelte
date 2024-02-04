<script>
  import { Canvas } from '@threlte/core';
  import { cn } from '$lib/utils';
  import { Send } from 'lucide-svelte';
  import { applyAction, deserialize } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import Footer from '$components/Footer.svelte';
  import Scene from '$components/sleeve/scene.svelte';
  import { preparePageTransition } from '$lib/page-transition';
  import { doRecaptcha } from '$lib/utils/recaptcha';

	/** @type {import('./$types').ActionData} */
	export let form;

  preparePageTransition();

    /** @param {{ currentTarget: EventTarget & HTMLFormElement}} event */
  async function onSubmitPassword(event) {
		const data = new FormData(event.target);
    const response = await fetch(event.target.action, {
			method: 'POST',
			body: data
		});

		const result = deserialize(await response.text());
    if (result.type === 'success') {
			await invalidateAll();
		}

		applyAction(result);
  }

  /** @param {{ currentTarget: EventTarget & HTMLFormElement}} event */
  async function onSubscribe(event) {
    const token = await doRecaptcha();
		const data = new FormData(event.target);
    data.set('_t', token);

    const response = await fetch(event.target.action, {
			method: 'POST',
			body: data
		});

		const result = deserialize(await response.text());
    form = result.data;
    if (result.type === 'success') {
			// rerun all `load` functions, following the successful update
			await invalidateAll();
		}

		applyAction(result);
  }

  /** @type {import('./$types').PageData} */
  export let data;

  let screenSize;

  $: products = data.products;
</script>

<svelte:head>
  <title>Stiff Sleeve Co.</title>
</svelte:head>

<svelte:window bind:innerWidth={screenSize} />

{#if !data.authenticated}
  <div class="h-full w-full flex flex-col justify-center gap-y-20 items-center">  
    <form 
      class="group flex flex-col gap-4 mt-36"
      action="?/password"
      method="post"
      on:submit|preventDefault={onSubmitPassword}
    >
      <input
        name="password"
        class={cn(
          'font-[Aachen] placeholder:text-neutral-400 px-2 py-4 w-[300px] rounded-sm focus:placeholder:text-neutral-600  outline-none bg-stone-200 text-center',
          {
            ' placeholder:text-red-600': form?.password?.success === false
          }
        )}
        placeholder={form?.password?.message || "enter password"}
      />
      <button type="submit" class="bg-black hover:bg-black/80 text-white py-2.5 px-2 rounded-sm font-[Aachen]">view website</button>
    </form>

    <form
      class="group flex flex-row gap-0 mt-36 -mb-36"
      action="?/subscribe"
      method="POST"
      on:submit|preventDefault={onSubscribe}
    >
      <input
        name="email"
        class={cn(
          'font-[Aachen] placeholder:text-neutral-400 px-2 py-4 w-[300px] rounded-sm focus:placeholder:text-neutral-600  outline-none bg-stone-200 text-center',
        )}
        placeholder="enter email for updates"
      />
      <button type="submit" class="font-[Aachen] hover:bg-black/80 rounded-e-sm px-4 py-2 bg-black">
        <Send class="w-4 h-4 text-white" />
      </button>
    </form>
    <p class={cn(
      'font-[Aachen] text-center mt-24 min-h-[1.5em]',
      {
        'text-green-600': form?.subscribe?.success === true,
        'text-red-600': form?.subscribe?.success === false
      }
    )}>
      {#if form?.subscribe}
        {form?.subscribe?.message}
      {/if}
    </p>
    
  </div>
{:else}
  <div class="h-full max-w-[1400px] w-full mx-auto">
    <div class="h-[133%] mt-24 md:mt-0 md:h-full grid grid-cols-1 md:grid-cols-2">
      {#each products as { node: product }}
        <a data-sveltekit-preload-data href="/product/{product.handle}" class="relative h-[400px] md:h-full w-full" style="pointer-events: none;">
          <Canvas style="pointer-events: auto;">
            <Scene product={product} />
          </Canvas>
        </a>
      {/each}

      
    </div>

    <div class="relative md:absolute md:bottom-0 md:left-0 w-full">
      <Footer />
    </div>
  </div>
{/if}

<style>
  .grecaptcha-badge { 
    visibility: hidden !important;
  }
</style>



