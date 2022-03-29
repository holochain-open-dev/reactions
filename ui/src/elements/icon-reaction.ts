import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import { EntryHashB64 } from "@holochain-open-dev/core-types";
import { contextProvided } from "@holochain-open-dev/context";

import { IconButtonToggle } from '@material/mwc-icon-button-toggle';

import { StoreSubscriber } from 'lit-svelte-stores';
import { ReactionsStore } from "../reactions-store";
import { ReactionDetails } from "../types";
import { ReactionInput } from "../types";
import { reactionsStoreContext } from "../context";
import { sharedStyles } from './utils/shared-styles';

type ReactionAuthor = String; // may potentially be a nickname from the profiles zome instead of the agent public key
type ReactionCount = { count: number, authors: Array<ReactionAuthor> }
type FilteredReactions = Record<string, ReactionCount>;


@customElement('icon-reaction')
export class IconReaction extends LitElement {

    @property({ type: String })
    entryHash!: EntryHashB64;

    @property({ type: String })
    onIcon!: string;

    @property({ type: String })
    offIcon!: string;

    @property({ type: String })
    reactionName!: string | undefined;

    @state()
    private _loading: boolean = true;

    @contextProvided({ context: reactionsStoreContext })

    @property({ type: Object })
    store!: ReactionsStore;



    private _reactionsForEntry = new StoreSubscriber(this, () =>
    this.store?.reactionsForEntry({entryHash: this.entryHash})
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

        let counts: number = 0;

        reactions.forEach((details) => {
            if (details.reaction === (this.reactionName ? this.reactionName : this.onIcon)) {
                counts++;
            }
        })

        return counts
    }

    private _haveIReacted(reaction: string): boolean {
        let reactions = this._reactionsForEntry.value;
        return reactions
            .filter((r) => r.reaction == reaction)
            .some((r) => r.author == this.store.myAgentPubKey)
    }

    private _customReaction() {

        let reactionInput: ReactionInput = {
            reaction: this.reactionName ? this.reactionName : this.onIcon,
            reactOn: this.entryHash,
        }

        console.log(reactionInput);

        if (!this._haveIReacted(this.reactionName ? this.reactionName : this.onIcon)) {
            this.store.react(reactionInput)
        } else {
            this.store.unreact(reactionInput)
        }
    }


    render() {
        if (this._loading) {
            return html``
        }

        let reactionsCount = this.countReactions(this._reactionsForEntry.value);

        return html`
            <div class="icon-button">
                <span>
                    <mwc-icon-button-toggle @click=${this._customReaction}
                        .on=${this._haveIReacted(this.reactionName ? this.reactionName : this.onIcon)}
                        .onIcon=${this.onIcon}
                        .offIcon=${this.offIcon}
                        .aria-label="${this.onIcon} reaction"
                    >
                    </mwc-icon-button-toggle>
                </span>
                <span>
                    ${reactionsCount}
                </span>
            </div>
            `
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
    `

    static get styles() {
        return [sharedStyles, this.localStyles];
    }

}



