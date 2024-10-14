import { assert, test } from "vitest";
import { href, ishref } from "./href";

test("href", async () => {
  assert.equal(href("/foo"), "http://localhost:5173/foo");
  assert.isTrue(ishref("/foo", new URL("http://localhost:5173/foo")));
});
