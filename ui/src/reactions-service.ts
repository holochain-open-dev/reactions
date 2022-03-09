import { CellClient } from '@holochain-open-dev/cell-client';
import { AgentPubKeyB64, EntryHashB64 } from '@holochain-open-dev/core-types';
import { ReactionDetails, ReactionInput } from './types';

export class ReactionsService {
  constructor(public cellClient: CellClient, public zomeName = 'reactions') {}

  /**
   * Get my reaction, if it has been created
   * @returns my reaction
   */
  async getReactionsForEntry(entryHash: EntryHashB64): Promise<Array<ReactionDetails>> {
    return this.callZome('get_reactions_for_entry', entryHash);
  }

  /**
   * Get the reaction for the given agent, if they have created it
   *
   * @param agentPubKey the agent to get the reaction for
   * @returns the reaction of the agent
   */
  async getAgentReaction(agentPubKey: AgentPubKeyB64): Promise<AgentReaction> {
    return this.callZome('get_agent_reaction', agentPubKey);
  }

  /**
   * Get the reactions for the given agent
   *
   * @param agentPubKeys the agents to get the reaction for
   * @returns the reaction of the agents, in the same order as the input parameters
   */
  async getAgentsReactions(
    agentPubKeys: AgentPubKeyB64[]
  ): Promise<AgentReaction[]> {
    return this.callZome('get_agents_reaction', agentPubKeys);
  }

  /**
   * Search reactions that start with nicknamePrefix
   *
   * @param nicknamePrefix must be of at least 3 characters
   * @returns the reactions with the nickname starting with nicknamePrefix
   */
  async searchReactions(nicknamePrefix: string): Promise<Array<AgentReaction>> {
    return this.callZome('search_reactions', {
      nicknamePrefix: nicknamePrefix,
    });
  }

  /**
   * Get the reactions for all the agents in the DHT
   *
   * @returns the reactions for all the agents in the DHT
   */
  async getAllReactions(): Promise<Array<AgentReaction>> {
    return this.callZome('get_all_reactions', null);
  }

  /**
   * Create my reaction
   *
   * @param reaction the reaction to create
   * @returns my reaction with my agentPubKey
   */
   async createReaction(reaction: Reaction): Promise<AgentReaction> {
    const reactionResult = await this.callZome('create_reaction', reaction);

    return {
      agentPubKey: reactionResult.agentPubKey,
      reaction: reactionResult.reaction,
    };
  }

  /**
   * Update my reaction
   *
   * @param reaction the reaction to create
   * @returns my reaction with my agentPubKey
   */
  async updateReaction(reaction: Reaction): Promise<AgentReaction> {
    const reactionResult = await this.callZome('update_reaction', reaction);

    return {
      agentPubKey: reactionResult.agentPubKey,
      reaction: reactionResult.reaction,
    };
  }

  private callZome(fn_name: string, payload: any) {
    return this.cellClient.callZome(this.zomeName, fn_name, payload);
  }
}
