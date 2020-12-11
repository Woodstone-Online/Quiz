export default class Quiz {
    endpointURL = 'https://woodstone-dev-app.herokuapp.com/api/';

    constructor() {
        this.loadAnswers();
        this.loadAnswers('selectedAreas');
        this.loadAnswers('selectedVillages');
        this.init();
        return this;
    }

    async init() {
        await this.loadConfiguration('quizSteps');
        await this.loadConfiguration('areas');
        await this.renderQuiz();
    }

    async loadConfiguration(route) {
        return Object.assign(this, await fetch(this.endpointURL + route).then(r => r.json())
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
        element.id = step.fieldname;
        element.title = step.title;
        // element.innerHTML += `<h2>${step.title}</h2>`;
        switch (step.type) {
            case 'counters':
                step.data.forEach(item => element.innerHTML += `<div><label for="${item.fieldname}">${item.title}</label>
<input id="${item.fieldname}" name="${item.fieldname}" type="number" value="${this.getAnswer(step.fieldname, item.fieldname, 0)}" onchange="app.setAnswer('${step.fieldname}','${item.fieldname}',parseInt(this.value))"></div>`);
                break;
            case 'ranges':
                step.data.forEach(item => element.innerHTML += `<div><label for="${item.fieldname}">${item.title}</label>
<input id="${item.fieldname}" name="${item.fieldname}" type="range" min="${item.minValue}" max="${item.maxValue}" value="${this.getAnswer(step.fieldname, item.fieldname, item.minValue)}" onchange="app.setAnswer('${step.fieldname}','${item.fieldname}',parseInt(this.value))"></div>`);
                break;
            case 'options-small':
            case 'options-regular':
                const checkedValue = this.getAnswer(step.fieldname, false, 0);
                step.data.forEach(item => element.innerHTML += `<div><input ${item.value === checkedValue ? 'checked' : ''} id="${step.fieldname}_${item.value}" name="${step.fieldname}" value="${item.value}" type="radio" onchange="app.setAnswer('${step.fieldname}',false,parseInt(Object.fromEntries(new FormData(this.form).entries()).${step.fieldname}))">
<label for="${step.fieldname}_${item.value}">${item.title}</label></div>`);
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

    toggleArea(id, state = true) {
        if (!id) return false;
        if (state) this.selectedAreas[id] = state;
        else delete this.selectedAreas[id];
        this.saveAnswers('selectedAreas');
    }

    toggleVillage(id) {
        if (!id) return false;
        this.selectedVillages[id] = true;
        this.saveAnswers('selectedVillages');
    }

    getAnswer(step, item, defaultValue = '') {
        if (!item) return this.preferences[step] ? this.preferences[step] : defaultValue;
        if (!this.preferences[step]) return defaultValue;
        return this.preferences[step][item] ? this.preferences[step][item] : defaultValue;
    }

    saveAnswers(key = 'preferences') {
        localStorage.setItem(key, JSON.stringify(this[key]));
    }

    loadAnswers(key = 'preferences') {
        try {
            this[key] = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {}
        } catch (e) {
            console.error(e);
            this[key] = {}
        }
    }

    async createUser() {
        const preferences = Object.assign({}, this.preferences);
        for (let item in preferences) if (preferences.hasOwnProperty(item) && typeof preferences[item] !== "object")
            preferences[item] = {value: preferences[item]};
        const data = {
            "name": "User Name",
            "phone": "+79920129664",
            "email": "example@example.com",
            "preferences": preferences,
            "project": {
                "areaIds": ["7f3737c1-4634-42af-954d-c8d82e7e6a50", "4216b04b-b288-49cf-a2a6-f942273898e9"],
                "cottageVillageIds": ["438fbb3d-1d46-44dc-affb-dfc2df9427be", "2348b481-569f-4a02-8350-dd69cc9bf1a7"],
                "homeId": "ee3dbe79-335e-459a-a824-16d156509d5c"
            }
        }
        const response = await fetch(this.endpointURL + 'user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(r => r.json());
        return console.debug(response);
    }

    async showVillages() {
        await this.loadConfiguration('cottage-villages?areaIds=[' + Object.keys(app.selectedAreas).toString() + ']');
        const node = document.querySelector('quiz-configurator').shadowRoot.querySelector('quiz-villages').shadowRoot;
        node.innerHTML = '<h2 class="title">Посмотрите и отметьте понравившиеся поселки</h2>';
        this.cottageVillages.forEach(village => {
            let source = `<div><img src="${village.image}"><br><h3>${village.title}</h3><p>${village.address}</p>`;
            village.data.icons.forEach(icon => source += `<img src="${icon.icon}" title="${icon.description}">`);
            node.innerHTML += source + `<button onclick="app.toggleVillage('${village.cottageVillageId}')">Мне нравится</button></div>`;
        })
    }

}

customElements.define('quiz-configurator', class extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: 'open'}).append(configurator.content.cloneNode(true));
        const form = this.shadowRoot.querySelector('form')
        const slot = this.shadowRoot.querySelector('slot');
        slot.addEventListener('slotchange', () => {
            setTimeout(() => {
                for (let field of slot.assignedNodes()) {
                    form.insertBefore(field, slot)
                }
            });
        })
    }
});
customElements.define('quiz-step', class extends HTMLElement {
    connectedCallback() {
        if (this.connected) return;
        this.connected = true;
        this.attachShadow({mode: 'open'}).append(step.content.cloneNode(true));
        this.shadowRoot.querySelector('.title').innerText = this.getAttribute('title');
    }
});
customElements.define("quiz-map", class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.IFrame = null;
        this.IFrameDocument = null;
        this.IFrameWindow = null;
    }

    connectedCallback() {
        this.render();
        this.initIframe();
        this.initMap();
    }

    initIframe() {
        this.IFrame = this.shadowRoot.querySelector("iframe");
        this.IFrameDocument = this.IFrame.contentDocument;
        this.IFrameWindow = this.IFrame.contentWindow;
        // создадим скрипт который подтянет в iframe карту
        const script = document.createElement("script");
        script.setAttribute(
            "src",
            "https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=d1df8012-8243-4242-b139-4a7c6c298e2c"
        );
        script.onload = this.initMap.bind(this);
        this.mapElement = document.createElement("div");
        this.mapElement.style.height = "100vh";
        this.mapElement.style.width = "100vw";
        this.IFrameDocument.body.appendChild(script);
        this.IFrameDocument.body.appendChild(this.mapElement);
        this.IFrameDocument.body.style.margin = "0";
    }

    initMap() {
        const {ymaps} = this.IFrameWindow;
        ymaps.ready(() => {
            this.myMap = new ymaps.Map(this.mapElement, {
                center: [56.86, 60.56],
                zoom: 10
            });
            if (!app.areas) return console.debug('No polygons');
            app.areas.forEach(area => {
                let myPolygon = new ymaps.Polygon([area.polygon], {hintContent: area.title}, {});
                this.myMap.geoObjects.add(myPolygon);
            });
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                height: 400px;
                width: 400px;
                display: block;
            }
            iframe {
                height: 100%;
                width: 100%;
            }
        </style>
        <iframe scrolling="no" frameborder="0"></iframe>
    `;
    }
});
customElements.define('quiz-areas', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        // this.attachShadow({mode: 'open'}).append(step.content.cloneNode(true));
        // this.shadowRoot.querySelector('.title').innerText = this.getAttribute('title');
        this.shadowRoot.innerHTML = '<h2 class="title">Выберите районы</h2>';
        app.areas.forEach(area => this.shadowRoot.innerHTML += `<div><input type="checkbox" id="area_${area.areaId}" onchange="app.toggleArea('${area.areaId}',this.checked)">
<label for="area_${area.areaId}">${area.title}</label></div>`);
        // this.shadowRoot.innerHTML += `<br><button onclick="app.showVillages()">Показать поселки</button>`;
    }
});
customElements.define('quiz-villages', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `<br><button onclick="app.showVillages()">Показать поселки</button>`;
    }
});