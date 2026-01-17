import { base } from "$app/paths";

export const href = (path: string) => {
  // skip absolute or inlined data URLs
  if (path.startsWith("data:")) return path;

  return base + path;
};

export const ishref = (path: string, url: URL) => {
  return url.pathname == href(path);
};
