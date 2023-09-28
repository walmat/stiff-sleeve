<script>
  import { cn } from '$lib/utils';
  import { Canvas } from '@threlte/core';
  import * as Select from "$components/ui/select";
  import Carousel from '$components/carousel';;
  import { browser } from '$app/environment';

  import { getCartItems } from '$lib/utils/store.js';
  import Scene from "$components/sleeve/scene.svelte";

  /** @type {import('./$types').PageData} */
  export let data;


  let carousel;
  let selectedOptions = {};
  let cartLoading = false;
  let sizeSoldOut = false;

  let isSoldOut = data?.body?.product?.variants?.edges.every((variant) => {
    return variant.node.availableForSale === false;
  });

  data?.body?.product?.options.forEach((option) => {
    console.log(data?.body?.product?.variants?.edges);
    selectedOptions = { ...selectedOptions, [option.name]: {
      value: option.values[0],
      label: option.values[0]
    } };
  });

  async function addToCart() {
    if (isSoldOut) return

    cartLoading = true;
    let variantId;
    let cartId;


    if (typeof window !== 'undefined') {
      cartId = JSON.parse(localStorage.getItem('cartId'));
    }

    data.body.product.variants.edges.forEach((variant) => {
      let result = variant.node.selectedOptions.every((option) => {
        return selectedOptions[option.name].value === option.value;
      });

      if (result) {
        variantId = variant.node.id;
      }
    });

    await fetch('/cart.json', {
      method: 'PATCH',
      body: JSON.stringify({ cartId: cartId, variantId: variantId })
    });
    // Wait for the API to finish before updating cart items
    await getCartItems();

    cartLoading = false;
  }

  console.log(selectedOptions)

</script>

<svelte:head>
  <title>{data.body.product.title}</title>
</svelte:head>

<div class="h-full w-full">
  {#if data.body.product}
    <div class="flex flex-col h-full w-full">
      <div class="flex flex-col w-full max-w-[60rem] max-h-[2/3] mx-auto h-2/3">
        {#if browser}
          <Carousel
            bind:this={carousel}
            dots={false}
          >
            <Canvas>
              <Scene product={data.body.product} />
            </Canvas>

            {#each data.body.product.images.edges as image}
              <img
                alt={image.node.altText}
                decoding="async"
                loading="lazy"
                src={image.node.originalSrc}
                draggable="false"
                class="object-contain w-full"
              />
            {/each}
          </Carousel>
        {/if}
      </div>
      <div class="h-1/3 flex flex-col gap-4 p-6 md:w-1/3 md:mx-auto">
        {#each data.body.product.options as option}
          <div class="flex">
            <Select.Root bind:selected={selectedOptions[option.name]} onSelectedChange={e => console.log(e)}>
              <Select.Trigger class="w-full">
                <Select.Value placeholder="Select a {option.name.toLowerCase()}" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#each data.body.product.variants.edges as variant}
                    <Select.Item disabled={!variant.node.availableForSale} value={variant.node.title} label={variant.node.title}
                      >{variant.node.title}</Select.Item
                    >
                  {/each}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
        {/each}
        <button
          on:click={addToCart}
          aria-disabled={isSoldOut}
          class={cn('flex w-full items-center justify-center bg-black rounded-md p-4 text-sm uppercase tracking-wide text-white opacity-90 hover:opacity-100', {
            'opacity-40 hover:opacity-40 cursor-default': isSoldOut || sizeSoldOut
          })}
        >
          {#if isSoldOut || sizeSoldOut}
            Sold Out
          {:else}
            Add to Cart
          {/if}
          {#if cartLoading}
            <div class="lds-ring ml-4">
              <div />
              <div />
              <div />
              <div />
            </div>
          {/if}
        </button>
      </div>
    </div>
    
  {/if}
</div>

<style>
  .lds-ring {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    margin: 2px;
    border: 2px solid #000;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #000 transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>