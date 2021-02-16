import quiz, {loadStyles} from './quiz.mjs';
import {LitElement, html, css} from 'https://cdn.skypack.dev/lit-element';

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-needs', class extends LitElement {
        static get styles() {
            return css([styles]);
        }

        constructor() {
            super();
            this.lastFocusedStep = null;
            this.lastStep = null;
        }

        firstUpdated() {
            quiz.initRangesSlider.call(this);
            this.focusFirstStep();
            this.lastStep = this.shadowRoot.querySelector('section:last-of-type')
            this.shadowRoot.querySelector('#nextStep').addEventListener('mousedown', this.nextStep.bind(this))
            this.addEventListener('blur', () => window.matchMedia("(max-width: 1023px)").matches ? this.focusStep(this.lastFocusedStep) : null);
            this.shadowRoot.querySelectorAll('section').forEach(step => step.addEventListener('mousedown', e => this.setFocusedStep(e)))
        }

        focusFirstStep() {
            const targetStep = this.shadowRoot.querySelector('section');
            this.lastFocusedStep = targetStep;
            targetStep.focus();
        }

        focusStep(targetStep) {
            if (!targetStep) return false;
            this.lastFocusedStep = targetStep;
            targetStep.focus();
        }

        nextStep(event) {
            event.preventDefault();
            if (this.shadowRoot.activeElement) {
                const targetStep = this.shadowRoot.activeElement.nextElementSibling;
                this.lastFocusedStep = targetStep;
                targetStep.focus();
            }
        }

        setFocusedStep(event) {
            if (!event.target) return false;
            this.lastFocusedStep = event.target.matches('section') ? event.target : event.target.closest('section');
        }

        render() {
            return html`${quiz.quizSteps.map(this.renderStep)}
            <div class="navigation-buttons">
                <button id="nextStep" class="big-next-bottom-button">Далее</button>
                <quiz-next-stage stage="needs"></quiz-next-stage>
            </div>`
        }

        renderStep(step) {
            switch (step.type) {
                case 'counters':
                    return html`
                        <section id="${step.fieldname}" tabindex="1">
                            <span class="title">${step.title}</span>
                            <div class="counters">
                                ${step.data.map(item => html`
                                    <div><label>${item.title}</label>
                                        <div>
                                            <button onclick="this.nextElementSibling.stepDown();window.app.setAnswer('${step.fieldname}','${item.fieldname}',parseInt(this.nextElementSibling.value));window.app.sendEvent('Quiz', '${step.fieldname + 'Chosen'}');"
                                                    class="decrease"></button>
                                            <input type="number" min="0" step="1" maxlength="2" max="99" disabled
                                                   id="${item.fieldname}" name="${item.fieldname}"
                                                   .value="${quiz.getAnswer(step.fieldname, item.fieldname, 0)}"
                                                   onchange="window.app.setAnswer('${step.fieldname}','${item.fieldname}',parseInt(this.value))">
                                            <button onclick=" this.previousElementSibling.stepUp();window.app.setAnswer('${step.fieldname}','${item.fieldname}',parseInt(this.previousElementSibling.value));window.app.sendEvent('Quiz', '${step.fieldname + 'Chosen'}');"
                                                    class="increase"></button>
                                        </div>
                                    </div>`)}
                            </div>
                        </section>`;
                    break;
                case 'options-small':
                case 'options-regular':
                    const checkedValue = quiz.getAnswer(step.fieldname, false, null);
                    return html`
                        <section id="${step.fieldname}" tabindex="1"><span class="title">${step.title}</span>
                            <form class="${step.type === 'options-regular' ? 'buttons' : 'mini-buttons'}">
                                ${step.data.map(item => html`
                                    <input type="radio" name="${step.fieldname}"
                                           id="${step.fieldname + '_' + item.value}"
                                           ?checked="${item.value === checkedValue}" .value="${item.value}"
                                           onchange="app.setAnswer('${step.fieldname}',false,parseInt(Object.fromEntries(new FormData(this.form).entries()).${step.fieldname}));window.app.sendEvent('Quiz', '${step.fieldname + 'Chosen'}');">
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
                                    <div class="slider-line">
                                        <div></div>
                                    </div>
                                </div>`)}
                        </section>`
                default:
                    return html`${step.fieldname} ${step.title}<br>`
            }
        }
    }))
