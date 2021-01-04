import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import {loadStyles} from "./quiz.mjs";

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-link', class extends LitElement {
        static get properties() {
            return {
                href: {type: String}
            }
        }

        static get styles() {
            return css([styles]);
        }

        render() {
            return html`
                <a href="${this.href}">
                    <slot></slot>
                </a>`
        }
    }))
