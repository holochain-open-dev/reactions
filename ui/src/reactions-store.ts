import { CellClient } from '@holochain-open-dev/cell-client';
import { EntryHashB64, AgentPubKeyB64, serializeHash } from '@holochain-open-dev/core-types';
import merge from 'lodash-es/merge';

import { ReactionsService } from './reactions-service';
import { GetReactionsForEntryInput, ReactionDetails, ReactionInput, UnreactionDetails } from './types';
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


  public myAgentPubKey: AgentPubKeyB64;

  config: ReactionsConfig;

  constructor(
    protected cellClient: CellClient,
    config: Partial<ReactionsConfig> = {}
  ) {
    this.config = merge(defaultConfig, config);
    this._service = new ReactionsService(cellClient, this.config.zomeName);
    this.myAgentPubKey = serializeHash(cellClient.cellId[1]);
  }



  /** Readable stores */

  // Returns a store with the reaction of the specified entry, optionally filtered
  // by author or reaction type
  reactionsForEntry(input: GetReactionsForEntryInput): Readable<Array<ReactionDetails>> {
    return derived(this._knownReactionsStore, reactions => {
      if (input.author && input.reaction) {
        return reactions[input.entryHash].filter((reaction) => (
          reaction.author == input.author) && (reaction.reaction == input.reaction)
          )
      } else if (input.reaction) {
        return reactions[input.entryHash].filter((reaction) => reaction.reaction == input.reaction)
      } else if (input.author) {
        return reactions[input.entryHash].filter((reaction) => reaction.author == input.author)
      } else {
        return reactions[input.entryHash]
      }
    });
  }



  /** Actions */

  /**
   * Fetches all the reactions of the specified entry from the DHT
   *
   * You can subscribe to `_knownReactionsStore` to get updated with all the reactions when this call is done
   *
   * Warning! Can be very slow
   *
   * @param entryHash entry hash of the entry to fetch all the reactions for
   *
   */
  async fetchAllReactionsForEntry(entryHash: EntryHashB64): Promise<void> {

    const getReactionsInput: GetReactionsForEntryInput = {
      entryHash: entryHash,
    }
    console.log(getReactionsInput, typeof getReactionsInput, typeof getReactionsInput.entryHash);
    const allReactions = await this._service.getReactionsForEntry(getReactionsInput);

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

    const reaction: ReactionDetails = await this._service.react(input); // zome call

    this._knownReactionsStore.update(reactions => {
      if (reactions[input.reactOn]) { // add new reaction to list of reactions of this entryHash
        reactions[input.reactOn].push(reaction);
      } else { // or create new list of reactions for this entryHash if it's the first reaction
        reactions[input.reactOn] = [reaction];
      }
      return reactions;
    });
  }

  /**
   * Delete reaction
   *
   *
   * @param input
   */
  async unreact(input: ReactionInput): Promise<void> {

    const unreaction: UnreactionDetails = await(this._service.unreact(input)); // zome call

    this._knownReactionsStore.update(reactions => {
      reactions[input.reactOn] = reactions[input.reactOn].filter((r) => {
        () => (r.reaction!=unreaction.invalidatedHeaderHash)
      });
      return reactions;
    })
  }

}
