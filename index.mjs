export default class Quiz {
    endpointURL = 'https://woodstone-dev-app.herokuapp.com/api/';

    constructor() {
        this.loadAnswers();
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
        const element = document.createElement('quiz-configurator');
        // element.innerHTML = `<h1>Конфигуратор</h1><form id="quiz"></form>`;
        document.body.appendChild(element);
        return await this.quizSteps.forEach(await this.renderStep, this);
    }

    async renderStep(step) {
        const element = document.createElement('quiz-step');
        element.id = step.data.fieldname;
        element.title = step.title;
        // element.innerHTML += `<h2>${step.title}</h2>`;
        switch (step.typeId) {
            case 1:
                step.data.counters.forEach(item => element.innerHTML += `<div><label for="${item.fieldname}">${item.title}</label>
<input id="${item.fieldname}" name="${item.fieldname}" type="number" value="${this.getAnswer(step.data.fieldname, item.fieldname, 0)}" onchange="app.setAnswer('${step.data.fieldname}','${item.fieldname}',parseInt(this.value))"></div>`);
                break;
            case 2:
                step.data.ranges.forEach(item => element.innerHTML += `<div><label for="${item.fieldname}">${item.title}</label>
<input id="${item.fieldname}" name="${item.fieldname}" type="range" min="${item.minValue}" max="${item.maxValue}" value="${this.getAnswer(step.data.fieldname, item.fieldname, item.minValue)}" onchange="app.setAnswer('${step.data.fieldname}','${item.fieldname}',parseInt(this.value))"></div>`);
                break;
            case 3:
                const checkedValue = this.getAnswer(step.data.fieldname, false, 0);
                step.data.options.forEach(item => element.innerHTML += `<div><input ${item.value === checkedValue ? 'checked' : ''} id="${step.data.fieldname}_${item.value}" name="${step.data.fieldname}" value="${item.value}" type="radio" onchange="app.setAnswer('${step.data.fieldname}',false,parseInt(this.form.${step.data.fieldname}.value))">
<label for="${step.data.fieldname}_${item.value}">${item.title}</label></div>`);
                break;
            default:
                return false;
        }
        // document.getElementById('quiz').appendChild(element);
        document.querySelector('quiz-configurator').appendChild(element);
    }

    setAnswer(step, item, value) {
        if (!item) this.preferences[step] = value;
        else {
            if (!this.preferences[step]) this.preferences[step] = {}
            this.preferences[step][item] = value;
        }
        this.saveAnswers();
    }

    getAnswer(step, item, defaultValue = '') {
        if (!item) return this.preferences[step] ? this.preferences[step] : defaultValue;
        if (!this.preferences[step]) return defaultValue;
        return this.preferences[step][item] ? this.preferences[step][item] : defaultValue;
    }

    saveAnswers() {
        localStorage.setItem('preferences', JSON.stringify(this.preferences));
    }

    loadAnswers() {
        try {
            this.preferences = localStorage.getItem('preferences') ? JSON.parse(localStorage.getItem('preferences')) : {}
        } catch (e) {
            console.error(e);
            this.preferences = {}
        }
    }

    async createUser() {
        const data = {
            "name": "User Name",
            "phone": "+79920129664",
            "email": "example@example.com",
            "preferences": this.preferences
        }
        const response = await fetch(this.endpointURL + 'user', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(r => r.json());
        return console.debug(response);
    }

}

customElements.define('quiz-configurator', class extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: 'open'}).append(configurator.content.cloneNode(true))
    }
});
customElements.define('quiz-step', class extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: 'open'}).append(step.content.cloneNode(true));
        this.shadowRoot.querySelector('.title').innerText = this.getAttribute('title');
    }
});