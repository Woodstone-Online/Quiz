import quiz, {LitElement, html, css, loadStyles} from "./quiz.mjs";
import parsePhoneNumber
    from 'https://cdn.skypack.dev/pin/libphonenumber-js@v1.9.12-rsuXNvTsIuSwRucnHAdU/mode=imports,min/unoptimized/bundle/libphonenumber-min.js';

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
                Design: {
                    title: 'Проектирование в подарок',
                    caption: 'Целая команда из дизайнеров и архитекторов ждет, чтобы начать работу над вашим проектом',
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

        parsePhone(phone) {
            try {
                const parser = parsePhoneNumber(phone, 'RU');
                return parser ? parser.number : phone;
            } catch (e) {
                return phone;
            }
        }

        toggleCommunication(item, value) {
            return this.setAnswer('communication', item, value)
        }

        checkCommunications(event) {
            return Array.from(this.shadowRoot.querySelectorAll('input[type="checkbox"]')).filter(input => input.checked).length < 1 ? event.preventDefault() : null;
        }

        async createUser(e) {
            return await quiz.createUser.call(quiz, e, this);
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
                        <form id="contacts">
                            <h2>Мы свяжемся с вами в течении <span>14 минут</span></h2>
                            <input type="tel" placeholder="+7" .value="${quiz.getState('profile', 'phone', '+7')}"
                                   onchange="app.updateProfile('phone',this.getRootNode().host.parsePhone(this.value));this.setCustomValidity('')"
                                   onfocus="window.disableScroll=false"
                                   onblur="window.disableScroll=true" name="phone" autocomplete="tel">
                            <input type="text" placeholder="Ваше имя" .value="${quiz.getState('profile', 'name', '')}"
                                   onchange="app.updateProfile('name',this.value);this.setCustomValidity('')"
                                   onfocus="window.disableScroll=false"
                                   onblur="window.disableScroll=true" name="name" autocomplete="name">
                            ${this.email ? html`
                                <input type="email" placeholder="E-mail" name="email" autocomplete="email"
                                       .value="${quiz.getState('profile', 'email', '')}"
                                       onchange="app.updateProfile('email',this.value);this.setCustomValidity('')"
                                       onfocus="window.disableScroll=false" onblur="window.disableScroll=true">` : ''}
                        </form>
                    </div>
                </section>
                <aside>
                    <h2>Мы свяжемся с вами в течении <span>14 минут</span></h2>
                </aside>
                <button class="big-next-bottom-button" @click="${this.createUser}">
                    ${this.subject && this.subject.button ? this.subject.button : 'Оставить заявку'}
                </button>`;
        }
    }))
