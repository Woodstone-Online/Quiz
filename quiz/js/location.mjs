import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import quiz from "./quiz.mjs";

window.customElements.define('quiz-location', class extends LitElement {
    static get styles() {
        return css`
          :host {
            font-family: 'Montserrat', sans-serif;
            display: block;
            height: calc(100% - 70px);
            //min-height: 100%;
            margin-bottom: 70px;
          }

          section {
            position: relative;
            background: white;
            border-radius: 6px;
            box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.06);
            height: 100%;
            overflow: hidden;
          }

          iframe {
            height: 100%;
            width: 100%;
          }

          .areas {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;

            flex-wrap: wrap;
            flex-direction: column;
            overflow-x: auto;
            max-height: 50px;
            padding: 15px;
            margin: 0 0;
            scroll-snap-type: x mandatory;
          }

          .areas:after {
            content: '';
            min-width: 30px;
            min-height: 50px;
          }

          .areas input[type="checkbox"] {
            display: none;
          }

          .areas label {
            font-family: 'Open Sans', sans-serif;
            position: relative;
            border: 1px solid rgba(0, 0, 0, 0.12);
            border-radius: 100px;
            padding: 8px 15px;
            padding-left: 40px;
            margin-left: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            background: #FFFFFF;
            font-size: 14px;
            line-height: 20px;
            font-weight: normal;
          }

          .areas label:before {
            box-sizing: border-box;
            content: '';
            width: 20px;
            height: 20px;
            position: absolute;
            left: 10px;
            background: white;
            border-radius: 20px;
            border: 1.5px solid rgba(0, 0, 0, 0.12);
          }

          .areas input[type="checkbox"]:checked + label:before {
            background: #FF9435;

          }

          .big-next-bottom-button {
            box-sizing: border-box !important;
            text-decoration: none;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 70px;
            background: #6EBC61;
            color: white;
            font-weight: 600;
            font-size: 22px;
            line-height: 26px;
            padding: 0 30px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .big-next-bottom-button span {
            display: inline-block;
            font-size: 13px;
            line-height: 17px;
            font-weight: normal;
            max-width: 150px;
            opacity: 0.8;
          }

          @media (max-width: 1023px) {
            section {
              border-bottom-left-radius: 0;
              border-bottom-right-radius: 0;
            }
          }

          @media (min-width: 1024px) {
            :host {
              height: calc(100% - 130px);
              border-radius: 6px;
              background: white;
              padding: 15px;
            }

            section {
              box-shadow: initial;
            }

            .big-next-bottom-button {
              border-radius: 100px;
              width: 337px;
              left: 30px;
              right: initial;
              bottom: 30px;
              position: fixed;
              font-size: 20px;
            }
          }

          @media (min-width: 1364px) {
            .big-next-bottom-button {
              left: initial;
              margin-left: -15px;
            }

          }
        `
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
            quiz.areas.forEach(area => {
                let myPolygon = new ymaps.Polygon([area.polygon], {hintContent: area.title}, {});
                this.myMap.geoObjects.add(myPolygon);
            });
        });
    }

    render() {
        return html`
            <section>
                <iframe scrolling="no" frameborder="0"></iframe>
                <div class="areas">
                    ${quiz.areas.map(area => html`
                        <input type="checkbox" id="${'area_' + area.areaId}"
                               ?checked="${quiz.getState('selectedAreas', area.areaId)}"
                               onchange="app.toggleArea('${area.areaId}',this.checked)">
                        <label for="${'area_' + area.areaId}">${area.title}</label>
                    `)}
                </div>
            </section><a class="big-next-bottom-button" href="/quiz/contacts">
                Далее<span>Выбор готового решения</span>
            </a>`;
    }
});
