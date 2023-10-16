export async function adminFetch({ query, variables }) {
  const endpoint = import.meta.env.VITE_SHOPIFY_API_ENDPOINT;
  const key = import.meta.env.VITE_SHOPIFY_ADMIN_API_ACCESS_TOKEN;

  try {
    const result = await fetch(`${endpoint}/admin/api/2023-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': key
      },
      body: { query, variables } && JSON.stringify({ query, variables })
    });
    
    return {
      status: result.status,
      body: await result.json()
    };
  } catch (error) {
    return {
      status: 500,
      error: 'Error receiving data'
    };
  }
}

export async function createCustomer(email, token) {
  // TODO: Recaptcha validation

  return adminFetch({
    query: ` 
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      input: {
        email,
        acceptsMarketing: true,
      }
    }
  });
}