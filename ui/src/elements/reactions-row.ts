import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { EntryHashB64 } from "@holochain-open-dev/core-types";

import { ReactionsStore } from "../reactions-store";
import { ReactionDetails } from "../types";
import { contextProvided } from "@holochain-open-dev/context";
import { reactionsStoreContext } from "../context";
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { StoreSubscriber } from 'lit-svelte-stores';
import { sharedStyles } from './utils/shared-styles';


type ReactionAuthor = String; // may potentially be a nickname from the profiles zome instead of the agent public key
type ReactionCount = { count: number, authors: Array<ReactionAuthor> }
type GroupedReactions = Record<string, ReactionCount>;

@customElement('reactions-row')
export class ReactionsRow extends ScopedElementsMixin(LitElement) {


    @property({ type: String })
    entryHash!: EntryHashB64;

    @state()
    showPalette: boolean = false;

    // @state()
    // private _loading: boolean = true;

    @contextProvided({ context: reactionsStoreContext })

    @property({ type: Object })
    store!: ReactionsStore;

    private _reactionsForEntry = new StoreSubscriber(this, () =>
    this.store?.reactionsForEntry(this.entryHash)
    );

    async firstUpdated() {
        console.log("I AM FIRST UPDATED");
        await this.store.fetchReactionsForEntry(this.entryHash);
        // this._loading = false;
      }

    /**
     * Groups all the reactions by reaction type, e.g. by emoji unicode character
     *
     * @param reactions Array of ReactionDetails
     *
     */
    groupReactions(reactions: Array<ReactionDetails>) {
        let orderedReactions:  GroupedReactions = {};
        reactions.forEach((details) => {
            if (orderedReactions[details.reaction]) {
                orderedReactions[details.reaction].count += 1;
                orderedReactions[details.reaction].authors.push(details.author);
            } else {
                orderedReactions[details.reaction] = {
                    count: 1,
                    authors: [details.author]
                }
            }
        })
        return orderedReactions
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
            <span class="reaction-count">${reactionType} ${reactionCount.count}</span>
        `;
    }

    render() {
        console.log("I AM RENDERED");
        console.log(this.store);
        console.log(this._reactionsForEntry);
        console.log("+++ reactionsForEntry:", this.store?.reactionsForEntry(this.entryHash));
        let orderedReactions = this.groupReactions(this._reactionsForEntry.value);

        return html`
        <div class="row">
        ${Object.entries(orderedReactions).map(
            ([reactionType, reactionCount]) => this.renderReactionType(reactionType, reactionCount)
        )}
        </div>
        `;
    }

    static localStyles = css`
        .reaction-count {
            background: rgb(0,0,0,0.1);
            padding: 3px 5px;
            font-family: Roboto, sans-serif;
            font-size: 22px;
            border-radius: 12px;
            cursor: pointer;
            margin: 0 2px;
        }
    `

    static get styles() {
        return [sharedStyles, this.localStyles];
      }

}


