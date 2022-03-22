//! ## hc_zome_reactions
//!
//! Reactions zome for any Holochain app.
//!
//! If you need to manage reactions you can directly include this zome in your DNA.
//!
//! Read about how to include both this zome and its frontend module in your application [here](https://holochain-open-dev.github.io/reactions).

use crate::{ ReactionDetails, ReactionInput, UnreactionDetails, GetReactionsForEntryInput };
use hdk::prelude::holo_hash::{ EntryHashB64 };
use hdk::prelude::*;

mod handlers;

// <---  part below may be removed when using this "reactions" as an external module --->
mod dummy;
use crate::dummy::DummyEntry;
pub fn create_dummy_entry(dummy: DummyEntry) -> ExternResult<EntryHashB64> {
    dummy::create_dummy_entry(dummy)
}
// <--- only used for UI demo (ui/demo/index.html) --->


use hc_zome_reactions_types::*;

entry_defs![PathEntry::entry_def(),
DummyEntry::entry_def()]; // remove DummyEntry from entry_defs if you remove the part above as well

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

#[hdk_extern]
pub fn get_links_for_entry(entry_hash: EntryHashB64) -> ExternResult<Vec<Link>> {
    Ok(get_links(entry_hash.into(), None)?)
}
