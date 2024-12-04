import { parseArgs } from "jsr:@std/cli@1.0.7/parse-args";
import { withTrace } from "../mod.ts";

// $ deno run -A examples/hello.ts
// $ deno run -A examples/hello.ts --debug

async function main() {
  const args = parseArgs(Deno.args, {
    boolean: ["debug"],
  });

  let fetch = globalThis.fetch;
  if (args.debug) {
    fetch = withTrace(fetch);
  }

  // 200
  {
    const url = "https://httpbin.org/json";
    console.log("%crequesting...", "color: font-style: italic;");
    const response = await fetch(url, { method: "GET" });
    console.log(
      `%cresponse... ${response.status}`,
      "color: font-style: italic;",
    );
    const data = await response.json();

    console.log("");
    console.log(data.slideshow.title);
  }

  {
    const url = "https://httpbin.org/status/400";
    console.log("%crequesting...", "color: font-style: italic;");
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ "hello": "world" }),
    });
    console.log(
      `%cresponse... ${response.status}`,
      "color: font-style: italic;",
    );
    const data = await response.json();

    console.log("");
    console.log(data.slideshow.title);
  }
}

if (import.meta.main) {
  await main();
}
