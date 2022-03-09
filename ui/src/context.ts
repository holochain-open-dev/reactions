import { Context, createContext } from '@holochain-open-dev/context';
import { ReactionsStore } from './reactions-store';

export const reactionsStoreContext: Context<ReactionsStore> = createContext(
  'hc_zome_reactions/store'
);
