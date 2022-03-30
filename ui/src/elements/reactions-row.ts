import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { EntryHashB64 } from '@holochain-open-dev/core-types';

import { ReactionsStore } from '../reactions-store';
import { ReactionDetails } from '../types';
import { contextProvided } from '@holochain-open-dev/context';
import { reactionsStoreContext } from '../context';
import { StoreSubscriber } from 'lit-svelte-stores';
import { sharedStyles } from './utils/shared-styles';

type ReactionAuthor = string; // may potentially be a nickname from the profiles zome instead of the agent public key
type ReactionCount = { count: number; authors: Array<ReactionAuthor> };
type GroupedReactions = Record<string, ReactionCount>;

export class ReactionsRow extends ScopedElementsMixin(LitElement) {
  @property({ type: String, attribute: 'entry-hash' })
  entryHash!: EntryHashB64;

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
   * Groups all the reactions by reaction type, e.g. by emoji unicode character
   *
   * @param reactions Array of ReactionDetails
   *
   */
  groupReactions(reactions: Array<ReactionDetails>) {
    const orderedReactions: GroupedReactions = {};
    reactions.forEach(details => {
      if (orderedReactions[details.reaction]) {
        orderedReactions[details.reaction].count += 1;
        orderedReactions[details.reaction].authors.push(details.author);
      } else {
        orderedReactions[details.reaction] = {
          count: 1,
          authors: [details.author],
        };
      }
    });
    return orderedReactions;
  }

  private _haveIReacted(reaction: string): boolean {
    const reactions = this._reactionsForEntry.value;
    return reactions
      .filter(r => r.reaction == reaction)
      .some(r => r.author == this.store.myAgentPubKey);
  }

  private _toggleReaction(reactionType: string) {
    if (this._haveIReacted(reactionType)) {
      this.store.unreact({
        reaction: reactionType,
        reactOn: this.entryHash,
      });
    } else {
      this.store.react({
        reaction: reactionType,
        reactOn: this.entryHash,
      });
    }
  }

  /**
   *
   * @param reactionType Actual reaction (e.g. Unicode emoji character)
   * @param reactionCount Object contianing the number of reactions of this type
   *  as well as the authors of the corresponding reactions
   * @returns lit html element
   */
  renderReactionType(reactionType: string, reactionCount: ReactionCount) {
    return html`
      <span
        @click=${() => this._toggleReaction(reactionType)}
        class="reaction-count"
        >${reactionType} ${reactionCount.count}</span
      >
    `;
  }

  render() {
    if (this._loading) {
      return html``;
    }

    const orderedReactions = this.groupReactions(this._reactionsForEntry.value);

    return html`
      <div class="row">
        ${Object.entries(orderedReactions).map(
          ([reactionType, reactionCount]) =>
            this.renderReactionType(reactionType, reactionCount)
        )}
      </div>
    `;
  }

  static localStyles = css`
    .reaction-count {
      background: rgb(0, 0, 0, 0.1);
      padding: 3px 5px;
      font-family: Roboto, sans-serif;
      font-size: 22px;
      border-radius: 12px;
      cursor: pointer;
      margin: 0 2px;
    }
  `;

  static get styles() {
    return [sharedStyles, this.localStyles];
  }
}
