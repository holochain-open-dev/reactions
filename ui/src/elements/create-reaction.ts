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
} from '@scoped-elements/material-web';
import { SlAvatar } from '@scoped-elements/shoelace';

import { sharedStyles } from './utils/shared-styles';
import { ReactionsStore } from '../reactions-store';
import { reactionsStoreContext } from '../context';
import { resizeAndExport } from './utils/image';
import { EditReaction } from './edit-reaction';
import { Reaction } from '../types';

/**
 * A custom element that fires event on value change.
 *
 * @element create-reaction
 * @fires reaction-created - Fired after the reaction has been created. Detail will have this shape: { reaction: { nickname, fields } }
 */
export class CreateReaction extends ScopedElementsMixin(LitElement) {
  /** Dependencies */

  /**
   * `ReactionsStore` that is requested via context.
   * Only set this property if you want to override the store requested via context.
   */
  @contextProvided({ context: reactionsStoreContext })
  @property({ type: Object })
  store!: ReactionsStore;

  /** Private properties */

  async createReaction(reaction: Reaction) {
    await this.store.createReaction(reaction);

    this.dispatchEvent(
      new CustomEvent('reaction-created', {
        detail: {
          reaction,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <mwc-card>
        <div class="column" style="margin: 16px;">
          <span
            class="title"
            style="margin-bottom: 24px; align-self: flex-start"
            >Create Reaction</span
          >
          <edit-reaction
            save-reaction-label="Create Reaction"
            @save-reaction=${(e: CustomEvent) =>
              this.createReaction(e.detail.reaction)}
          ></edit-reaction></div
      ></mwc-card>
    `;
  }

  /**
   * @ignore
   */
  static get scopedElements() {
    return {
      'edit-reaction': EditReaction,
      'mwc-card': Card,
    };
  }
  static get styles() {
    return [sharedStyles];
  }
}
