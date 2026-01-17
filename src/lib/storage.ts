const isBrowser = () =>
  typeof window !== "undefined" && typeof localStorage?.getItem === "function";

export const hash = (key: string) => {
  if (typeof window === "undefined") return;
  for (const kv of window.location.hash.substring(1).split("&")) {
    const [k, v] = kv.split("=");
    if (k == key) return v;
  }
};

export const check = (key: string, value: unknown) => {
  if (!isBrowser()) return false;
  const i = localStorage.getItem(`jukelab:${key}`);
  const v = i ? JSON.parse(i) : undefined;
  return v == value;
};

export const get = <T>(key: string, def: T): T => {
  const v = hash(key);
  if (v) return v as T;

  if (!isBrowser()) return def;
  const i = localStorage.getItem(`jukelab:${key}`);
  return i ? JSON.parse(i) : def;
};

export const rem = (key: string) => {
  if (!isBrowser()) return;
  localStorage.removeItem(`jukelab:${key}`);
};

export const remPrefix = (prefix: string) => {
  if (!isBrowser()) return;
  Object.keys(localStorage)
    .filter((k) => k.startsWith(`jukelab:${prefix}`))
    .forEach((k) => localStorage.removeItem(k));
};

export const set = (key: string, value: unknown) => {
  if (!isBrowser()) return;
  localStorage.setItem(`jukelab:${key}`, JSON.stringify(value));
};
