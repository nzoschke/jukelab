import { PUBLIC_ORIGIN } from "$env/static/public";

export const href = (path: string) => {
  // skip inlined data URLs
  if (path.startsWith("data:")) return path;

  return PUBLIC_ORIGIN + path;
};

export const ishref = (path: string, url: URL) => {
  return url.href == href(path);
};
