import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import quiz, {loadStyles} from "./quiz.mjs";

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-contacts', class extends LitElement {
        static get styles() {
            return css([styles]);
        }

        constructor() {
            super();
            this.subjects = {
                Consultation: {
                    title: 'Консультация',
                    caption: 'Сохраните текущий прогресс и закажите звонок от менеджера — мы ответим на все интересующие вопросы'
                },
                WhatsApp: {
                    title: 'Получить проект дома в WhatsApp',
                    caption: 'Сохраните текущий прогресс и получите проект понравившегося дома в PDF',
                    button: 'Получить PDF'
                },
                Viewing: {
                    title: 'Записаться на просмотр',
                    caption: 'Посмотрите место, где в ближайшем будущем сможете жить вы сами. В удобное время.',
                    button: 'Записаться'
                },
                Offer: {
                    title: 'Отлично, мы поняли что вы хотите!',
                    caption: 'Сохраните проект и отправьте его на обработку менеджеру — в скором времени мы ознакомим вас с лучшими предложениями.',
                    button: 'Сохранить проект'
                }
            }
            this.subject = quiz.contactSubject && this.subjects[quiz.contactSubject] ? this.subjects[quiz.contactSubject] : null;
            this.whatsapp = quiz.getAnswer('communication', 'whatsapp', true);
            this.phone = quiz.getAnswer('communication', 'phone', true);
            this.email = quiz.getAnswer('communication', 'email', false);
        }

        setAnswer(step, item, value) {
            app.setAnswer(step, item, value);
            this[item] = value;
            return this.requestUpdate();
        }

        toggleCommunication(item, value) {
            return this.setAnswer('communication', item, value)
        }

        checkCommunications(event) {
            return Array.from(this.shadowRoot.querySelectorAll('input[type="checkbox"]')).filter(input => input.checked).length < 1 ? event.preventDefault() : null;
        }

        render() {
            return html`
                <section>
                    <div class="header">
                        <h1>${this.subject && this.subject.title ? this.subject.title : 'Заявка'}</h1>
                        ${this.subject && this.subject.caption ? html`<span
                                style="margin: 10px 0">${this.subject.caption}</span>` : ''}
                        <!--                        <span>Предпочтения для связи</span>-->
                    </div>
                    <div>
                        <div class="communications">
                            <input type="checkbox" id="whathsapp" ?checked="${this.whatsapp}"
                                   onclick="this.getRootNode().host.checkCommunications(event)"
                                   onchange="this.getRootNode().host.toggleCommunication('whatsapp',this.checked)">
                            <label for="whathsapp">Whats App</label>
                            <input type="checkbox" id="email" ?checked="${this.email}"
                                   onclick="this.getRootNode().host.checkCommunications(event)"
                                   onchange="this.getRootNode().host.toggleCommunication('email', this.checked)">
                            <label for="email">Email</label>
                        </div>
                        <form>
                            <h2>Мы свяжемся с вами в течении <span>14 минут</span></h2>
                            <input type="tel" placeholder="+7" .value="${quiz.getState('profile', 'phone', '')}"
                                   onchange="app.updateProfile('phone',this.value)"
                                   onfocus="window.disableScroll=false"
                                   onblur="window.disableScroll=true">
                            <input type="text" placeholder="Ваше имя" .value="${quiz.getState('profile', 'name', '')}"
                                   onchange="app.updateProfile('name',this.value)" onfocus="window.disableScroll=false"
                                   onblur="window.disableScroll=true">
                            ${this.email ? html`
                                <input type="email" placeholder="E-mail"
                                       .value="${quiz.getState('profile', 'email', '')}"
                                       onchange="app.updateProfile('email',this.value)"
                                       onfocus="window.disableScroll=false"
                                       onblur="window.disableScroll=true">` : ''}
                        </form>
                    </div>
                </section>
                <aside>
                    <h2>Мы свяжемся с вами в течении <span>14 минут</span></h2>
                </aside>
                <button class="big-next-bottom-button" @click="${quiz.createUser.bind(quiz)}">
                    ${this.subject && this.subject.button ? this.subject.button : 'Оставить заявку'}
                </button>`;
        }
    }))
