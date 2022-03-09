import { html, LitElement } from 'lit';
import { query, property, state } from 'lit/decorators.js';
import { contextProvided } from '@holochain-open-dev/context';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Dictionary } from '@holochain-open-dev/core-types';
import {
  TextField,
  Button,
  Card,
  IconButton,
  Fab,
  CircularProgress,
} from '@scoped-elements/material-web';
import { SlAvatar } from '@scoped-elements/shoelace';

import { sharedStyles } from './utils/shared-styles';
import { ReactionsStore } from '../reactions-store';
import { reactionsStoreContext } from '../context';
import { resizeAndExport } from './utils/image';
import { EditReaction } from './edit-reaction';
import { Reaction } from '../types';
import { StoreSubscriber } from 'lit-svelte-stores';

/**
 * @element update-reaction
 * @fires reaction-updated - Fired after the reaction has been created. Detail will have this shape: { reaction: { nickname, fields } }
 */
export class UpdateReaction extends ScopedElementsMixin(LitElement) {
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

  async updateReaction(reaction: Reaction) {
    await this.store.updateReaction(reaction);

    this.dispatchEvent(
      new CustomEvent('reaction-updated', {
        detail: {
          reaction,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (this._loading)
      return html`<div
        class="column"
        style="align-items: center; justify-content: center; flex: 1;"
      >
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;

    return html`
      <edit-reaction
        .reaction=${this._myReaction.value}
        save-reaction-label="Update Reaction"
        @save-reaction=${(e: CustomEvent) =>
          this.updateReaction(e.detail.reaction)}
      ></edit-reaction>
    `;
  }

  /**
   * @ignore
   */
  static get scopedElements() {
    return {
      'mwc-circular-progress': CircularProgress,
      'edit-reaction': EditReaction,
      'mwc-card': Card,
    };
  }
  static get styles() {
    return [sharedStyles];
  }
}
