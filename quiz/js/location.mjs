import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import quiz, {loadStyles} from "./quiz.mjs";

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-location', class extends LitElement {
        colors = [
            '#FF9435',
            '#6EBC61',
            '#56CCF2',
        ]

        static get styles() {
            return css([styles]);
        }

        static get properties() {
            return {
                polygons: {attribute: false}
            }
        }

        firstUpdated() {
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
                if (!quiz.areas) return console.debug('No polygons');
                this.polygons = quiz.areas.map((area, i) => {
                    let myPolygon = new ymaps.Polygon([area.polygon], {hintContent: area.title}, {
                        fillColor: this.colors[i],
                        cursor: 'default',
                        fillOpacity: .6,
                        outline: false
                    });
                    this.myMap.geoObjects.add(myPolygon);
                    return myPolygon;
                });
            });
        }

        render() {
            return html`
                <section>
                    <iframe scrolling="no" frameborder="0"></iframe>
                    <div class="areas">
                        ${quiz.areas.map((area, i) => html`
                            <input type="checkbox" id="${'area_' + area.areaId}"
                                   ?checked="${quiz.getState('selectedAreas', area.areaId, true)}"
                                   onchange="app.toggleArea('${area.areaId}',this.checked);this.getRootNode().host.polygons[${i}].options.set('visible', this.checked)">
                            <label for="${'area_' + area.areaId}">${area.title}</label>
                        `)}
                    </div>
                </section><a class="big-next-bottom-button" href="#contacts">
                    Далее<span>Выбор готового решения</span>
                </a>`;
        }
    }))
