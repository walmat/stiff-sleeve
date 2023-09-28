import { getProduct, getAllProducts } from '$lib/utils/shopify';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const res = await getProduct(params.handle);

  if (res.status === 200) {
    const product = res.body?.data?.productByHandle;
    if (product) {
      return {
        product
      };
    }

    throw error(404)
  } else {
    throw error(res.status)
  }
}
