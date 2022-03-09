import { AgentPubKeyB64, HeaderHashB64, EntryHashB64 } from '@holochain-open-dev/core-types';

export interface ReactionDetails {
  author: AgentPubKeyB64,
  reaction: string,
  timestamp: number,
  createLinkHash: HeaderHashB64
}


export interface ReactionInput {
  reaction: string,
  reactOn: EntryHashB64,
}