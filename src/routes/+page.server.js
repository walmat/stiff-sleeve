import { getAllProducts } from '$lib/utils/shopify';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function load({ url }) {
  const res = await getAllProducts();
  if (res.status === 200) {
    const products = res.body?.data?.products?.edges;
    if (products) {
      return { products: [products[0]] };
    }
    throw error(404);
  } else {
    throw error(res.status);
  }
}
