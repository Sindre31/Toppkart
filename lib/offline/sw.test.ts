import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { META_PATH, OFFLINE_CACHE } from "@/lib/offline/store";

/** `public/sw.js` og `public/offline.html` er vanlige filer uten byggsteg, så de
 *  kan ikke importere navnene fra `lib/offline/store.ts`. Skriver sida til én
 *  cache og service workeren leser fra en annen, virker alt på nett og ingenting
 *  i fjellet — så dette er stedet de holdes like. */

const root = join(__dirname, "..", "..");
const sw = readFileSync(join(root, "public", "sw.js"), "utf8");
const offline = readFileSync(join(root, "public", "offline.html"), "utf8");

describe("the service worker and the offline page agree with the store", () => {
  it("read the cache the store writes", () => {
    expect(sw).toContain(`const OFFLINE_CACHE = "${OFFLINE_CACHE}";`);
    expect(offline).toContain(`caches.open("${OFFLINE_CACHE}")`);
  });

  it("read the list from the same file", () => {
    expect(offline).toContain(`c.match("${META_PATH}")`);
  });

  it("precaches the offline page it falls back to", () => {
    expect(sw).toContain(`const OFFLINE_PAGE = "/offline.html";`);
  });
});
