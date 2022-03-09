import { CellClient } from '@holochain-open-dev/cell-client';
import {
  AgentPubKeyB64,
  Dictionary,
  serializeHash,
} from '@holochain-open-dev/core-types';
import merge from 'lodash-es/merge';

import { ReactionsService } from './reactions-service';
import { AgentReaction, Reaction } from './types';
import { writable, Writable, derived, Readable, get } from 'svelte/store';
import { defaultConfig, ReactionsConfig } from './config';

export class ReactionsStore {
  /** Private */
  private _service: ReactionsService;
  private _knownReactionsStore: Writable<Dictionary<Reaction>> = writable({});

  /** Static info */
  public myAgentPubKey: AgentPubKeyB64;

  /** Readable stores */

  // Store containing all the reactions that have been fetched
  // The key is the agentPubKey of the agent
  public knownReactions: Readable<Dictionary<Reaction>> = derived(
    this._knownReactionsStore,
    i => i
  );

  // Store containing my reaction
  public myReaction: Readable<Reaction> = derived(
    this._knownReactionsStore,
    reactions => reactions[this.myAgentPubKey]
  );

  // Returns a store with the reaction of the given agent
  reactionOf(agentPubKey: AgentPubKeyB64): Readable<Reaction> {
    return derived(this._knownReactionsStore, reactions => reactions[agentPubKey]);
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
  async fetchAllReactions(): Promise<void> {
    const allReactions = await this._service.getAllReactions();

    this._knownReactionsStore.update(reactions => {
      for (const reaction of allReactions) {
        reactions[reaction.agentPubKey] = reaction.reaction;
      }
      return reactions;
    });
  }

  /**
   * Fetches the reaction for the given agent
   */
  async fetchAgentReaction(
    agentPubKey: AgentPubKeyB64
  ): Promise<Reaction | undefined> {
    // For now, optimistic return of the cached reaction
    // TODO: implement cache invalidation

    const knownReactions = get(this._knownReactionsStore);

    if (knownReactions[agentPubKey]) return knownReactions[agentPubKey];

    const reaction = await this._service.getAgentReaction(agentPubKey);

    if (!reaction) return;

    this._knownReactionsStore.update(reactions => {
      reactions[reaction.agentPubKey] = reaction.reaction;
      return reactions;
    });
    return reaction.reaction;
  }

  /**
   * Fetches the reactions for the given agents in the DHT
   *
   * You can subscribe to knowReactions to get updated with all the reactions when this call is done
   *
   * Use this over `fetchAgentReaction` when fetching multiple reactions, as it will be more performant
   */
  async fetchAgentsReactions(agentPubKeys: AgentPubKeyB64[]): Promise<void> {
    // For now, optimistic return of the cached reaction
    // TODO: implement cache invalidation

    const knownReactions = get(this._knownReactionsStore);

    const agentsWeAlreadKnow = Object.keys(knownReactions);
    const reactionsToFetch = agentPubKeys.filter(
      pubKey => !agentsWeAlreadKnow.includes(pubKey)
    );

    if (reactionsToFetch.length === 0) {
      return;
    }

    const fetchedReactions = await this._service.getAgentsReactions(
      reactionsToFetch
    );

    this._knownReactionsStore.update(reactions => {
      for (const fetchedReaction of fetchedReactions) {
        reactions[fetchedReaction.agentPubKey] = fetchedReaction.reaction;
      }
      return reactions;
    });
  }

  /**
   * Fetch my reaction
   *
   * You can subscribe to `myReaction` to get updated with my reaction
   */
  async fetchMyReaction(): Promise<void> {
    const reaction = await this._service.getMyReaction();
    if (reaction) {
      this._knownReactionsStore.update(reactions => {
        reactions[reaction.agentPubKey] = reaction.reaction;
        return reactions;
      });
    }
  }

  /**
   * Search the reactions for the agent with nicknames starting with the given nicknamePrefix
   *
   * @param nicknamePrefix must be of at least 3 characters
   * @returns the reactions with the nickname starting with nicknamePrefix
   */
  async searchReactions(nicknamePrefix: string): Promise<AgentReaction[]> {
    const searchedReactions = await this._service.searchReactions(nicknamePrefix);

    this._knownReactionsStore.update(reactions => {
      for (const reaction of searchedReactions) {
        reactions[reaction.agentPubKey] = reaction.reaction;
      }
      return reactions;
    });
    return searchedReactions;
  }

  /**
   * Create my reaction
   *
   * Note that there is no guarantee on nickname uniqness
   *
   * @param reaction reaction to be created
   */
  async createReaction(reaction: Reaction): Promise<void> {
    await this._service.createReaction(reaction);

    this._knownReactionsStore.update(reactions => {
      reactions[this.myAgentPubKey] = reaction;
      return reactions;
    });
  }

  /**
   * Update my reaction
   *
   * @param reaction reaction to be created
   */
  async updateReaction(reaction: Reaction): Promise<void> {
    await this._service.updateReaction(reaction);

    this._knownReactionsStore.update(reactions => {
      reactions[this.myAgentPubKey] = reaction;
      return reactions;
    });
  }
}
