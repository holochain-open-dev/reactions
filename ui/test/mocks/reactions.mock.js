import { hashToString } from 'holochain-ui-test-utils';

export class ReactionsMock {
  constructor() {
    this.agents = [];
  }

  create_reaction({ username }, provenance) {
    const agent = {
      agent_pub_key: hashToString(provenance),
      reaction: { username, fields: {} },
    };
    this.agents.push(agent);

    return agent;
  }

  search_reactions({ username_prefix }) {
    return this.agents
      .filter(a => a.reaction.username.startsWith(username_prefix.slice(0, 3)))
      .map(a => ({
        agent_pub_key: a.agent_pub_key,
        ...a,
      }));
  }

  get_my_reaction(_, provenance) {
    const agent = this.findAgent(hashToString(provenance));

    if (!agent)
      return {
        agent_pub_key: hashToString(provenance),
      };
    return {
      agent_pub_key: agent.agent_pub_key,
      reaction: agent ? agent.reaction : undefined,
    };
  }

  get_agent_reaction({ agent_address }) {
    const agent = this.findAgent(agent_address);
    return agent ? agent.username : undefined;
  }

  findAgent(agent_address) {
    return this.agents.find(user => user.agent_pub_key === agent_address);
  }
}
