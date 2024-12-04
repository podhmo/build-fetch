# build-fetch

Utilities for building specialised fetch().

https://jsr.io/@podhmo/build-help

## how to use

withTrace

```ts
import { withTrace } from "jsr:@podhmo/build-fetch"

const fetch = withTrace(globalThis.fetch);
const response = await fetch("https://httpbin.org/status/200");
console.log(response.status);
```