# Frontend Docs >> ReactionsService ||30

The `ReactionsService` is a state-less class that provides typings wrapping the zome calls that can be made to `hc_zome_reactions`.

```js
import { ReactionsService } from '@holochain-open-dev/reactions';

const service = new ReactionsService(cellClient);

service.getMyReaction().then(myReaction => console.log(myReaction));
```

Learn more about the services [here](https://holochain-open-dev.github.io/reusable-modules/frontend/using/#services). 