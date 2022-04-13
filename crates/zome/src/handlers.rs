use crate::{ ReactionInput, ReactionDetails, UnreactionDetails, GetReactionsForEntryInput};
use hdk::prelude::*;
use std::convert::TryInto;

pub fn react(input: ReactionInput) -> ExternResult<ReactionDetails> {
    let agent_pubkey = agent_info()?.agent_initial_pubkey;
    let header_hash = create_link(input.react_on.clone().into(), agent_pubkey.clone().into(), LinkType::from(HdkLinkType::Any), link_tag(input.reaction.clone())?)?;
    let time = sys_time()?;

    let reaction_details = ReactionDetails {
        author: agent_pubkey.into(),
        reaction: input.reaction,
        timestamp: time,
        create_link_hash: header_hash.into(),
    };
    Ok(reaction_details)
}



// If there are multiple reactions of an author of the same type for the same entry, this
// function just deletes one of them ignoring any time ordering
pub fn unreact(input: ReactionInput) -> ExternResult<UnreactionDetails> {

    let links = get_links(input.react_on.clone().into(), Some(link_tag(input.reaction.clone())?))?;

    let agent_pub_key = agent_info()?.agent_initial_pubkey;

    let mut authors_reactions = Vec::new();
    for link in links {
        if AgentPubKey::from(link.target.clone()) == agent_pub_key {
            authors_reactions.push(link)
        }
    }

    let invalidate_header_hash = authors_reactions[0].create_link_hash.clone();
    // delete first link in array satisfying the conditions above
    let delete_link_hash = delete_link(invalidate_header_hash.clone())?;

    let output = UnreactionDetails {
        author: agent_pub_key.into(),
        reaction: input.reaction,
        invalidated_header_hash: invalidate_header_hash.into(),
        delete_link_hash: delete_link_hash.into(),
    };

    Ok(output)
}


pub fn get_reactions_for_entry(input: GetReactionsForEntryInput) -> ExternResult<Vec<ReactionDetails>> {

    // filter by link tag a.k.a reaction type if provided
    let link_tag = match input.reaction {
        Some(reaction) => Some(LinkTag::new(reaction)),
        None => None,
    };

    let links = get_links(input.entry_hash.clone().into(), link_tag)?;

    // filter by author if author is provided
    let mut filtered_links = Vec::new();
    match input.author {
        Some(author) => {
            for link in links {
                if AgentPubKey::from(link.target.clone()) == author.clone().into() {
                    filtered_links.push(link);
                }
            }
        },
        None => { filtered_links = links }
    }

    let mut converted_links: Vec<ReactionDetails> = Vec::new();

    for link in filtered_links {
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




// TODO

// pub fn react_double_link()    <----  required for getting all the reactions of an author,
//                                      for example listing all favorite posts of an author

// pub fn unreact_double_link()


// ATTENTION: If not filtered by reaction type, i.e. LinkTag, this function simply
// returns all links tied to the author's public key, i.e. potentially also links
// created by other zomes
// pub fn get_reactions_of_author(input: GetReactionsOfAuthorInput) -> ExternResult<Vec<ReactionDetails>> {
//     unimplemented!()
// }






// Helper code to convert LinkTag into String
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

#[derive(Serialize, Deserialize, Debug, SerializedBytes)]
struct StringLinkTag(String);

pub fn link_tag(tag: String) -> ExternResult<LinkTag> {
    let sb: SerializedBytes = StringLinkTag(tag).try_into()?;
    Ok(LinkTag(sb.bytes().clone()))
}
pub fn tag_to_string(tag: LinkTag) -> ExternResult<String> {
    let bytes = SerializedBytes::from(UnsafeBytes::from(tag.0));
    let string_tag: StringLinkTag = bytes.try_into()?;

    Ok(string_tag.0)
}


