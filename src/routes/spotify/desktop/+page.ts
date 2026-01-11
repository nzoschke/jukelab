import { validate } from "$lib/spotify/auth";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  const err = await validate();
  if (err) error(401, { message: err });
};
