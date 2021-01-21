import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import quiz, {loadStyles} from "./quiz.mjs";

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-conditions', class extends LitElement {
        static get styles() {
            return css([styles]);
        }

        render() {
            return html`
                <div class="conditions">
                    <div>
                        <span class="title">2,7%</span>
                        <span>Ипотека от 2,7%</span>
                    </div>
                    <div>
                        <span class="title">100%</span>
                        <span>Учет квартиры до 100%</span>
                    </div>
                    <div>
                        <span class="title">10%</span>
                        <span>Предоплата 10%, остальные 90% потом</span>
                    </div>
                </div>
                <p>Миссия Woodstone — осуществлять мечту людей о загородном доме.
                    Помимо строительства мы предлагаем уникальные условия приобретения загородной недвижимости.</p>
                <p>Какой вариант подходит вам?</p>
                <div class="plans">
                    <a href="#contacts" style="background-image: url(/img/1.plans.conditions.png)"
                       @click="${() => quiz.setAnswer('interest', null, 2) && (quiz.contactSubject = 'Offer')}">
                        <h2 class="title">Обмен квартиры на дом</h2>
                        <p>Выкупим вашу квартиру по рыночной стоимости.</p>
                        <p>За 4 месяца построим готовый к жизни загородный дом.</p>
                        <p>Продолжайте жить в квартире, пока идет строительство.</p>
                    </a>
                    <a href="#contacts" style="background-image: url(/img/2.plans.conditions.png)"
                       @click="${() => quiz.setAnswer('interest', null, 1) && (quiz.contactSubject = 'Offer')}">
                        <h2 class="title">Готовый дом за 10%</h2>
                        <p>Для начала строительства достаточно внести всего 10%.</p>
                        <p>За 4 месяца мы построим готовый к жизни загородный дом и поможем с оформлением ипотеки от
                            2.7% годовых.</p>
                    </a>
                    <a href="#contacts" style="background-image: url(/img/1.plans.conditions.png)"
                       @click="${() => quiz.setAnswer('interest', null, 3) && (quiz.contactSubject = 'Offer')}">
                        <h2 class="title">Поэтапная оплата</h2>
                        <p>Строительство дома по договору подряда. Вносите оплату поэтапно за результат фактически
                            выполненных работ.</p>
                        <p>Классический и наиболее быстрый вариант покупки дома.</p>
                    </a>
                </div>
                <a href="#contacts" class="get-pdf"
                   @click="${() => quiz.setAnswer('interest', null, 5) && (quiz.contactSubject = 'WhatsApp')}">
                    Скачать проект дома в PDF
                </a>
            `;
        }
    }))
