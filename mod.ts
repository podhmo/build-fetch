/** build specialized fetch() utilities  */
export type Fetch = typeof globalThis.fetch;

function onErrorDefault(response: Response): Error {
  return new Error(
    `Error: ${response.status} - ${response.statusText} -- ${response.url}`,
  );
}

/** build fetch() for tracing request/rseponse */
export function withTrace(
  inner: Fetch,
  options?: {
    onError?: (response: Response) => Error;
    skipConsumeBody?: boolean;
  },
): Fetch {
  options = options ?? {};
  if (options.onError === undefined) {
    options.onError = onErrorDefault;
  }
  const skipConsumeBody = options.skipConsumeBody ?? false;

  return async function fetchWithTrace(
    url: Parameters<Fetch>[0],
    init?: Parameters<Fetch>[1],
  ) {
    const headers = init?.headers as Record<string, string> ?? {};

    // trace request to stderr
    console.error({ url, method: init?.method, headers, body: init?.body });

    const response = await inner(url, { ...init, headers });

    // trace response to stderr
    if (!response.ok) {
      if (skipConsumeBody) {
        console.error({ response });
        throw onErrorDefault(response);
      }

      // warning: consume the response body
      const contentType = response.headers.get("Content-Type");
      if (
        typeof contentType === "string" &&
        contentType.toLowerCase().includes("application/json")
      ) {
        console.error({ response, json: await response.json() });
        throw onErrorDefault(response);
      } else {
        // TODO: skip binary response

        console.error({ response, text: await response.text() });
        throw onErrorDefault(response);
      }
    }

    // when it is normal, I don't want to consume the response
    console.error({ response });
    return response;
  };
}