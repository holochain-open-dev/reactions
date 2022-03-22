import { CellClient } from '@holochain-open-dev/cell-client';
import { HeaderHashB64 } from '@holochain-open-dev/core-types';
import { GetReactionsForEntryInput, ReactionDetails, ReactionInput, UnreactionDetails } from './types';

export class ReactionsService {
  constructor(public cellClient: CellClient, public zomeName = 'reactions') {}

  /**
   * Get my reaction, if it has been created
   * @returns my reaction
   */
  async getReactionsForEntry(input: GetReactionsForEntryInput): Promise<Array<ReactionDetails>> {
    return this.callZome('get_reactions_for_entry', input);
  }

  async react(input: ReactionInput): Promise<ReactionDetails> {
    return this.callZome('react', input)
  }

  async unreact(input: ReactionInput): Promise<UnreactionDetails> {
    return this.callZome('unreact', input)
  }

  private callZome(fn_name: string, payload: any) {
    return this.cellClient.callZome(this.zomeName, fn_name, payload);
  }
}
