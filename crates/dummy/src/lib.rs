//! ## hc_zome_reactions_dummy
//!
//! Zome to create dummy entries for demo and testing of the reactions zome.

use hdk::prelude::*;
use hdk::prelude::holo_hash::EntryHashB64;

mod dummy;
use crate::dummy::DummyEntry;

entry_defs![PathEntry::entry_def(), DummyEntry::entry_def()];

#[hdk_extern]
pub fn create_dummy_entry(dummy: DummyEntry) -> ExternResult<EntryHashB64> {
    dummy::create_dummy_entry(dummy)
}