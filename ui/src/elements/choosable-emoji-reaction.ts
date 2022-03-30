import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { EntryHashB64 } from '@holochain-open-dev/core-types';
import { contextProvided } from '@holochain-open-dev/context';

import { Icon } from '@scoped-elements/material-web';

import 'emoji-picker-element';

import { StoreSubscriber } from 'lit-svelte-stores';
import { ReactionsStore } from '../reactions-store';
import { ReactionInput } from '../types';
import { reactionsStoreContext } from '../context';
import { sharedStyles } from './utils/shared-styles';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

export class ChoosableEmojiReaction extends ScopedElementsMixin(LitElement) {
  @property({ type: String, attribute: 'entry-hash' })
  entryHash!: EntryHashB64;

  @state()
  private _loading: boolean = true;

  @contextProvided({ context: reactionsStoreContext })
  @property({ type: Object })
  store!: ReactionsStore;

  @state()
  showPalette: boolean = false;

  private _reactionsForEntry = new StoreSubscriber(this, () =>
    this.store?.reactionsForEntry({ entryHash: this.entryHash })
  );

  async firstUpdated() {
    await this.store.fetchAllReactionsForEntry(this.entryHash);
    this._loading = false;
  }

  private _haveIReacted(reaction: string): boolean {
    let reactions = this._reactionsForEntry.value;
    return reactions
      .filter(r => r.reaction == reaction)
      .some(r => r.author == this.store.myAgentPubKey);
  }

  private _togglePicker = () => {
    this.showPalette = !this.showPalette;
  };

  private _emojiReaction(e: CustomEvent) {
    if (!this._haveIReacted(e.detail.unicode)) {
      const reaction: string = e.detail.unicode;
      let reactionInput: ReactionInput = {
        reaction: reaction,
        reactOn: this.entryHash,
      };
      this.store.react(reactionInput);
    }
    this._togglePicker();
  }

  render() {
    if (this._loading) {
      return html``;
    }

    return html`
      <mwc-icon
        class="add-reaction"
        @click=${this._togglePicker}
        aria-label="Add reaction"
        style="--mdc-icon-size: 38px;"
        >add_reaction</mwc-icon
      >
      <div
        class="tooltip"
        role="tooltip"
        class=${this.showPalette ? '' : 'hidden'}
      >
        <emoji-picker @emoji-click=${this._emojiReaction}></emoji-picker>
      </div>
    `;
  }

  static get scopedElements() {
    return {
      'mwc-icon': Icon,
      'emoji-picker-element': customElements.get('emoji-picker-element'),
    };
  }

  static localStyles = css`
    .hidden {
      display: none;
    }
    .add-reaction {
      color: rgb(140, 140, 140);
      font-size: 24px;
      cursor: pointer;
      padding: 3px;
    }
    .add-reaction:hover {
      color: rgb(40, 40, 40);
    }
  `;

  static get styles() {
    return [sharedStyles, this.localStyles];
  }
}
