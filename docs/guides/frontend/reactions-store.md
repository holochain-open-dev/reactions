# Frontend Docs >> ReactionsStore ||20

The `ReactionsStore` is a JS class that contains `svelte` stores, to which you can subscribe to get reactive updates in your elements.

```js
import { ReactionsStore } from "@holochain-open-dev/reactions";

const config = {
  avatarMode: "identicon",
  additionalFields: ["Location", "Bio"], // Custom app level reaction fields
};
const store = new ReactionsStore(cellClient, config);
```

> Learn how to setup the `CellClient` object [here](https://www.npmjs.com/package/@holochain-open-dev/cell-client).

The config for the `ReactionsStore` has these options:

```ts
export interface ReactionsConfig {
  zomeName: string; // default: 'reactions'
  avatarMode: "identicon" | "avatar"; // default: 'avatar'
  additionalFields: string[]; // default: []
  minNicknameLength: number; // default: 3
}
```

Learn more about the stores and how to integrate them in different frameworks [here](https://holochain-open-dev.github.io/reusable-modules/frontend/using/#stores).
