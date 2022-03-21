import { CellClient } from '@holochain-open-dev/cell-client';
import {
  EntryHashB64,
} from '@holochain-open-dev/core-types';
import merge from 'lodash-es/merge';

import { ReactionsService } from './reactions-service';
import { ReactionDetails, ReactionInput } from './types';
import { writable, Writable, derived, Readable } from 'svelte/store';
import { defaultConfig, ReactionsConfig } from './config';



export class ReactionsStore {
  /** Private */
  private _service: ReactionsService;
  private _knownReactionsStore: Writable<Record<EntryHashB64, Array<ReactionDetails>>> = writable({});

  // structure of the svelte writable store:
  //
  // {
  //   entryHash1: [
  //     ReactionDetail1,
  //     ReactionDetail2
  //   ],
  //   entryHash1: [
  //     ReactionDetail1,
  //     ReactionDetail2
  //   ]
  // }


  config: ReactionsConfig;

  constructor(
    protected cellClient: CellClient,
    config: Partial<ReactionsConfig> = {}
  ) {
    this.config = merge(defaultConfig, config);
    this._service = new ReactionsService(cellClient, this.config.zomeName);
  }



  /** Readable stores */

  // Returns a store with the reaction of the specified entry
  reactionsForEntry(entryHash: EntryHashB64): Readable<Array<ReactionDetails>> {
    return derived(this._knownReactionsStore, reactions => reactions[entryHash]);
  }



  /** Actions */

  /**
   * Fetches all the reactions of the specified entry from the DHT
   *
   * You can subscribe to `_knownReactionsStore` to get updated with all the reactions when this call is done
   *
   * Warning! Can be very slow
   */
  async fetchReactionsForEntry(entryHash: EntryHashB64): Promise<void> {
    const allReactions = await this._service.getReactionsForEntry(entryHash);

    this._knownReactionsStore.update(reactions => {
      reactions[entryHash] = allReactions;
      return reactions;
    });
  }

  /**
   * Create new reaction
   *
   * @param input input for the reaction to be created
   */
  async react(input: ReactionInput): Promise<void> {
    const reaction: ReactionDetails = await this._service.react(input); //zome call

    this._knownReactionsStore.update(reactions => {
      if (reactions[input.reactOn]) { // add new reaction to list of reactions of this entryHash
        reactions[input.reactOn].push(reaction);
      } else { // or create new list of reactions for this entryHash if it's the first reaction
        reactions[input.reactOn] = [reaction];
      }
      return reactions;
    });
  }
}
