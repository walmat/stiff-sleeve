<script>
  import { page } from '$app/stores';
  import Icons from '$components/Icons.svelte';
  import { createEventDispatcher } from 'svelte';
  import { cartQuantity, cartOpen } from '$lib/utils/store';

  const dispatch = createEventDispatcher();

  $: currentRoute = $page.url.pathname;

  async function openCart() {
    dispatch('openCart', true);
    cartOpen.set(true);
  }
</script>

<nav class="flex items-center p-4 lg:px-6">
  <div class="flex w-full items-center">
    <div class="mr-4" class:active={currentRoute === '/'}>
      <a href="/" data-sveltekit-prefetch class="">
        <h1>
          Stiff Sleeve Co.
        </h1>
      </a>
    </div>
  </div>
  <div class="ml-auto flex items-center">
    <button on:click={openCart} class="relative my-2 mx-4">
      <Icons strokeColor="#000" type="cart" />
      <div
        data-test="cart-quantity"
        class="absolute bottom-0 left-0 -ml-3 -mb-3 flex h-5 w-5 items-center justify-center rounded-full border border-black bg-white text-xs text-black"
      >
        {$cartQuantity}
      </div>
    </button>
  </div>
</nav>


<style>
  h1 {
    font-family: 'Aachen';
    font-size: 1.25rem;
  }
</style>