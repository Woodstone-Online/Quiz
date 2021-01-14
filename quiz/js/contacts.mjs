import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import quiz, {loadStyles} from "./quiz.mjs";

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-contacts', class extends LitElement {
        static get styles() {
            return css([styles]);
        }

        constructor() {
            super();
            this.whatsapp = quiz.getAnswer('communication', 'whatsapp', true);
            this.phone = quiz.getAnswer('communication', 'phone', true);
            this.email = quiz.getAnswer('communication', 'email', false);
        }

        setAnswer(step, item, value) {
            app.setAnswer(step, item, value);
            this[item] = value;
            return this.requestUpdate();
        }

        render() {
            return html`
                <h1>Заявка</h1>
                <section>
                    <div class="header">
                        <span>Предпочтения для связи</span>
                        <div class="communications">
                            <input type="checkbox" id="whathsapp"
                                   onchange="this.getRootNode().host.setAnswer('communication','whatsapp',this.checked)"
                                   ?checked="${this.whatsapp}">
                            <label for="whathsapp">Whats App</label>
                            <input type="checkbox" id="phone"
                                   onchange="this.getRootNode().host.setAnswer('communication','phone',this.checked)"
                                   ?checked="${this.phone}">
                            <label for="phone">Телефон</label>
                            <input type="checkbox" id="email"
                                   onchange="this.getRootNode().host.setAnswer('communication', 'email', this.checked)"
                                   ?checked="${this.email}">
                            <label for="email">Email</label>
                        </div>
                    </div>
                    <form>
                        <h2>Мы свяжемся с вами в течении <span>14 минут</span></h2>
                        ${this.phone || this.whatsapp ? html`
                            <input type="tel" placeholder="+7" .value="${quiz.getState('profile', 'phone', '')}"
                                   onchange="app.updateProfile('phone',this.value)" onfocus="window.disableScroll=false"
                                   onblur="window.disableScroll=true">` : ''}
                        <input type="text" placeholder="Ваше имя" .value="${quiz.getState('profile', 'name', '')}"
                               onchange="app.updateProfile('name',this.value)" onfocus="window.disableScroll=false"
                               onblur="window.disableScroll=true">
                        ${this.email ? html`
                            <input type="email" placeholder="E-mail" .value="${quiz.getState('profile', 'email', '')}"
                                   onchange="app.updateProfile('email',this.value)" onfocus="window.disableScroll=false"
                                   onblur="window.disableScroll=true">` : ''}
                    </form>
                </section>
                <aside>
                    <h2>Мы свяжемся с вами в течении <span>14 минут</span></h2>
                </aside>
                <button class="big-next-bottom-button" @click="${quiz.createUser.bind(quiz)}">Оставить заявку</button>`;
        }
    }))
