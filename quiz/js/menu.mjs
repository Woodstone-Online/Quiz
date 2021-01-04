import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import {loadStyles} from "./quiz.mjs";
import './link.js';

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-menu', class extends LitElement {
        static get styles() {
            return css([styles]);
        }

        render() {
            return html`
                <header>
                    <img src="/quiz/img/Logo.svg" alt="Logo">
                </header>
                <aside>
                    <nav>
                        <slot></slot>
                    </nav>
                </aside>
            `;
        }
    }))
