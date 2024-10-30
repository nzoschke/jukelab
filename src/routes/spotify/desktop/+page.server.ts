import { validate } from "$lib/spotify/auth";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const err = await validate();
  if (err) return error(401, { message: err });
};
