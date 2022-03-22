import { AgentPubKeyB64, HeaderHashB64, EntryHashB64 } from '@holochain-open-dev/core-types';
import { Header } from '@holochain/client';

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


export interface UnreactionDetails {
  author: AgentPubKeyB64,
  reaction: string,
  invalidatedHeaderHash: HeaderHashB64,
  deleteLinkHash: HeaderHashB64,
}


export interface GetReactionsForEntryInput {
  entryHash: EntryHashB64,
  reaction?: string,
  author?: AgentPubKeyB64,
}