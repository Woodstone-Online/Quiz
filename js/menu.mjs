import quiz, {LitElement, html, css, loadStyles} from "./quiz.mjs";
import './link.js';

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-menu', class extends LitElement {
        static get styles() {
            return css([styles]);
        }

        render() {
            return html`
                <header>
                    <a href="https://woodstone.online"><img src="/img/Logo.svg" alt="Logo"></a>
                    <a href="#contacts" class="call-button"
                       @click="${() => quiz.setAnswer('interest', null, 6) && (quiz.contactSubject = 'Consultation') && quiz.sendEvent('LeadButton', 'callback')}">Звонок</a>
                </header>
                <aside>
                    <nav>
                        <slot></slot>
                    </nav>
                </aside>
            `;
        }
    }))
