import { getProduct } from '$lib/utils/shopify';
import { error, redirect } from '@sveltejs/kit';
import { authenticateUser } from '../../../lib/server/auth.js';

export async function load(event) {
  const { params } = event;

  const authenticated = await authenticateUser(event);
  if (!authenticated) throw redirect(302, '/');

  const res = await getProduct(params.handle);

  if (res.status === 200) {
    const product = res.body?.data?.productByHandle;
    if (product) {
      return {
        product,
        authenticated,
      };
    }

    throw error(404)
  } else {
    throw error(res.status)
  }
}
