import quiz, {loadStyles} from './quiz.mjs'
import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import './menu.mjs';
import './needs.mjs';
import './location.mjs';
import './home.mjs';
import './conditions.mjs';
import './contacts.mjs';
import './final.mjs';

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-app', class extends LitElement {
        constructor() {
            super();
            // this.updateStage();
            window.addEventListener('hashchange', this.updateStage.bind(this));
        }

        static get properties() {
            return {
                stage: {type: String}
            }
        }

        static get styles() {
            return css([styles]);
        }

        updateStage() {
            let targetStage = location.hash.substr(1)
            if (targetStage && document.getElementById(targetStage)) return this.stage = targetStage;
            return location.hash = 'needs'; // TODO: Popstate replace
        }

        /*firstUpdated() {
            // quiz.initRouter(this.shadowRoot.querySelector('main'));
            this.shadowRoot.insertBefore(document.createElement('quiz-menu'), this.shadowRoot.querySelector('main'));
        }*/

        render() {
            return html`
                <!--<quiz-menu></quiz-menu>-->
                <slot></slot>
                <main>${this.stage ? document.createElement('quiz-' + this.stage) : null}</main>
            `;
        }
    }))
