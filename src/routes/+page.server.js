import { getAllProducts } from '$lib/utils/shopify';
import { authenticateUser, createSession } from '$lib/server/auth';
import { error, fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function load(event) {
  const authenticated = authenticateUser(event);
  const res = await getAllProducts();
  if (res.status === 200) {
    const products = res.body?.data?.products?.edges;
    if (products) {
      return { products: [products[0]], authenticated };
    }
    throw error(404);
  } else {
    throw error(res.status);
  }
}

export const actions = {
	password: async ({ cookies, request, getClientAddress }) => {
    const _p = import.meta.env.VITE_SITE_PASSWORD;

    const data = await request.formData();
    const password = data.get("password");
    if (!password || password !== _p) {
      return fail(400, {
        success: false,
        password,
        message: "Incorrect password",
      });
    }

    // Create a new session for the user
    const sessionId = await createSession(password, getClientAddress());
    cookies.set("_ssid_token", sessionId, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 1, // 1 day
    });

		throw redirect(303, "/")
	},

  subscribe: async ({ params, body }) => {
    console.log('subscribe', params, body)
    return {
      body: {
        message: 'success'
      }
    }
  }
}