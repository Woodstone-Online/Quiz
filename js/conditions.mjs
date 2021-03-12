import quiz, {LitElement, html, css, loadStyles} from "./quiz.mjs";

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-conditions', class extends LitElement {
        static get styles() {
            return css([styles]);
        }

        render() {
            return html`
                <h1>Варианты покупки</h1>
                <div class="plans">
                    <a href="#contacts"
                       @click="${() => quiz.setAnswer('interest', null, 2) && (quiz.contactSubject = 'Offer') && quiz.sendEvent('LeadButton', 'exchange')}">
                        <h2 class="title">Обмен квартиры на дом</h2>
                        <div>
                            <p>Выкупим вашу квартиру в счет будущего дома.</p>
                            <p>За 4 месяца построим готовый к жизни загородный дом.</p>
                            <p>Продолжайте жить в квартире, пока идет строительство.</p>
                        </div>
                    </a>
                    <a href="#contacts"
                       @click="${() => quiz.setAnswer('interest', null, 1) && (quiz.contactSubject = 'Offer') && quiz.sendEvent('LeadButton', 'mortgage')}">
                        <h2 class="title">Готовый дом за 20%</h2>
                        <div>
                            <p>Для начала строительства достаточно внести всего 20%.</p>
                            <p>За 4 месяца мы построим готовый к жизни загородный дом и поможем с оформлением ипотеки от
                                2.7% годовых.</p>
                        </div>
                    </a>
                    <a href="#contacts"
                       @click="${() => quiz.setAnswer('interest', null, 3) && (quiz.contactSubject = 'Offer') && quiz.sendEvent('LeadButton', 'workAgreement')}">
                        <h2 class="title">Поэтапная оплата</h2>
                        <div>
                            <p>Строительство дома по договору подряда. Вносите оплату поэтапно за результат фактически
                                выполненных работ.</p>
                            <p>Классический и наиболее быстрый вариант покупки дома.</p>
                        </div>
                    </a>
                </div>
                <a href="#contacts" class="get-pdf"
                   @click="${() => quiz.setAnswer('interest', null, 5) && (quiz.contactSubject = 'WhatsApp') && quiz.sendEvent('LeadButton', 'pdf')}">
                    Скачать проект в PDF
                </a>
            `;
        }
    }))
