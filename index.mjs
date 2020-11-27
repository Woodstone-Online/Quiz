export default class Quiz {
    endpointURL = 'https://woodstone-dev-app.herokuapp.com/api/';

    constructor() {
        this.init();
        return this;
    }

    async init() {
        await this.loadConfiguration();
        await this.renderQuiz();
    }

    async loadConfiguration() {
        return Object.assign(this, await fetch(this.endpointURL + 'quizSteps').then(r => r.json())
            .catch(e => console.error(e) || {}));
    }

    async renderQuiz() {
        const element = document.createElement('quiz-page');
        element.id = 'quiz';
        element.innerHTML = `<h1>Конфигуратор</h1>`;
        document.body.appendChild(element);
        return await this.quizSteps.forEach(await this.renderStep);
    }

    async renderStep(step) {
        const element = document.createElement('quiz-step');
        element.id = step.data.fieldname;
        element.innerHTML += `<h2>${step.title}</h2>`;
        switch (step.typeId) {
            case 1:
                step.data.counters.forEach(item => element.innerHTML += `<div><label for="${item.fieldname}">${item.titie}</label>
<input id="${item.fieldname}" name="${item.fieldname}" type="number" value="0"></div>`);
                break;
            case 2:
                step.data.ranges.forEach(item => element.innerHTML += `<div><label for="${item.fieldname}">${item.titie}</label>
<input id="${item.fieldname}" name="${item.fieldname}" type="range" min="${item.minValue}" max="${item.maxValue}"></div>`);
                break;
            case 3:
                step.data.options.forEach(item => element.innerHTML += `<div><input id="${step.data.fieldname}_${item.value}" name="${step.data.fieldname}" value="${item.value}" type="radio">
<label for="${step.data.fieldname}_${item.value}">${item.titie}</label></div>`);
                break;
            default:
                return false;
        }
        document.getElementById('quiz').appendChild(element);
    }

}