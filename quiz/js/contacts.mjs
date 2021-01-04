import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import quiz, {loadStyles} from "./quiz.mjs";

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-contacts', class extends LitElement {
        static get styles() {
            return css([styles]);
        }

        render() {
            return html`
                <h1>Заявка</h1>
                <section>
                    <div class="header">
                        <span>Предпочтения для связи</span>
                        <div class="communications">
                            <input type="checkbox" id="whathsapp"
                                   onchange="app.setAnswer('communication','whatsapp',this.checked)"
                                   ?checked="${quiz.getAnswer('communication', 'whatsapp', true)}">
                            <label for="whathsapp">Whats App</label>
                            <input type="checkbox" id="phone"
                                   onchange="app.setAnswer('communication','phone',this.checked)"
                                   ?checked="${quiz.getAnswer('communication', 'phone', true)}">
                            <label for="phone">Телефон</label>
                            <input type="checkbox" id="email"
                                   onchange="app.setAnswer('communication','email',this.checked)"
                                   ?checked="${quiz.getAnswer('communication', 'email', false)}">
                            <label for="email">Email</label>
                        </div>
                    </div>
                    <form>
                        <h2>Мы свяжемся с вами в течении <span>14 минут</span></h2>
                        <input type="tel" placeholder="+7" .value="${quiz.getState('profile', 'phone', '')}"
                               onchange="app.updateProfile('phone',this.value)" onfocus="window.disableScroll=false"
                               onblur="window.disableScroll=true">
                        <input type="text" placeholder="Ваше имя" .value="${quiz.getState('profile', 'name', '')}"
                               onchange="app.updateProfile('name',this.value)" onfocus="window.disableScroll=false"
                               onblur="window.disableScroll=true">
                        <input type="email" placeholder="E-mail" .value="${quiz.getState('profile', 'email', '')}"
                               onchange="app.updateProfile('email',this.value)" onfocus="window.disableScroll=false"
                               onblur="window.disableScroll=true">
                    </form>
                </section>
                <button class="big-next-bottom-button" @click="${quiz.createUser.bind(quiz)}">Оставить заявку
                </button>`;
        }
    }))
