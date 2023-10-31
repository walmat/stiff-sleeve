import { getAllProducts } from '$lib/utils/shopify';
import { createCustomer } from '$lib/server/newsletter';
import { authenticateUser, createSession } from '$lib/server/auth';
import { error, fail, redirect } from '@sveltejs/kit';
import { getPassword } from '$lib/server/sanity';

/** @type {import('./$types').RequestHandler} */
export async function load(event) {
  const authenticated = await authenticateUser(event);
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
    const _p = await getPassword();

    const data = await request.formData();
    const password = data.get("password");
    if (!password || password !== _p) {
      return fail(400, {
        password: {
          success: false,
          message: "Incorrect password",
        }
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
  
  subscribe: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    if (!email) {
      return fail(400, {
        subscribe: {
          success: false,
          message: 'Email is required',
        }
      })
    };

    const sk = import.meta.env.VITE_RECAPTCHA_SECRET_KEY;
    const token = data.get('_t');
    if (!token) {
      return fail(400, {
        subscribe: {
          success: false,
          message: 'Recaptcha token is required',
        }
      })
    }

    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${sk}&response=${token}`;

    const response = await fetch(url, {
      method: 'post',
    })

    if (!response.ok) {
      return fail(400, {
        subscribe: {
          success: false,
          message: 'Recaptcha token is invalid',
        }
      })
    }

    const json = await response.json();
    if (!json.success) {
      return fail(400, {
        subscribe: {
          success: false,
          message: 'Recaptcha token is invalid',
        }
      })
    }

    const customer = await createCustomer(email);
    if (!customer.body.data.customerCreate.customer) {
      if (customer.body.data.customerCreate.userErrors[0].message === 'Email has already been taken') {
        return fail(400, {
          subscribe: {
            success: false,
            message: 'You are already subscribed to the newsletter',
          }
        })
      }

      return fail(400, {
        subscribe: {
          success: false,
          message: customer.body.data.customerCreate.userErrors[0].message ?? 'Failed to subscribe to newsletter',
        }
      })
    }

    return {
      subscribe: {
        success: true,
        message: 'Subscribed to the newsletter'
      }
    }
  }
}