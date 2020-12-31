import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import quiz from "./quiz.mjs";

window.customElements.define('quiz-contacts', class extends LitElement {
    static get styles() {
        return css`
          :host {
            font-family: 'Montserrat', sans-serif;

            display: block;
            height: calc(100% - 70px);
            margin-bottom: 70px;
          }

          section {
            position: relative;
            //box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.06);
            height: 100%;
            overflow-y: scroll;
            //display: flex;
            //flex-direction: column;
            //justify-content: space-between;
          }

          section .header {
            position: sticky;
            top: 0;
            display: flex;
            flex-direction: column;
            padding: 15px;
            padding-bottom: 0;
          }

          section .header h1 {
            font-size: 32px;
            line-height: 26px;
            margin: unset;
          }

          section .header span {
            font-weight: 600;
            font-size: 14px;
            line-height: 26px;
            margin-top: 30px;
          }

          .communications {
            //position: absolute;
            //left: 0;
            //right: 0;
            //bottom: 0;
            display: flex;

            flex-wrap: wrap;
            flex-direction: column;
            overflow-x: auto;
            max-height: 50px;
            //padding: 15px;
            margin: 15px -15px;
            margin-bottom: 0;
            scroll-snap-type: x mandatory;
          }

          .communications:after {
            content: '';
            min-width: 15px;
            min-height: 50px;
          }

          .communications input[type="checkbox"] {
            display: none;
          }

          .communications label {
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

          .communications label:first-of-type {
            margin-left: 15px;
          }

          .communications label:before {
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

          .communications input[type="checkbox"]:checked + label:before {
            background: #6EBC61;
          }

          .big-next-bottom-button {
            box-sizing: border-box !important;
            -webkit-appearance: none;
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
            border: unset;
          }

          section form {
            position: relative;
            z-index: 1;
            bottom: 0;
            padding: 30px;
            background: white;
            border-radius: 15px;

          }

          form h2 {
            font-weight: 600;
            font-size: 22px;
            line-height: 26px;
            margin: 0;
            margin-bottom: 15px;
          }

          form h2 span {
            color: #6EBC61;
          }

          form input {
            -webkit-appearance: unset;
            border: 0;
            margin: 15px 0;
            width: calc(100% - 30px);
            background: rgba(196, 196, 196, .2);
            border-radius: 7px;
            font-size: 18px;
            line-height: 30px;
            color: black;
            padding: 15px;
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
            section form {
              border-bottom-left-radius: 0;
              border-bottom-right-radius: 0;
            }
          }

          @media (min-width: 1024px) {
            :host {
              //height: calc(100% - 130px);
              //border-radius: 15px;
              //background: white;
              //padding: 15px;
              height: 100%;
              margin: unset;
            }

            section {
              //box-shadow: initial;
              max-width: 643px;
            }

            form {
              margin-top: 15px;
            }

            .big-next-bottom-button {
              position: static;
              border-radius: 100px;
              width: 337px;
              margin-top: 70px;
              //left: 30px;
              right: initial;
              //bottom: 30px;
              //position: fixed;
              font-size: 20px;
            }
          }

          @media (min-width: 1364px) {
            .big-next-bottom-button {
              left: initial;
            }

          }
        `
    }

    render() {
        return html`
            <section>
                <div class="header">
                    <h1>Заявка</h1>
                    <span>Предпочтения для связи</span>
                    <div class="communications">
                        <input type="checkbox" id="whathsapp"><label for="whathsapp">Whats App</label>
                        <input type="checkbox" id="phone"><label for="phone">Телефон</label>
                        <input type="checkbox" id="email"><label for="email">Email</label>
                    </div>
                </div>
                <form>
                    <h2>Мы свяжемся с вами в течении <span>14 минут</span></h2>
                    <input type="tel" placeholder="+7" .value="${quiz.getState('profile', 'phone', '')}"
                           onchange="app.updateProfile('phone',this.value)">
                    <input type="text" placeholder="Ваше имя" .value="${quiz.getState('profile', 'name', '')}"
                           onchange="app.updateProfile('name',this.value)">
                    <input type="email" placeholder="E-mail" .value="${quiz.getState('profile', 'email', '')}"
                           onchange="app.updateProfile('email',this.value)">
                    <button class="big-next-bottom-button" @click="${quiz.createUser.bind(quiz)}">Оставить заявку
                    </button>
                </form>
            </section>`;
    }
});