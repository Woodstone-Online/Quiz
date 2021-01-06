import quiz, {loadStyles} from './quiz.mjs';
import {LitElement, html, css} from 'https://jspm.dev/lit-element';

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-needs', class extends LitElement {
        static get styles() {
            return css([styles]);
        }

        render() {
            return html`${quiz.quizSteps.map(this.renderStep)}
            <a class="big-next-bottom-button" href="#location">
                Далее<span>Выбор предпочтений по локации</span>
            </a>`
        }

        firstUpdated() {
            quiz.initRangesSlider.call(this);
        }

        renderStep(step) {
            switch (step.type) {
                case 'counters':
                    return html`
                        <section id="${step.fieldname}" tabindex="1"><span class="title">${step.title}</span>
                            <div class="counters">
                                ${step.data.map(item => html`
                                    <div><label>${item.title}</label>
                                        <div>
                                            <button onclick="this.nextElementSibling.stepDown();window.app.setAnswer('${step.fieldname}','${item.fieldname}',parseInt(this.nextElementSibling.value))">
                                                –
                                            </button>
                                            <input type="number" min="0" step="1" maxlength="2" max="99" disabled
                                                   id="${item.fieldname}" name="${item.fieldname}"
                                                   .value="${quiz.getAnswer(step.fieldname, item.fieldname, 0)}"
                                                   onchange="window.app.setAnswer('${step.fieldname}','${item.fieldname}',parseInt(this.value))">
                                            <button onclick=" this.previousElementSibling.stepUp();window.app.setAnswer('${step.fieldname}','${item.fieldname}',parseInt(this.previousElementSibling.value))">
                                                +
                                            </button>
                                        </div>
                                    </div>`)}
                            </div>
                        </section>`;
                    break;
                case 'options-small':
                case 'options-regular':
                    const checkedValue = quiz.getAnswer(step.fieldname, false, 0);
                    return html`
                        <section id="${step.fieldname}" tabindex="1"><span class="title">${step.title}</span>
                            <form class="${step.type === 'options-regular' ? 'buttons' : 'mini-buttons'}">
                                ${step.data.map(item => html`
                                    <input type="radio" name="${step.fieldname}"
                                           id="${step.fieldname + '_' + item.value}"
                                           ?checked="${item.value === checkedValue}" .value="${item.value}"
                                           onchange="app.setAnswer('${step.fieldname}',false,parseInt(Object.fromEntries(new FormData(this.form).entries()).${step.fieldname}))">
                                    <label for="${step.fieldname + '_' + item.value}">${item.title}</label>`)}
                            </form>
                        </section>`;
                case 'ranges':
                    return html`
                        <section id="${step.fieldname}" tabindex="1"><span class="title">${step.title}</span>
                            ${step.data.map(item => html`
                                <div class="range-slider">
                                    <div class="money">от
                                        <span id="price_from">${quiz.getAnswer(step.fieldname, 'from', item.minValue)}</span>
                                        до
                                        <span id="price_to">${quiz.getAnswer(step.fieldname, 'to', item.maxValue)}</span>
                                    </div>
                                    <input type="range" step="100000" id="${item.fieldname + '_1'}"
                                           name="${item.fieldname}"
                                           min="${item.minValue}" max="${item.maxValue}" data-step="${step.fieldname}"
                                           .value="${quiz.getAnswer(step.fieldname, 'from', item.minValue)}">
                                    <input type="range" step="100000" id="${item.fieldname + '_2'}"
                                           name="${item.fieldname}"
                                           min="${item.minValue}" max="${item.maxValue}" data-step="${step.fieldname}"
                                           .value="${quiz.getAnswer(step.fieldname, 'to', item.maxValue)}">
                                </div>`)}
                        </section>`
                default:
                    return html`${step.fieldname} ${step.title}<br>`
            }
        }

        template() {
            return html`
                <section class="active" tabindex="1">
                    <span class="title">Какой дом вы бы хотели построить?</span>
                    <div class="buttons">
                        <input type="radio" id="test1" name="home"><label for="test1">Типовой проект</label>
                        <input type="radio" id="test2" name="home"><label for="test2">Спроектируйте мне дом с
                        нуля</label>
                        <input type="radio" id="test3" name="home"><label for="test3">У меня уже есть проект</label>
                    </div>
                </section>
                <section class="" tabindex="1"><span class="title">Место</span></section>
                <section class="" tabindex="1"><span class="title">Когда вы хотели бы переехать?</span>
                    <div class="mini-buttons">
                        <input type="radio" id="test4" name="period"><label for="test4">3-6</label>
                        <input type="radio" id="test5" name="period"><label for="test5">6-12</label>
                        <input type="radio" id="test6" name="period"><label for="test6">12-18</label>
                        <input type="radio" id="test8" name="period"><label for="test8">Не имеет значения</label>
                    </div>
                </section>
                <section class="" tabindex="1"><span class="title">Бюджет</span>
                    <div class="range-slider">
                        <div class="money">от <span>1 800 000</span> до <span>100 000 000</span></div>
                        <input step="100000" value="100000" type="range" id="test7_1" name="price_1" min="1800000"
                               max="100000000">
                        <input step="100000" value="50000000" type="range" id="test7_2" name="price_2" min="1800000"
                               max="100000000">
                    </div>
                </section>
                <section class="" tabindex="1"><span class="title">Для кого этот дом?</span>
                    <div class="counters">
                        <div><label>Взрослых</label>
                            <div>
                                <button onclick="this.nextElementSibling.stepDown()">–</button>
                                <input type="number" value="0" min="0" step="1" maxlength="2" max="99">
                                <button onclick="this.previousElementSibling.stepUp()">+</button>
                            </div>
                        </div>
                        <div><label>Детей</label>
                            <div>
                                <button onclick="this.nextElementSibling.stepDown()">–</button>
                                <input type="number" value="0" min="0" step="1" maxlength="2" max="99">
                                <button onclick="this.previousElementSibling.stepUp()">+</button>
                            </div>
                        </div>
                    </div>
                </section>
                <button class="big-next-bottom-button">Далее<span>Выбор предпочтений по локации</span></button>
            `;
        }
    }))
