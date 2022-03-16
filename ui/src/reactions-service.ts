import { CellClient } from '@holochain-open-dev/cell-client';
import { AgentPubKeyB64, EntryHashB64, HeaderHashB64 } from '@holochain-open-dev/core-types';
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

  async react(input: ReactionInput): Promise<ReactionDetails> {
    return this.callZome('react', input)
  }

  async unreact(header_hash: HeaderHashB64): Promise<HeaderHashB64> {
    return this.callZome('unreact', header_hash)
  }

  private callZome(fn_name: string, payload: any) {
    return this.cellClient.callZome(this.zomeName, fn_name, payload);
  }
}
