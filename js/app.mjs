import quiz, {LitElement, html, css, loadStyles} from './quiz.mjs'
import './menu.mjs';
import './needs.mjs';
import './location.mjs';
import './home.mjs';
import './contract.mjs';
import './conditions.mjs';
import './contacts.mjs';
import './final.mjs';
import './next-stage.mjs';

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
            if (targetStage && document.getElementById(targetStage)) {
                this.stage = targetStage;
                quiz.analytics.setPage(this.stage);
                quiz.analytics.sendPageview();
                quiz.facebookPixel.sendPageview();
                return this.stage;
            }
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
