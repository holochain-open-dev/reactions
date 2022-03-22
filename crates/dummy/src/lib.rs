// <---  part below may be removed when using this "reactions" as an external module --->
use hdk::prelude::*;
use hdk::prelude::holo_hash::EntryHashB64;

mod dummy;
use crate::dummy::DummyEntry;

#[hdk_extern]
pub fn create_dummy_entry(dummy: DummyEntry) -> ExternResult<EntryHashB64> {
    dummy::create_dummy_entry(dummy)
}
// <--- only used for UI demo (ui/demo/index.html) --->