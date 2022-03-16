// import { CellClient } from '@holochain-open-dev/cell-client';
// import {
//   AgentPubKeyB64,
//   deserializeHash,
//   serializeHash,
// } from '@holochain-open-dev/core-types';
// import { CellId, AppSignalCb } from '@holochain/client';
// // import { AgentReaction } from './types';

// const sleep = (ms: number) => new Promise(r => setTimeout(() => r(null), ms));

// export class ReactionsZomeMock extends CellClient {
//   constructor(
//     protected agents: Array<AgentReaction> = [],
//     protected latency: number = 500
//   ) {
//     super(null as any, null as any);
//   }

//   get cellId(): CellId {
//     return [
//       deserializeHash('uhC0kkSpFl08_2D0Pvw2vEVEkfSgDVZCkyOf1je6qIdClO1o'),
//       deserializeHash('uhCAk6oBoqygFqkDreZ0V0bH4R9cTN1OkcEG78OLxVptLWOI'),
//     ];
//   }

//   get myPubKeyB64() {
//     return serializeHash(this.cellId[1]);
//   }

//   create_reaction({ nickname }: { nickname: string }) {
//     const agent: AgentReaction = {
//       agentPubKey: this.myPubKeyB64,
//       reaction: { nickname, fields: {} },
//     };
//     this.agents.push(agent);

//     return agent;
//   }

//   search_reactions({ nicknamePrefix }: { nicknamePrefix: string }) {
//     return this.agents.filter(a =>
//       a.reaction.nickname.startsWith(nicknamePrefix.slice(0, 3))
//     );
//   }

//   get_my_reaction() {
//     const agent = this.findAgent(this.myPubKeyB64);

//     if (!agent) return undefined;
//     return {
//       agentPubKey: agent.agentPubKey,
//       reaction: agent ? agent.reaction : undefined,
//     };
//   }

//   get_agent_reaction(agent_address: AgentPubKeyB64) {
//     const agent = this.findAgent(agent_address);
//     return agent ? agent : undefined;
//   }

//   get_all_reactions() {
//     return this.agents;
//   }

//   findAgent(agent_address: AgentPubKeyB64) {
//     return this.agents.find(user => user.agentPubKey === agent_address);
//   }

//   async callZome(
//     zomeName: string,
//     fnName: string,
//     payload: any,
//     timeout?: number
//   ): Promise<any> {
//     await sleep(this.latency);
//     return (this as any)[fnName](payload);
//   }
//   addSignalHandler(signalHandler: AppSignalCb): { unsubscribe: () => void } {
//     throw new Error('Method not implemented.');
//   }
// }
