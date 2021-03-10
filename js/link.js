import {LitElement, html, css, loadStyles} from "./quiz.mjs";

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-link', class extends LitElement {
        static get properties() {
            return {
                href: {type: String},
                "data-full-text": {type: String},
                "data-order": {type: Number},
            }
        }

        static get styles() {
            return css([styles]);
        }

        render() {
            return html`
                <a href="${this.href}" data-full-text="${this['data-full-text']}"
                   data-order="${this['data-order'] || 'не активен'}"
                   ?data-full-text-set="${this['data-full-text']}">
                    <slot></slot>
                </a>`
        }
    }))
