//! ## hc_zome_reactions
//!
//! Reactions zome for any Holochain app.
//!
//! If you need to manage reactions you can directly include this zome in your DNA.
//!
//! Read about how to include both this zome and its frontend module in your application [here](https://holochain-open-dev.github.io/reactions).

use crate::{ ReactionDetails, ReactionInput, UnreactionDetails, GetReactionsForEntryInput };
use hdk::prelude::*;

mod handlers;

use hc_zome_reactions_types::*;

entry_defs![PathEntry::entry_def()];

// Creates a link from the entry to react on to the AgentPubKey of the agent that reacts
// with a linktag containing the reaction as a string
#[hdk_extern]
pub fn react(input: ReactionInput) -> ExternResult<ReactionDetails> {
    handlers::react(input)
}

// Deletes the link which was created via react()
#[hdk_extern]
pub fn unreact(input: ReactionInput) -> ExternResult<UnreactionDetails> {
    handlers::unreact(input)
}

// Gets all the reactions for a given entry
#[hdk_extern]
pub fn get_reactions_for_entry(input: GetReactionsForEntryInput) -> ExternResult<Vec<ReactionDetails>> {
    handlers::get_reactions_for_entry(input)
}