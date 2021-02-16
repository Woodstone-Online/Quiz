import quiz, {LitElement, html, css, loadStyles} from "./quiz.mjs";

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-next-stage', class extends LitElement {
        constructor(props) {
            super(props);
            window.addEventListener('setAnswer', () => this.requestUpdate());
        }

        static get properties() {
            return {
                stage: {type: String},
                nextStage: {attribute: false}
            }
        }

        static get styles() {
            return css([styles]);
        }

        async performUpdate() {
            this.nextStage = quiz.getNextStage(this.stage);
            super.performUpdate();
        }

        render() {
            return html`<a href="#${this.nextStage.id}">Далее<span>${this.nextStage.title || ''}</span></a>`
        }
    }))
