import { authenticateUser } from '$lib/server/auth';

/** @type {import('./$types').RequestHandler} */
export async function load(event) {
  const authenticated = await authenticateUser(event);
  return { authenticated };
}