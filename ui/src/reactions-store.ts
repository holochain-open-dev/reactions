import { CellClient } from '@holochain-open-dev/cell-client';
import {
  AgentPubKeyB64,
  Dictionary,
  EntryHashB64,
  serializeHash,
} from '@holochain-open-dev/core-types';
import merge from 'lodash-es/merge';

import { ReactionsService } from './reactions-service';
import { ReactionDetails, ReactionInput } from './types';
import { writable, Writable, derived, Readable, get } from 'svelte/store';
import { defaultConfig, ReactionsConfig } from './config';

export class ReactionsStore {
  /** Private */
  private _service: ReactionsService;
  private _knownReactionsStore: Writable<Record<EntryHashB64, Array<ReactionDetails>>> = writable({});

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

  /** Static info */
  public myAgentPubKey: AgentPubKeyB64;

  /** Readable stores */

  // Returns a store with the reaction of the given agent
  reactionForEntry(entryHash: EntryHashB64): Readable<Array<ReactionDetails>> {
    return derived(this._knownReactionsStore, reactions => reactions[entryHash]);
  }

  config: ReactionsConfig;

  constructor(
    protected cellClient: CellClient,
    config: Partial<ReactionsConfig> = {}
  ) {
    this.config = merge(defaultConfig, config);
    this._service = new ReactionsService(cellClient, this.config.zomeName);
    this.myAgentPubKey = serializeHash(cellClient.cellId[1]);
  }

  /** Actions */

  /**
   * Fetches the reactions for all agents in the DHT
   *
   * You can subscribe to `knowReactions` to get updated with all the reactions when this call is done
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
   * Create my reaction
   *
   * Note that there is no guarantee on nickname uniqness
   *
   * @param reaction reaction to be created
   */
  async react(input: ReactionInput): Promise<void> {
    const reaction: ReactionDetails = await this._service.react(input); //zome call

    this._knownReactionsStore.update(reactions => {
      reactions[input.reactOn].push(reaction);
      return reactions;
    });
  }
}
