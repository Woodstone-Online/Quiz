import './app.mjs';

export class Quiz {
    constructor({apiURL} = {}) {
        this.endpointURL = apiURL;
        this.stage = {
            needs: {next: 'location'},
            location: {
                next: 'home', title: 'Выбрать районы и направления'
            },
            home: {
                next: 'conditions', title: 'Выбрать дом — готовое решение'
            },
            conditions: {
                next: 'contacts', title: 'Доступные варианты  покупки'
            },
            contacts: {}
        }
        this.defaultAnswers = {
            preferences: {
                residents: {
                    adults: 0,
                    children: 0
                },
                budget: {}
            },
            selectedAreas: {}
        }
        Object.assign(this, this.defaultAnswers);
        this.initStages();
        this.init();
        return this;
    }

    loadAllAnswers() {
        this.loadAnswers();
        this.loadAnswers('selectedAreas');
        this.loadAnswers('selectedVillages');
        this.loadAnswers('selectedHome', null, String);
        this.loadAnswers('profile');
    }

    parseAnswersFromParameters() {
        const parameters = new URLSearchParams(location.search);
        const answer = Object.fromEntries(['adults', 'children', 'budget'].filter(item => parameters.has(item)).map(item => [item, parameters.get(item)]))
        if (answer.adults) this.preferences.residents.adults = answer.adults;
        if (answer.children) this.preferences.residents.children = answer.children;
        if (answer.budget) this.preferences.budget.to = answer.budget;
    }

    async init() {
        await Promise.allSettled([
            this.loadConfiguration('quizSteps', 'quizStep', 'fieldname'),
            this.loadConfiguration('areas', 'area', 'areaId').then(async () => this.areas.forEach(area => this.toggleArea(area.areaId, true, true))),
            this.loadConfiguration('homes', 'home', 'homeId').then(() => this.homes.sort(function (a, b) {
                if (a.space > b.space) return 1;
                if (a.space < b.space) return -1;
                return 0;
            }))
        ]);
        this.parseAnswersFromParameters();
        this.loadAllAnswers();
        await this.renderQuiz();
        this.homes.forEach(this.loadHomeData.bind(this))
    }

    initRangesSlider() {
        let root = this.shadowRoot.querySelector('#budget');
        var sliderSections = root.getElementsByClassName("range-slider");
        for (var x = 0; x < sliderSections.length; x++) {
            var sliders = sliderSections[x].getElementsByTagName("input");
            for (var y = 0; y < sliders.length; y++) {
                if (sliders[y].type === "range") {
                    sliders[y].addEventListener('input', getVals, {passive: true})
                    sliders[y].addEventListener('change', setVals, {passive: true})
                    getVals.call(sliders[y])
                }
            }
        }
    }

    /*initRouter(outlet) {
        this.router = new Router(outlet, {baseUrl: '/'});
        this.router.setRoutes([
            {path: '/location', component: 'quiz-location'},
            {path: '/contacts', component: 'quiz-contacts'},
            {path: '(.*)', component: 'quiz-needs'},
        ]);
        return this.router;
    }*/

    async loadConfiguration(route, store = false, key = false) {
        const data = await fetch(this.endpointURL + route).then(r => r.json()).catch(e => console.error(e) || {})
        if (store && key) {
            this[store] = {};
            const items = Object.values(data).pop();
            if (items.length) items.forEach(item => this[store][item[key]] = item);
        }
        return Object.assign(this, data);
    }

    async loadHomeData(home) {
        // TODO: Check if request in the queue
        if (!home.dataLoaded) {
            const data = await fetch(this.endpointURL + 'homes/' + home.homeId).then(r => r.json()).catch(e => console.error(e) || {})
            Object.assign(home, data.home, {dataLoaded: true})
            if (home.images && home.images.length) home.plan = home.images.pop()
        }
        return home;
    }

    async renderQuiz() {
        window.disableScroll = true;
        window.addEventListener("scroll", (e) => {
            if (!window.disableScroll) return;
            e.preventDefault();
            window.scrollTo(0, 0);
        });
        if (document.querySelector('quiz-app')) await document.querySelector('quiz-app').updateStage();
        // const element = document.createElement('quiz-app');
        // document.body.appendChild(element);
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
        if (!this.preferences) return false;
        if (!item) this.preferences[step] = value;
        else {
            if (!this.preferences[step]) this.preferences[step] = {}
            this.preferences[step][item] = value;
        }
        this.saveAnswers();
        window.dispatchEvent(new CustomEvent('setAnswer', {detail: {step, item, value}}));
        return value;
    }

    toggleArea(id, state = !this.getState('selectedAreas', id), disableSync) {
        if (!id) return false;
        if (state) this.selectedAreas[id] = true;
        else this.selectedAreas[id] = false;
        if (!disableSync) this.saveAnswers('selectedAreas');
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

    resetHome() {
        // if (!id) return false;
        this.selectedHome = null;
        this.saveAnswers('selectedHome');
        return true;
    }

    updateProfile(key, value) {
        if (!key) return false;
        this.profile[key] = value;
        this.saveAnswers('profile');
        return true;
    }

    getAnswer(step, item, defaultValue = null) {
        if (!this.preferences) return defaultValue;
        if (!item) return typeof this.preferences[step] == "undefined" || (typeof this.preferences[step] == "string" && !this.preferences[step].length) ? defaultValue : this.preferences[step];
        if (!this.preferences[step]) return defaultValue;
        return typeof this.preferences[step][item] == "undefined" || (typeof this.preferences[step][item] == "string" && !this.preferences[step][item].length) ? defaultValue : this.preferences[step][item];
    }

    getState(type, id, defaultValue = false) {
        if (!type || !this[type]) return defaultValue;
        if (id) return typeof this[type][id] === "boolean" ? this[type][id] : this[type][id] || defaultValue;
        else return this[type] || defaultValue;
    }

    saveAnswers(key = 'preferences') {
        localStorage.setItem(key, JSON.stringify(this[key]));
    }

    loadAnswers(key = 'preferences', initial = {}, type = Object) {
        switch (type) {
            case Object:
                try {
                    this[key] = deepMerge(this[key] || initial, localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : initial)
                } catch (e) {
                    console.error(e);
                    this[key] = deepMerge(this[key] || initial, initial)
                }
                break;
            default:
                try {
                    this[key] = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : initial
                } catch (e) {
                    console.error(e);
                    this[key] = initial
                }
                break;
        }
    }

    async createUser(e) {
        e.preventDefault();
        const preferences = Object.assign({}, this.preferences);
        for (let item in preferences) if (preferences.hasOwnProperty(item) && typeof preferences[item] !== "object")
            preferences[item] = {value: preferences[item]};
        preferences.communication = {"email": false, "whatsapp": true, "phone": true}
        preferences.interest = {"value": 1}
        if (preferences.budget && preferences.budget.total) delete preferences.budget.total; // TODO: Backward compatibility
        const areaIds = this.selectedAreas ? Object.keys(Object.fromEntries(Object.entries(this.selectedAreas).filter(([_, v]) => v))) : null;
        const cottageVillageIds = this.selectedVillages ? Object.keys(this.selectedVillages) : null;
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
        if (response.user) {
            // alert('Пользователь успешно создан, ID: ' + response.user.userId)
            localStorage.clear();
            this.loadAllAnswers();
            location.href = '/final.html';
        }
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

    initStages() {
        Object.entries(this.stage).forEach(([stage, data] = item) => {
            data.id = stage;
            if (data.next) {
                data.next = this.stage[data.next];
                Object.defineProperty(data, 'nextStage', {
                    get: () => data.next ? (data.next.skip ? data.next.nextStage : data.next) : null
                })
            }
            switch (stage) {
                case 'location':
                    Object.defineProperty(data, 'skip', {
                        get: () => this.getAnswer('land', false, null) === 2
                    })
                    break;
                case 'home':
                    Object.defineProperty(data, 'skip', {
                        get: () => typeof this.getAnswer('home', false, null) === "number" ? this.getAnswer('home', false, null) !== 1 : false
                    })
                    break;
            }
        })
    }

    getNextStage(stage) {
        if (stage && this.stage[stage]) return this.stage[stage].nextStage;
    }

}

export default window.app = new Quiz({apiURL: 'https://core.woodstone.online/api/'})

window.getVals = function () {
    // Get slider values
    var parent = this.parentNode;
    var slides = parent.getElementsByTagName("input");
    var slide1 = parseInt(slides[0].value);
    var slide2 = parseInt(slides[1].value);
    let max = slides[0].max;
    let min = slides[0].min;
    // Neither slider will clip the other, so make sure we determine which is larger
    if (slide1 > slide2) {
        var tmp = slide2;
        slide2 = slide1;
        slide1 = tmp;
    }

    // var displayElement = parent.getElementsByClassName("rangeValues")[0];
    let price_from = parent.querySelector('#price_from');
    let price_to = parent.querySelector('#price_to');
    let line = parent.querySelector('.slider-line>div');
    let numberFormat = new Intl.NumberFormat('ru-RU');
    price_from.innerText = numberFormat.format(slide1);
    price_to.innerText = slide2 < max ? numberFormat.format(slide2) : 'Неважно';

    line.style.webkitClipPath = line.style.clipPath = `inset(0 ${((max - slide2) * 100) / (max - min)}% 0 ${((slide1 - min) * 100) / (max - min)}%)`;
}

window.setVals = function () {
    // Get slider values
    var parent = this.parentNode;
    var slides = parent.getElementsByTagName("input");
    var slide1 = parseInt(slides[0].value);
    var slide2 = parseInt(slides[1].value);
    let max = slides[0].max;
    // Neither slider will clip the other, so make sure we determine which is larger
    if (slide1 > slide2) {
        var tmp = slide2;
        slide2 = slide1;
        slide1 = tmp;
    }

    // var displayElement = parent.getElementsByClassName("rangeValues")[0];
    // let price_from = parent.querySelector('#price_from');
    // let price_to = parent.querySelector('#price_to');
    // price_from.innerText = slide1;
    // price_to.innerText = slide2 < max ? slide2 : 'Неважно';
    app.setAnswer(slides[0].dataset.step, 'from', slide1)
    app.setAnswer(slides[0].dataset.step, 'to', slide2)
}

function deepMerge(target, source) {
    Object.entries(source).forEach(([key, value]) => {
        if (value && typeof value === 'object') {
            deepMerge(target[key] = target[key] || {}, value);
            return;
        }
        target[key] = value;
    });
    return target;
}

export function getDir(scriptPath) {
    let path = new URL(scriptPath).pathname.split('/');
    path.pop()
    return location.origin + path.join('/') + '/'
}

export function getFileName(scriptPath, extension = true) {
    let path = new URL(scriptPath).pathname.split('/');
    return extension ? path.pop() : path.pop().split('.').shift();
}

export async function load(path, file) {
    return await fetch(new URL(file || '', path).toString()).then(_ => _.text());
}

export async function loadStyles(scriptPath, filename = null) {
    return await load(getDir(scriptPath) + '../css/', filename || getFileName(scriptPath, false) + '.css')
}
