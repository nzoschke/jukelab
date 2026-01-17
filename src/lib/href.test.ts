import { base } from "$app/paths";
import { assert, test } from "vitest";
import { href, ishref } from "./href";

test("href", async () => {
  assert.equal(href("/foo"), `${base}/foo`);
  assert.isTrue(ishref("/foo", { pathname: `${base}/foo` } as URL));
});
