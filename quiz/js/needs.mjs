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

          @media (max-width: 1023px) {

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
            font-family: 'Open Sans', sans-serif;
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
            font-family: 'Montserrat', sans-serif;
            border: 1px solid rgba(0, 0, 0, 0.12);
            border-radius: 100px;
            padding: 8px 40px;
            margin-left: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            font-weight: 600;
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
          }

          .range-slider {
            position: relative;
            margin-top: 15px;
            padding-bottom: 80px;
          }

          .range-slider .money {
            font-family: 'Open Sans', sans-serif;
            font-size: 15px;
            color: rgba(0, 0, 0, .3);
          }

          .range-slider .money span {
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            color: black;
            margin-left: 10px;
            margin-right: 25px;
          }

          .range-slider input {
            pointer-events: none;
            position: absolute;
            left: 0;
            width: 100%;
            outline: none;
            height: 18px;
            margin: 0;
            padding: 0;
            top: 40px;
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

          input[type=range] {
            width: 100%;
            margin: 9.5px 0;
            background-color: transparent;
            -webkit-appearance: none;
          }

          input[type=range]:focus {
            outline: none;
          }

          input[type=range]::-webkit-slider-runnable-track {
            background: rgba(242, 242, 242, 0.78);
            border: 0;
            border-radius: 10px;
            width: 100%;
            height: 10px;
            cursor: pointer;
          }

          input[type=range]::-webkit-slider-thumb {
            margin-top: -9.5px;
            width: 29px;
            height: 29px;
            background: #ffffff;
            border: 2px solid #6ebc61;
            border-radius: 28px;
            cursor: pointer;
            -webkit-appearance: none;
          }

          input[type=range]:focus::-webkit-slider-runnable-track {
            background: #ffffff;
          }

          input[type=range]::-moz-range-track {
            background: rgba(242, 242, 242, 0.78);
            border: 0;
            border-radius: 10px;
            width: 100%;
            height: 10px;
            cursor: pointer;
          }

          input[type=range]::-moz-range-thumb {
            width: 29px;
            height: 29px;
            background: #ffffff;
            border: 2px solid #6ebc61;
            border-radius: 28px;
            cursor: pointer;
          }

          input[type=range]::-ms-track {
            background: transparent;
            border-color: transparent;
            border-width: 9.5px 0;
            color: transparent;
            width: 100%;
            height: 10px;
            cursor: pointer;
          }

          input[type=range]::-ms-fill-lower {
            background: #e5e5e5;
            border: 0;
            border-radius: 20px;
          }

          input[type=range]::-ms-fill-upper {
            background: rgba(242, 242, 242, 0.78);
            border: 0;
            border-radius: 20px;
          }

          input[type=range]::-ms-thumb {
            width: 29px;
            height: 29px;
            background: #ffffff;
            border: 2px solid #6ebc61;
            border-radius: 28px;
            cursor: pointer;
            margin-top: 0px;
            /*Needed to keep the Edge thumb centred*/
          }

          input[type=range]:focus::-ms-fill-lower {
            background: rgba(242, 242, 242, 0.78);
          }

          input[type=range]:focus::-ms-fill-upper {
            background: #ffffff;
          }

          /*TODO: Use one of the selectors from https://stackoverflow.com/a/20541859/7077589 and figure out
          how to remove the virtical space around the range input in IE*/
          @supports (-ms-ime-align:auto) {
            /* Pre-Chromium Edge only styles, selector taken from hhttps://stackoverflow.com/a/32202953/7077589 */
            input[type=range] {
              margin: 0;
              /*Edge starts the margin from the thumb, not the track as other browsers do*/
            }
          }

          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          input[type=number] {
            -moz-appearance: textfield;
            text-align: center;
          }

          .counters {
            font-family: 'Open Sans', sans-serif;
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
            font-family: Helvetica, sans-serif;
            -webkit-appearance: initial;
            border: initial;
            font-size: 18px;
            font-weight: 500;
            margin: 0 10px;
          }

          @media (min-width: 1024px) {
            :host {
              border-radius: 6px;
              background: white;
              display: block;
              position: relative;
              box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
              padding: initial;
              height: auto;
              min-height: initial;
              margin-bottom: 100px;
            }

            section {
              position: initial;
              border-radius: initial;
              background: initial;
              padding: 15px 30px;
              padding-left: 50px;
              margin: initial;
              box-shadow: initial;
              border-bottom: 1px solid rgba(0, 0, 0, 0.05);
              display: flex;
              align-items: center;
              justify-content: space-between;
            }

            section > .title {
              opacity: initial;
            }

            section > *:first-child {
              max-width: 350px;
              display: block;
            }

            section > *:last-child {
              flex: 1;
              max-width: 550px;
            }

            .buttons {
              flex-direction: row;
              flex-wrap: initial;
            }

            .buttons label:first-of-type {
              margin-left: initial
            }

            .range-slider {
              padding: unset;
              max-width: 530px;
              padding-bottom: 60px;
            }

            .counters {
              display: flex;
              justify-content: space-between;
            }

            .counters label {
              margin-right: 60px;
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
});
