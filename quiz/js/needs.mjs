import {LitElement, html, css} from 'https://jspm.dev/lit-element';

window.customElements.define('quiz-needs', class extends LitElement {
    static get styles() {
        return css`
          :host {
            font-family: 'Montserrat', sans-serif;
            height: 100%;
            min-height: 100%;
            display: flex;
            flex-direction: column;
          }

          :host:after {
            //content: '';
            height: 70px;
            display: block;
            width: 100%;
          }

          section {
            background: white;
            border-radius: 15px;
            box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.06);
            padding: 30px;
            padding-bottom: 40px;
            position: sticky;
            position: -webkit-sticky;
            top: 0;
            margin-bottom: -20px;
            outline: unset;
          }

          .title {
            font-weight: 600;
            font-size: 18px;
            line-height: 26px;
            opacity: 0.3;
          }

          @media (max-width: 1439px) {

            section:last-of-type {
              padding-bottom: 100px;
            }

            section:not(:focus-within) {
              cursor: pointer;
            }

            section:not(:focus-within) > *:not(.title) {
              display: none;
            }

            section:focus-within > .title {
              opacity: initial;
            }
          }

          .buttons {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            overflow-x: auto;
            max-height: 100px;
            padding: 15px;
            margin: 0 -30px;
          }

          .mini-buttons {
            display: flex;
            flex-wrap: wrap;
            margin-left: -10px;
            padding: 10px 0;
          }

          .buttons:after {
            content: '';
            min-width: 30px;
            min-height: 50px;
          }

          .buttons input[type="radio"],
          .mini-buttons input[type="radio"] {
            display: none;
          }

          .buttons label {
            border: 1px solid rgba(0, 0, 0, 0.1);
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            padding: 25px 20px;
            display: inline-block;
            margin-left: 15px;
            min-width: 100px;
            max-width: 130px;
            cursor: pointer;
          }

          .mini-buttons label {
            border: 1px solid rgba(0, 0, 0, 0.12);
            border-radius: 100px;
            padding: 8px 40px;
            margin-left: 10px;
            margin-bottom: 10px;
            cursor: pointer;
          }

          .buttons input[type="radio"]:checked + label,
          .mini-buttons input[type="radio"]:checked + label {
            background: #6EBC61;
            color: white;
          }

          .big-next-bottom-button {
            all: initial;
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
          }

          .range-slider {
            position: relative;
            margin-top: 15px;
            padding-bottom: 40px;
          }

          .range-slider span {
            margin: 15px 0;
          }

          .range-slider input {
            pointer-events: none;
            position: absolute;
            overflow: hidden;
            left: 0;
            top: 30px;
            width: 100%;
            outline: none;
            height: 18px;
            margin: 0;
            padding: 0;
          }

          .range-slider input::-webkit-slider-thumb {
            pointer-events: all;
            position: relative;
            z-index: 1;
            outline: 0;
          }

          .range-slider input::-moz-range-thumb {
            pointer-events: all;
            position: relative;
            z-index: 10;
            -moz-appearance: none;
            width: 9px;
          }

          .range-slider input::-moz-range-track {
            position: relative;
            z-index: -1;
            background-color: rgba(0, 0, 0, 1);
            border: 0;
          }

          .range-slider input:last-of-type::-moz-range-track {
            -moz-appearance: none;
            background: none transparent;
            border: 0;
          }

          .range-slider input[type=range]::-moz-focus-outer {
            border: 0;
          }

          .counters {
            margin-top: 15px;
          }

          .counters > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 15px 0;
          }

          .counters > div > div {
            display: flex;
          }

          .counters > div > div > button {
            all: initial;
            border: 1.5px solid rgba(0, 0, 0, 0.2);
            border-radius: 50%;
            color: #C4C4C4;
            width: 35px;
            height: 35px;
            text-align: center;
            font-size: 30px;
            line-height: 35px;
            cursor: pointer;
          }

          .counters > div > div > input[type="number"] {
            -webkit-appearance: initial;
            border: initial;
            font-size: 18px;
            font-weight: 500;
            margin: 0 10px;
          }

          @media (min-width: 1440px) {
            :host {
              border-radius: 6px;
              background: white;
              display: block;
              position: relative;
              box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
              padding: initial;
              height: auto;
              min-height: initial;
            }

            section {
              position: initial;
              border-radius: initial;
              background: initial;
              padding: 15px 30px;
              margin: initial;
              box-shadow: initial;
              border-bottom: 1px solid rgba(0, 0, 0, 0.05);
              display: flex;
              align-items: center;
              justify-content: space-between;
            }

            section > *:last-child {
              flex: 1;
              max-width: 600px;
            }

            .big-next-bottom-button {
              border-radius: 100px;
              width: 337px;
              left: initial;
              right: initial;
              bottom: 30px;
              position: fixed;
              font-size: 20px;
            }

          }
        `;
    }

    render() {
        return html`
            <section class="active" tabindex="1">
                <span class="title">Какой дом вы бы хотели построить?</span>
                <div class="buttons">
                    <input type="radio" id="test1" name="home"><label for="test1">Типовой проект</label>
                    <input type="radio" id="test2" name="home"><label for="test2">Спроектируйте мне дом с нуля</label>
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
                    <span>от 1 800 000 до 100 000 000</span>
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
            <button class="big-next-bottom-button">Далее</button>
        `;
    }
});
