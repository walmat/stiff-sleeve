<script>
  import { Canvas } from '@threlte/core';
  import { cn } from '$lib/utils';
  import { Instagram, Send } from 'lucide-svelte';
  import { applyAction, deserialize } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import Scene from '$components/sleeve/scene.svelte';
  import { preparePageTransition } from '$lib/page-transition';

	/** @type {import('./$types').ActionData} */
	export let form;

  let sitekey = '6LeRFqAoAAAAAHYzIU-yIYgs7jP_ZMmwcuF_1Naz'

  preparePageTransition();

  async function doRecaptcha() {
    return new Promise((resolve, reject) => {
      grecaptcha.ready(async function() {
        grecaptcha.execute(sitekey, { action: "submit" }).then(function(token) {
          resolve(token);
        }, function(error){
          reject(error);
        });
      });
    });
  }

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
    console.log(result);
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
  <div class="h-full grid grid-cols-1 w-full max-w-full">
    {#each products as { node: product }}
      <a data-sveltekit-preload-data href="/product/{product.handle}" class="relative h-full w-full">
        <Canvas>
          <Scene product={product} />
        </Canvas>

        <button class="font-[Aachen] absolute bottom-10 md:bottom-24 bg-black text-white rounded-md px-6 py-2 flex left-1/2 transform -translate-x-1/2">SHOP NOW</button>
      </a>
    {/each}
  </div>
{/if}

<div class="flex justify-between w-full px-6 py-4">
  <a rel="noreferrer" class="flex gap-2 items-center justify-start" target="_blank" href="https://www.instagram.com/stiffsleeve/">
    <Instagram />
    Stiff Sleeve Co
  </a>

  <p class="text-sm">
    © {new Date().getFullYear()} Stiff Sleeve Co.
  </p>
</div>

<style>
  .grecaptcha-badge { 
    visibility: hidden !important;
  }
</style>



