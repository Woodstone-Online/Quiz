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
            if (targetStage && quiz.stage[targetStage]) {
                this.stage = targetStage;
                document.title = (quiz.stage[targetStage].title.desktopMenu || quiz.stage[targetStage].title.menu) + ' | ' + quiz.title;
                quiz.analytics.setPage(this.stage);
                quiz.analytics.sendPageview();
                quiz.facebookPixel.sendPageview();
                return this.stage;
            }
            return location.hash = quiz.initStage; // TODO: Popstate replace
        }

        async firstUpdated() {
            return await quiz.updateInitState('app');
        }

        render() {
            return html`
                <!--<quiz-menu></quiz-menu>-->
                <slot></slot>
                <main>${this.stage ? document.createElement('quiz-' + this.stage) : null}</main>
            `;
        }
    }))
