use crate::{ ReactionDetails, ReactionInput};
use hdk::prelude::holo_hash::{ HeaderHashB64, EntryHashB64};
use hdk::prelude::*;
use std::convert::TryInto;

// +++ Remark: moved struct definitions to ""../../types/src/lib.rs" as intended by the template

pub fn react(input: ReactionInput) -> ExternResult<HeaderHashB64> {
    let agent_pubkey = agent_info()?.agent_initial_pubkey;
    let header_hash = create_link(input.react_on.clone().into(), agent_pubkey.into(), LinkTag::new(input.reaction))?;
    Ok(header_hash.into())
}


pub fn unreact(header_hash: HeaderHashB64) -> ExternResult<HeaderHashB64> {
    let header_hash = delete_link(header_hash.into())?;
    Ok(header_hash.into())
}


pub fn get_reactions_for_entry(entry_hash: EntryHashB64) -> ExternResult<Vec<ReactionDetails>> {

    let links = get_links(entry_hash.into(), None)?;

    let mut converted_links: Vec<ReactionDetails> = Vec::new();

    for link in links {
        let reaction_details = ReactionDetails {
            author: AgentPubKey::from(link.target).into(),
            reaction: tag_to_string(link.tag)?,
            timestamp: link.timestamp,
            create_link_hash: link.create_link_hash.into(),
        };

        converted_links.push(reaction_details);
    }

    Ok(converted_links)
}




// Helper code to convert LinkTag into String
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

#[derive(Serialize, Deserialize, Debug, SerializedBytes)]
struct StringLinkTag(String);

// pub fn link_tag(tag: String) -> ExternResult<LinkTag> {
//     let sb: SerializedBytes = StringLinkTag(tag).try_into()?;
//     Ok(LinkTag(sb.bytes().clone()))
// }
pub fn tag_to_string(tag: LinkTag) -> ExternResult<String> {
    let bytes = SerializedBytes::from(UnsafeBytes::from(tag.0));
    let string_tag: StringLinkTag = bytes.try_into()?;

    Ok(string_tag.0)
}


