<script>
  import "../app.css";
  import '../fonts.css';
  import {Instagram} from 'lucide-svelte';
  import Header from '$components/Header.svelte';
  import ShoppingCart from '$components/ShoppingCart.svelte';
  import { getCartItems, cartOpen, cartItems } from '$lib/utils/store';
  import { onMount } from 'svelte';
  import { createCart } from '$lib/utils/shopify';
  let cartId;
  let checkoutUrl;
  let cartCreatedAt;

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

  let screenSize;
</script>

<svelte:window bind:innerWidth={screenSize} />

<main class={`text-black h-full min-h-full flex flex-col overflow-hidden`}>
  {#if $cartOpen}
    <ShoppingCart
      items={$cartItems}
      on:click={hideCart}
      on:removeProduct={removeProduct}
      on:addProduct={addToCart}
      on:getCheckoutUrl={getCheckoutUrl}
      bind:loading
    />
  {/if}
  <Header />
  <div class="flex h-full w-full min-h-full pb-[126px]">
    <slot />
  </div>

  <div class="absolute flex justify-between bottom-0 bg-[#FAF9F6] left-0 w-full px-6 py-4">
    <a class="flex gap-2 items-center justify-start" target="_blank" href="https://www.instagram.com/stiffsleeveco/">
      <Instagram />
      stiffsleeveco
    </a>

    <p class="text-sm">
      © {new Date().getFullYear()} Stiff Sleeve Co.
    </p>
  </div>
</main>

