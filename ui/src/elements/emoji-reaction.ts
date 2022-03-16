import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { EntryHashB64 } from "@holochain-open-dev/core-types";
import { IconButton } from '@material/mwc-icon-button';

import 'emoji-picker-element';
import { ReactionsStore } from "../reactions-store";
import { ReactionInput } from "../types";
import { contextProvided } from "@holochain-open-dev/context";
import { reactionsStoreContext } from "../context";


@customElement('emoji-reactions')
export class EmojiReaction extends LitElement {

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
        debugger;
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
            <mwc-icon-button icon="add_reaction" @click=${this._togglePicker}></mwc-icon-button>
            <div class="tooltip" role="tooltip" class=${this.showPalette? '' : 'hidden'}>
                <emoji-picker @emoji-click=${this._emojiReaction}></emoji-picker>
            </div>
        `
    }

    static get scopedElements() {
        return {
            'mwc-icon-button': IconButton
        };
    }

    static styles = css`
    .hidden {
        display:none;
    }
`
}



