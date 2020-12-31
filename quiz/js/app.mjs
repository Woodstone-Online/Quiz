import quiz from './quiz.mjs'
import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import './menu.mjs';
import './needs.mjs';
// import './location.mjs';

window.customElements.define('quiz-app', class extends LitElement {

    stages = {
        needs: html`
            <quiz-needs></quiz-needs>`
    }

    static get styles() {
        return css`
          :host {
            flex-direction: column;
            background: #F2F4F6;
            max-height: 100vh;
            max-width: 100vw;
            display: flex;
            height: 100%;
            width: 100%;
          }

          main {
            display: initial;
            flex: 1;
            max-height: 100%;
            overflow-y: scroll;
            padding-top: 15px;
            margin-top: -15px;
          }

          @media (min-width: 1024px) {
            main {
              padding: 0 30px;
              padding-bottom: 30px;
              margin: initial;
            }
          }

          @media (min-width: 1364px) {
            :host {
              flex-direction: row;
              justify-content: space-between;
              background: #F5F6F8;
            }

            quiz-menu {
              flex-grow: 1;
            }

            main {
              max-width: 1024px;
              min-width: 1024px;
              width: 1024px;
              margin: initial;
              padding: 30px;
            }
          }
        `;
    }

    get stage() {
        return this.stages.needs;
    }

    firstUpdated() {
        quiz.initRouter(this.shadowRoot.querySelector('main'));
    }

    render() {
        return html`
            <quiz-menu></quiz-menu>
            <main>

            </main>
        `;
    }
});
