import type { SpecializedFetch } from "../mod.ts";

const baseUrl = "https://httpbin.org";
const endpoints = [
  `${baseUrl}/status/200`,
  `${baseUrl}/status/404`,
  `${baseUrl}/status/500`,
] as const;

const fetch: SpecializedFetch<typeof endpoints[number]> = globalThis.fetch;

// [deno-ts] Argument of type '"https://example.net"' is not assignable to parameter of type '"https://httpbin.org/status/200" | "https://httpbin.org/status/404" | "https://httpbin.org/status/500"'.
// fetch("https://example.net");

const response = await fetch("https://httpbin.org/status/200");
console.log(response.status);
