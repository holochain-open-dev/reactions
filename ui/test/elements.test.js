import { html, fixture, expect } from '@open-wc/testing';
import { setupApolloClientMock } from './mocks';
import { HodCreateReactionForm } from '../dist';
import { setupApolloClientElement } from '@holochain-open-dev/common';

describe('HodCreateReactionForm', () => {
  it('create reaction has a placeholder', async () => {
    const client = await setupApolloClientMock();

    customElements.define(
      'hod-create-reaction-form',
      setupApolloClientElement(HodCreateReactionForm, client)
    );

    const el = await fixture(
      html` <hod-create-reaction-form></hod-create-reaction-form> `
    );

    expect(el.shadowRoot.innerHTML).to.include('CREATE PROFILE');
  });
});
