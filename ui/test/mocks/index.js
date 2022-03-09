import ConductorApi from '@holochain/conductor-api';

import { AppWebsocketMock, DnaMock } from 'holochain-ui-test-utils';
import { ReactionsMock } from './reactions.mock';

/**
 * If process.env.CONDUCTOR_URL is undefined, it will mock the backend
 * If process.env.CONDUCTOR_URL is defined, it will try to connect to holochain at that url
 */
const dnaMock = new DnaMock({
  reactions: new ReactionsMock(),
});
export async function getAppWebsocket() {
  if (process.env.CONDUCTOR_URL)
    return ConductorApi.AppWebsocket.connect(process.env.CONDUCTOR_URL);
  else {
    return new AppWebsocketMock([dnaMock]);
  }
}
