//! This file along with the corresponding part in lib.rs may be deleted if
//! you include this holochain-open-dev module into your DNA as an external module.
//!
//! It is only used for the UI demo (ui/demo/index.html).

use hdk::prelude::holo_hash::EntryHashB64;
use hdk::prelude::*;

#[hdk_entry(id = "dummy")]
pub struct DummyEntry(String);


pub fn create_dummy_entry(dummy: DummyEntry) -> ExternResult<EntryHashB64> {

    create_entry(&dummy)?;

    let hash = hash_entry(&dummy)?;

    Ok(hash.into())
}