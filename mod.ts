/** build specialized fetch() utilities  */
export type Fetch = typeof globalThis.fetch;

function onErrorDefault(response: Response): Error {
  return new Error(`Error: ${response.status} - ${response.statusText}`);
}

/** build fetch() for tracing request/rseponse */
export function withTrace(
  inner: Fetch,
  options?: { onError?: (response: Response) => Error },
): Fetch {
  options = options ?? {};
  if (options.onError === undefined) {
    options.onError = onErrorDefault;
  }

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
      console.error({ response, text: await response.text() });
      throw onErrorDefault(response);
    }
    console.error({ response }); // when it is normal, I don't want to consume the response
    return response;
  };
}
