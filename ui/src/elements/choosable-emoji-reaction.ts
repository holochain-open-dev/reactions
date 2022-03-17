import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { EntryHashB64 } from "@holochain-open-dev/core-types";
import { Icon } from '@material/mwc-icon';

import 'emoji-picker-element';
import { ReactionsStore } from "../reactions-store";
import { ReactionInput } from "../types";
import { contextProvided } from "@holochain-open-dev/context";
import { reactionsStoreContext } from "../context";


@customElement('choosable-emoji-reaction')
export class ChoosableEmojiReaction extends LitElement {

    @property({ type: String })
    entryHash!: EntryHashB64;

    @state()
    showPalette: boolean = false;

    @contextProvided({ context: reactionsStoreContext })
    @property({ type: Object })
    store!: ReactionsStore;



    private _togglePicker = () => {
        this.showPalette = !this.showPalette;
    }

    private _emojiReaction(e: CustomEvent) {
        const reaction: string = e.detail.unicode;
        let reactionInput: ReactionInput = {
            reaction: reaction,
            reactOn: this.entryHash,
        }
        this.store.react(reactionInput)
        this._togglePicker();
    }


    render() {
        // console.log(this.show);
        // console.log((this.show? 'shown' : ''));

        return html`
            <mwc-icon class="add-reaction" @click=${this._togglePicker} aria-label="Add reaction" style="--mdc-icon-size: 38px;">add_reaction</mwc-icon>
            <div class="tooltip" role="tooltip" class=${this.showPalette? '' : 'hidden'}>
                <emoji-picker @emoji-click=${this._emojiReaction}></emoji-picker>
            </div>
        `
    }

    static get scopedElements() {
        return {
            'mwc-icon': Icon
        };
    }

    static styles = css`
    .hidden {
        display:none;
    }
    .add-reaction {
        color: rgb(140,140,140);
        font-size: 24px;
        cursor: pointer;
        padding: 3px;
    }
    .add-reaction:hover {
        color: rgb(40,40,40);
    }
    `
}



