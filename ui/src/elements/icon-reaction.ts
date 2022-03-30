import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

import { EntryHashB64 } from '@holochain-open-dev/core-types';
import { contextProvided } from '@holochain-open-dev/context';

import { IconButtonToggle } from '@scoped-elements/material-web';

import { StoreSubscriber } from 'lit-svelte-stores';
import { ReactionsStore } from '../reactions-store';
import { ReactionInput, ReactionDetails } from '../types';
import { reactionsStoreContext } from '../context';
import { sharedStyles } from './utils/shared-styles';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

type ReactionAuthor = string; // may potentially be a nickname from the profiles zome instead of the agent public key
type ReactionCount = { count: number; authors: Array<ReactionAuthor> };
type FilteredReactions = Record<string, ReactionCount>;

export class IconReaction extends ScopedElementsMixin(LitElement) {
  @property({ type: String, attribute: 'entry-hash' })
  entryHash!: EntryHashB64;

  @property({ type: String })
  onIcon!: string;

  @property({ type: String })
  offIcon!: string;

  @property({ type: String })
  reactionName!: string | undefined;

  @state()
  private _loading = true;

  @contextProvided({ context: reactionsStoreContext })
  @property({ type: Object })
  store!: ReactionsStore;

  private _reactionsForEntry = new StoreSubscriber(this, () =>
    this.store?.reactionsForEntry({ entryHash: this.entryHash })
  );

  async firstUpdated() {
    await this.store.fetchAllReactionsForEntry(this.entryHash);
    this._loading = false;
  }

  /**
   * Count all the reactions of the given reaction type
   *
   * @param reactions Array of ReactionDetails
   *
   */
  countReactions(reactions: Array<ReactionDetails>) {
    let counts = 0;

    reactions.forEach(details => {
      if (
        details.reaction ===
        (this.reactionName ? this.reactionName : this.onIcon)
      ) {
        counts++;
      }
    });

    return counts;
  }

  private _haveIReacted(reaction: string): boolean {
    const reactions = this._reactionsForEntry.value;
    return reactions
      .filter(r => r.reaction == reaction)
      .some(r => r.author == this.store.myAgentPubKey);
  }

  private _customReaction() {
    const reactionInput: ReactionInput = {
      reaction: this.reactionName ? this.reactionName : this.onIcon,
      reactOn: this.entryHash,
    };

    if (
      !this._haveIReacted(this.reactionName ? this.reactionName : this.onIcon)
    ) {
      this.store.react(reactionInput);
    } else {
      this.store.unreact(reactionInput);
    }
  }

  render() {
    if (this._loading) {
      return html``;
    }

    const reactionsCount = this.countReactions(this._reactionsForEntry.value);

    return html`
      <div class="icon-button">
        <span>
          <mwc-icon-button-toggle
            @click=${this._customReaction}
            .on=${this._haveIReacted(
              this.reactionName ? this.reactionName : this.onIcon
            )}
            .onIcon=${this.onIcon}
            .offIcon=${this.offIcon}
            .aria-label="${this.onIcon} reaction"
          >
          </mwc-icon-button-toggle>
        </span>
        <span> ${reactionsCount} </span>
      </div>
    `;
  }

  static get scopedElements() {
    return {
      'mwc-icon-button-toggle': IconButtonToggle,
    };
  }

  static localStyles = css`
    .icon-button {
      display: flex;
      align-items: center;
      font-family: Roboto, sans-serif;
    }
  `;

  static get styles() {
    return [sharedStyles, this.localStyles];
  }
}
