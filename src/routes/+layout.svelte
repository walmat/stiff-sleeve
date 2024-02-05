<script>
  import "../app.css";
  import '../fonts.css';
  import { afterNavigate } from '$app/navigation';
  import Header from '$components/Header.svelte';
  import ShoppingCart from '$components/ShoppingCart.svelte';
  import { getCartItems, cartOpen, cartItems } from '$lib/utils/store';
  import { page } from '$app/stores';  
  import { onMount } from 'svelte';
  import { cn } from '$lib/utils';
  import { createCart } from '$lib/utils/shopify';
  let cartId;
  let checkoutUrl;
  let cartCreatedAt;

  afterNavigate(() => {
    document.getElementById('page')?.scrollTo(0, 0);
  });

  onMount(async () => {
    if (typeof window !== 'undefined') {
      cartId = JSON.parse(localStorage.getItem('cartId'));
      cartCreatedAt = JSON.parse(localStorage.getItem('cartCreatedAt'));
      checkoutUrl = JSON.parse(localStorage.getItem('cartUrl'));

      let currentDate = Date.now();
      let difference = currentDate - cartCreatedAt;
      let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
      let cartIdExpired = totalDays > 6;
      if (cartId === 'undefined' || cartId === 'null' || cartIdExpired) {
        await callCreateCart();
      }
      await loadCart();
      document.addEventListener('keydown', (e) => {
        let keyCode = e.keyCode;
        if (keyCode === 27) {
          openCartStore.update(value => ({...value, open: false}));
        }
      });
    }
  });

  async function callCreateCart() {
    const cartRes = await createCart();

    if (typeof window !== 'undefined') {
      localStorage.setItem('cartCreatedAt', Date.now());
      localStorage.setItem('cartId', JSON.stringify(cartRes.body?.data?.cartCreate?.cart?.id));
      localStorage.setItem(
        'cartUrl',
        JSON.stringify(cartRes.body?.data?.cartCreate?.cart?.checkoutUrl)
      );
    }
  }

  async function loadCart() {
    const res = await getCartItems();
    cartItems.set(res?.body?.data?.cart?.lines?.edges)
  }

  let loading = false;

  function hideCart() {
    cartOpen.set(false);
  }

  function getCheckoutUrl() {
    window.open(checkoutUrl, '_blank');
    loading = false;
  }

  async function addToCart(event) {
    await fetch('/cart.json', {
      method: 'PATCH',
      body: JSON.stringify({ cartId: cartId, variantId: event.detail.body })
    });
    // Wait for the API to finish before updating cart items
    await loadCart();
    loading = false;
  }

  async function removeProduct(event) {
    if (typeof window !== 'undefined') {
      cartId = JSON.parse(localStorage.getItem('cartId'));
    }
    await fetch('/cart.json', {
      method: 'PUT',
      body: JSON.stringify({
        cartId,
        lineId: event.detail.body.lineId,
        quantity: event.detail.body.quantity,
        variantId: event.detail.body.variantId
      })
    });
    await loadCart();
    loading = false;
  }

	/** @type {import('./$types').LayoutData} */
	export let data;

  let screenSize;

  $: route = $page.url.pathname 
</script>

<svelte:window bind:innerWidth={screenSize} />

<main id="page" class={`text-black h-full min-h-full flex flex-col overflow-y-scroll`}>
  {#if data.authenticated && $cartOpen}
    <ShoppingCart
      items={$cartItems}
      on:click={hideCart}
      on:removeProduct={removeProduct}
      on:addProduct={addToCart}
      on:getCheckoutUrl={getCheckoutUrl}
      bind:loading
    />
  {/if}
  <Header shouldShow={data.authenticated} />
  <div class={
    cn('flex flex-col h-full w-full')
  }>
    <slot />
  </div>
</main>


