use hdk::prelude::holo_hash::{ EntryHashB64, HeaderHashB64, AgentPubKeyB64 };
use hdk::prelude::*;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all="camelCase")]
pub struct ReactionInput {
    pub reaction: String,
    pub react_on: EntryHashB64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all="camelCase")]
pub struct ReactionDetails {
    pub author: AgentPubKeyB64,
    pub reaction: String,
    pub timestamp: Timestamp,
    pub create_link_hash: HeaderHashB64,
}