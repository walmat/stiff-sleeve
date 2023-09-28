import { writable } from 'svelte/store';
import { shopifyFetch } from '$lib/utils/shopify.js';
import { loadCart } from '$lib/utils/shopify';

export const cartQuantity = writable('');
export const cartItems = writable([]);
export const search = writable('');
export const cartOpen = writable(false);

export const getCartItems = async () => {
  let cartId = JSON.parse(localStorage.getItem('cartId'));

  try {
    const shopifyResponse = await loadCart(cartId);

    let sum = 0;
    shopifyResponse.body?.data?.cart?.lines?.edges?.forEach((d) => {
      sum += d.node.quantity;
    });
    cartItems.set(shopifyResponse.body?.data?.cart?.lines?.edges)
    cartQuantity.set(sum);
    return shopifyResponse;
  } catch (error) {
    console.log(error);
  }
};
