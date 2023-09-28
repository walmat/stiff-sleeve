<script>
  import { cn } from '$lib/utils';
  import { onMount } from 'svelte';
  import { Canvas } from '@threlte/core';
  import * as Select from "$components/ui/select";
  import Carousel from '$components/carousel';;
  import { browser } from '$app/environment';
  import { getCartItems } from '$lib/utils/store.js';
  import Scene from "$components/sleeve/scene.svelte";
  import { getProduct } from '$lib/utils/shopify';
  import { writable } from 'svelte/store';

  /** @type {import('./$types').PageData} */
  export let data;

  // Create a writable store for product data
  export const productData = writable(data);

  // Function to fetch product data
  async function fetchProductData() {
    const pageHandle = window.location.pathname.split('/')[2];
    const res = await getProduct(pageHandle);

    if (res.status === 200) {
      const product = res.body?.data?.productByHandle;
      if (product) {
        productData.set({
          product,
        });
      }
    }

    isSoldOut = $productData?.product?.variants?.edges.every((variant) => {
      return variant.node.availableForSale === false;
    });
  }

  onMount(async () => {
    await fetchProductData();
    setInterval(fetchProductData, 5_000);
  });

  let carousel;
  let selectedOptions = {};
  let cartLoading = false;
  let sizeSoldOut = false;

  let isSoldOut = $productData?.product?.variants?.edges.every((variant) => {
    return variant.node.availableForSale === false;
  });

  $productData?.product?.options.forEach((option) => {
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

    $productData.product.variants.edges.forEach((variant) => {
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

  let screenSize;
</script>

<svelte:head>
  <title>{$productData.product.title}</title>
</svelte:head>

<svelte:window bind:innerWidth={screenSize} />

<div class="h-full w-full">
  {#if $productData.product}
    <div class="flex flex-col h-full w-full">
      <div class="flex flex-col w-full max-w-[60rem] max-h-[2/3] mx-auto h-2/3">
        {#if browser}
          <Carousel
            bind:this={carousel}
            dots={false}
          >
            <Canvas>
              <Scene product={$productData.product} position={[0, screenSize < 640 ? -1 : 0, 0]} />
            </Canvas>

            {#each $productData.product.images.edges as image}
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
        {#each $productData.product.options as option}
          <div class="flex">
            <Select.Root bind:selected={selectedOptions[option.name]} onSelectedChange={e => selectedOptions[option.name] = e.value}>
              <Select.Trigger class="w-full">
                <Select.Value placeholder="Select a {option.name.toLowerCase()}" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {#each $productData.product.variants.edges as variant}
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
    border: 2px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
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
