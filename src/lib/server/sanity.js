export async function getPassword() {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
  const dataset = import.meta.env.VITE_SANITY_DATASET;

  const res = await fetch(`https://${projectId}.api.sanity.io/v2023-08-01/graphql/${dataset}/stiff-sleeve`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query {
          Config(id: "74ca6123-73ed-413b-b3db-79feb5663234") {
            password
          }
        }
      `,
      variables: {
        id: "74ca6123-73ed-413b-b3db-79feb5663234"
      }
    })
  });

  if (res.status !== 200) {
    return {
      status: res.status,
      error: 'Unable to fetch password'
    }
  }

  const { data } = await res.json();
  return data.Config ? data.Config.password : null;
}