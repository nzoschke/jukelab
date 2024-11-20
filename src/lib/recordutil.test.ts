import { assert, test } from "vitest";
import { normalizeAlbumTitle, normalizeTrackTitles } from "./recordutil";

test("normalizeAlbumTitle", async () => {
  const cases = [
    ["Foobar", "Foobar"],
    ["Foobar (deluxe)", "Foobar"],
    ["Foobar (Deluxe)", "Foobar"],
    ["Foobar [Deluxe]", "Foobar"],
    ["Foobar [super deluxe]", "Foobar"],
    ["Foobar baz z [20th Anniversary Super Foo]", "Foobar baz z"],
  ];

  cases.forEach(([title, expected]) => {
    assert.equal(normalizeAlbumTitle(title), expected);
  });
});

test("normalizeTrackTitles", async () => {
  interface testCase {
    titles: string[];
    want?: string[]; // empty if no change
  }
  const cases: testCase[] = [
    { titles: [] },
    { titles: ["A"] },
    { titles: ["A", "B", "C"] },
    { titles: ["A - 2024 Remix", "B - 2024 Remix"], want: ["A", "B"] },
    { titles: ["A - x1", "B - x1", "C"], want: ["A", "B", "C"] },
    {
      titles: ["A foo bar - 2023 Remaster", "B x y - 2023 Remaster", "C"],
      want: ["A foo bar", "B x y", "C"],
    },
  ];

  cases.forEach(({ titles, want }) => {
    const [got, ok] = normalizeTrackTitles(titles);
    if (want) {
      assert.isTrue(ok);
      assert.deepEqual(got, want);
    } else {
      assert.isFalse(ok);
    }
  });
});
