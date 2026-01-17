import { PUBLIC_ORIGIN } from "$env/static/public";
import { assert, test } from "vitest";
import { href, ishref } from "./href";

test("href", async () => {
  assert.equal(href("/foo"), `${PUBLIC_ORIGIN}/foo`);
  assert.isTrue(ishref("/foo", new URL(`${PUBLIC_ORIGIN}/foo`)));
});
