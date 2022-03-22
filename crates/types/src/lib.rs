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

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct UnreactionDetails {
    pub author: AgentPubKeyB64,
    pub reaction: String,
    pub invalidated_header_hash: HeaderHashB64,
    pub delete_link_hash: HeaderHashB64,
}


#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct GetReactionsForEntryInput {
    pub entry_hash: EntryHashB64,
    pub reaction: Option<String>,
    pub author: Option<AgentPubKeyB64>,
}


// This type will require double links, i.e. links also from the agents public
// key to the entries the reactions are referring to

// #[derive(Serialize, Deserialize, Clone, Debug)]
// #[serde(rename_all = "camelCase")]
// pub struct GetReactionsOfAuthorInput {
//     pub reaction: Option<String>,
//     pub author: AgentPubKeyB64,
// }

