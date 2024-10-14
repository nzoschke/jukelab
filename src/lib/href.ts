import { PUBLIC_ORIGIN } from "$env/static/public";

export const href = (path: string) => {
  // skip absolute or inlined data URLs
  if (path.startsWith("data:")) return path;
  if (path.startsWith(PUBLIC_ORIGIN)) return path;

  return PUBLIC_ORIGIN + path;
};

export const ishref = (path: string, url: URL) => {
  return url.href == href(path);
};
