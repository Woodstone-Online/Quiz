export default class Quiz {
    endpointURL = 'https://woodstone-dev-app.herokuapp.com/api/';

    constructor() {
        this.loadAnswers();
        this.loadAnswers('selectedAreas');
        this.loadAnswers('selectedVillages');
        this.loadAnswers('selectedHome');
        this.loadAnswers('profile');
        this.init();
        return this;
    }

    async init() {
        await this.loadConfiguration('quizSteps', 'quizStep', 'fieldname');
        await this.loadConfiguration('areas', 'area', 'areaId');
        await this.loadConfiguration('homes', 'home', 'homeId');
        await this.renderQuiz();
    }

    initRangesSlider() {
        let root = document.querySelector('quiz-configurator').shadowRoot.querySelector('#budget');
        var sliderSections = root.getElementsByClassName("range-slider");
        for (var x = 0; x < sliderSections.length; x++) {
            var sliders = sliderSections[x].getElementsByTagName("input");
            for (var y = 0; y < sliders.length; y++) {
                if (sliders[y].type === "range") {
                    sliders[y].oninput = getVals;
                    // Manually trigger event first time to display values
                    sliders[y].oninput();
                }
            }
        }
    }

    async loadConfiguration(route, store = false, key = false) {
        const data = await fetch(this.endpointURL + route).then(r => r.json()).catch(e => console.error(e) || {})
        if (store && key) {
            this[store] = {};
            const items = Object.values(data).pop();
            if (items.length) items.forEach(item => this[store][item[key]] = item);
        }
        return Object.assign(this, data);
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
                /*step.data.forEach(item => element.innerHTML += `<div><label for="${item.fieldname}">${item.title}</label>
<input id="${item.fieldname}" name="${item.fieldname}" type="range" min="${item.minValue}" max="${item.maxValue}" value="${this.getAnswer(step.fieldname, item.fieldname, item.minValue)}" onchange="app.setAnswer('${step.fieldname}','${item.fieldname}',parseInt(this.value))"></div>`);*/
                step.data.forEach(item => element.innerHTML += `<style>section.range-slider {
            position: relative;
            width: 200px;
            height: 35px;
            text-align: center;
        }

        section.range-slider input {
            pointer-events: none;
            position: absolute;
            overflow: hidden;
            left: 0;
            top: 15px;
            width: 200px;
            outline: none;
            height: 18px;
            margin: 0;
            padding: 0;
        }

        section.range-slider input::-webkit-slider-thumb {
            pointer-events: all;
            position: relative;
            z-index: 1;
            outline: 0;
        }

        section.range-slider input::-moz-range-thumb {
            pointer-events: all;
            position: relative;
            z-index: 10;
            -moz-appearance: none;
            width: 9px;
        }

        section.range-slider input::-moz-range-track {
            position: relative;
            z-index: -1;
            background-color: rgba(0, 0, 0, 1);
            border: 0;
        }

        section.range-slider input:last-of-type::-moz-range-track {
            -moz-appearance: none;
            background: none transparent;
            border: 0;
        }

        section.range-slider input[type=range]::-moz-focus-outer {
            border: 0;
        }</style><section class="range-slider">
  <span class="rangeValues"></span>
  <input step="100000" value="${this.getAnswer(step.fieldname, 'from', item.minValue)}" type="range" id="${item.fieldname}_1" name="${item.fieldname}" min="${item.minValue}" max="${item.maxValue}" data-step="${step.fieldname}" data-field="${item.fieldname}">
  <input step="100000" value="${this.getAnswer(step.fieldname, 'to', item.maxValue)}" type="range" id="${item.fieldname}_2" name="${item.fieldname}" min="${item.minValue}" max="${item.maxValue}" data-step="${step.fieldname}" data-field="${item.fieldname}">
</section>`);
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

    toggleArea(id, state = !this.getState('selectedAreas', id)) {
        if (!id) return false;
        if (state) this.selectedAreas[id] = true;
        else delete this.selectedAreas[id];
        this.saveAnswers('selectedAreas');
        return state;
    }

    toggleVillage(id, state = !this.getState('selectedVillages', id)) {
        if (!id) return false;
        if (state) this.selectedVillages[id] = true;
        else delete this.selectedVillages[id];
        this.saveAnswers('selectedVillages');
        return state;
    }

    selectHome(id) {
        if (!id) return false;
        this.selectedHome = id;
        this.saveAnswers('selectedHome');
        return true;
    }

    updateProfile(key, value) {
        if (!key) return false;
        this.profile[key] = value;
        this.saveAnswers('profile');
        return true;
    }

    getAnswer(step, item, defaultValue = '') {
        if (!item) return this.preferences[step] ? this.preferences[step] : defaultValue;
        if (!this.preferences[step]) return defaultValue;
        return this.preferences[step][item] ? this.preferences[step][item] : defaultValue;
    }

    getState(type, id, defaultValue = false) {
        if (!type || !this[type]) return defaultValue;
        if (id) return this[type][id] || defaultValue;
        else return this[type] || defaultValue;
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
        preferences.communication = {"email": false, "whatsapp": true, "phone": true}
        preferences.interest = {"value": 1}
        const areaIds = Object.keys(this.selectedAreas);
        const cottageVillageIds = Object.keys(this.selectedVillages);
        const data = Object.assign({
            "preferences": preferences,
            "project": {
                "areaIds": areaIds,
                "cottageVillageIds": cottageVillageIds,
                "homeId": this.selectedHome
            }
        }, this.getState('profile'))
        console.dir(data);
        const response = await fetch(this.endpointURL + 'user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(r => r.json());
        if (response.details) alert(response.details.pop().message);
        if (response.user) alert('Пользователь успешно создан, ID: ' + response.user.userId)
        return console.debug(response);
    }

    async showVillages() {
        await this.loadConfiguration('cottage-villages?' + new URLSearchParams(Object.keys(app.selectedAreas).map(key => ['areaIds[]', key])).toString(), 'cottageVillage', 'cottageVillageId');
        const node = document.querySelector('quiz-configurator').shadowRoot.querySelector('quiz-villages').shadowRoot;
        node.innerHTML = '<h2 class="title">Посмотрите и отметьте понравившиеся поселки</h2>';
        this.cottageVillages.forEach(village => {
            let image = village.image ? (village.image.url ? village.image.url : village.image) : '';
            let source = `<div style="margin-bottom: 50px"><img src="${image}" width="300px"><br><h3>${village.title}</h3><p>${village.address}</p><p>${this.area[village.areaId].title}</p>`;
            village.data.icons.forEach(icon => source += `<img src="${icon.icon}" title="${icon.description}" width="40px">`);
            let buttonText = this.getState('selectedVillages', village.cottageVillageId) ? '💔 Больше не нравится' : '♥️ Мне нравится';
            node.innerHTML += source + `<br><br><button onclick="this.innerText=app.toggleVillage('${village.cottageVillageId}')?'💔 Больше не нравится' : '♥️ Мне нравится'">${buttonText}</button></div>`;
        })
    }

    async showHomes() {
        const node = document.querySelector('quiz-configurator').shadowRoot.querySelector('quiz-homes').shadowRoot;
        node.innerHTML = '<h2 class="title">Выберите дом</h2>';
        this.homes.forEach(home => {
            let image = home.image ? (home.image.url ? home.image.url : home.image) : '';
            let source = `<div style="margin-bottom: 50px"><img src="${image}" width="300px"><br><h3>${home.title}</h3><p>${home.price}</p>`
            node.innerHTML += source + `<input type="radio" name="home" value="${home.homeId}" id="home_${home.homeId}" onchange="app.selectHome(this.value)" ${app.getState('selectedHome') === home.homeId ? 'checked' : ''}><label for="home_${home.homeId}">Выбрать этот дом</label></div>`;
        })
    }

    showProfile(node) {
        node.innerHTML = `<h2 class="title">Заявка</h2>
<input required type="tel" placeholder="+7" minlength="12" maxlength="12" pattern="+7[0-9]{10}" onchange="app.updateProfile('phone',this.value)" value="${app.getState('profile', 'phone', '')}"><br>
<input required placeholder="Ваше имя" onchange="app.updateProfile('name',this.value)" value="${app.getState('profile', 'name', '')}"><br>
<input required type="email" placeholder="E-mail" onchange="app.updateProfile('email',this.value)" value="${app.getState('profile', 'email', '')}">`;
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
                app.initRangesSlider();
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
        app.areas.forEach(area => this.shadowRoot.innerHTML += `<div><input type="checkbox" id="area_${area.areaId}" ${app.getState('selectedAreas', area.areaId) ? 'checked' : ''} onchange="app.toggleArea('${area.areaId}',this.checked)">
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
customElements.define('quiz-homes', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `<br><button onclick="app.showHomes()">Показать дома</button>`;
    }
});
customElements.define('quiz-profile', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `<br><button onclick="app.showProfile(this.parentNode)">Заполнить профиль</button>`;
    }
});

function getVals() {
    // Get slider values
    var parent = this.parentNode;
    var slides = parent.getElementsByTagName("input");
    var slide1 = parseInt(slides[0].value);
    var slide2 = parseInt(slides[1].value);
    // Neither slider will clip the other, so make sure we determine which is larger
    if (slide1 > slide2) {
        var tmp = slide2;
        slide2 = slide1;
        slide1 = tmp;
    }

    var displayElement = parent.getElementsByClassName("rangeValues")[0];
    displayElement.innerHTML = slide1 + " - " + slide2;
    app.setAnswer(slides[0].dataset.step, 'from', slide1)
    app.setAnswer(slides[0].dataset.step, 'to', slide2)
}