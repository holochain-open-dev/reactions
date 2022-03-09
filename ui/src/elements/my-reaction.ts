import { contextProvided } from '@holochain-open-dev/context';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

import { reactionsStoreContext } from '../context';
import { ReactionsStore } from '../reactions-store';
import { sharedStyles } from './utils/shared-styles';
import { EditReaction } from './edit-reaction';
import { ReactionDetail } from './reaction-detail';
import { IconButton } from '@scoped-elements/material-web';
import { UpdateReaction } from './update-reaction';

/**
 * @element reaction-detail
 */
export class MyReaction extends ScopedElementsMixin(LitElement) {
  /** Dependencies */

  /**
   * `ReactionsStore` that is requested via context.
   * Only set this property if you want to override the store requested via context.
   */
  @contextProvided({ context: reactionsStoreContext })
  @property({ type: Object })
  store!: ReactionsStore;

  /** Private properties */

  @state()
  private _editing = false;

  render() {
    if (this._editing)
      return html`<update-reaction
        @reaction-updated=${() => (this._editing = false)}
      ></update-reaction>`;

    return html`
      <reaction-detail .agentPubKey=${this.store.myAgentPubKey}>
        <mwc-icon-button
          slot="action"
          icon="edit"
          @click=${() => (this._editing = true)}
        ></mwc-icon-button>
      </reaction-detail>
    `;
  }

  /**
   * @ignore
   */
  static get scopedElements() {
    return {
      'mwc-icon-button': IconButton,
      'reaction-detail': ReactionDetail,
      'update-reaction': UpdateReaction,
    };
  }

  static styles = [sharedStyles];
}
