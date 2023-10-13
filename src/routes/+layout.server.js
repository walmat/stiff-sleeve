import { authenticateUser } from '$lib/server/auth';

/** @type {import('./$types').RequestHandler} */
export async function load(event) {
  const authenticated = authenticateUser(event);
  return { authenticated };
}