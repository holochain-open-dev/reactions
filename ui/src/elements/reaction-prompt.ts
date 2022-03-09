import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

import {
  Button,
  CircularProgress,
  TextField,
} from '@scoped-elements/material-web';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { contextProvided } from '@holochain-open-dev/context';
import { StoreSubscriber } from 'lit-svelte-stores';

import { sharedStyles } from './utils/shared-styles';
import { CreateReaction } from './create-reaction';
import { ReactionsStore } from '../reactions-store';
import { reactionsStoreContext } from '../context';

/**
 * @element reaction-prompt
 * @slot hero - Will be displayed above the create-reaction form when the user is prompted with it
 */
export class ReactionPrompt extends ScopedElementsMixin(LitElement) {
  /** Public attributes */

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
  private _loading = true;

  private _myReaction = new StoreSubscriber(this, () => this.store?.myReaction);

  async firstUpdated() {
    await this.store.fetchMyReaction();
    this._loading = false;
  }

  renderPrompt() {
    return html` <div
      class="column"
      style="align-items: center; justify-content: center; flex: 1;"
    >
      ${this._loading
        ? html`<mwc-circular-progress indeterminate></mwc-circular-progress>`
        : html` <div class="column" style="align-items: center;">
            <slot name="hero"></slot>
            <create-reaction></create-reaction>
          </div>`}
    </div>`;
  }

  render() {
    return html`
      ${!this._loading && this._myReaction.value
        ? html`<slot></slot>`
        : this.renderPrompt()}
    `;
  }

  /**
   * @ignore
   */
  static get scopedElements() {
    return {
      'mwc-textfield': TextField,
      'mwc-button': Button,
      'mwc-circular-progress': CircularProgress,
      'create-reaction': CreateReaction,
    };
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: flex;
        }
      `,
    ];
  }
}
