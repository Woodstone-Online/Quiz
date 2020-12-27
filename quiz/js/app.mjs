import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import './menu.mjs';
import './needs.mjs';

window.customElements.define('quiz-app', class extends LitElement {
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

          @media (min-width: 1440px) {
            :host {
              flex-direction: row;
              justify-content: space-between;
            }

            main {
              max-width: 1024px;
              margin: initial;
              padding: initial;
              padding: 30px;
            }
          }
        `;
    }

    render() {
        return html`
            <quiz-menu></quiz-menu>
            <main>
                <slot></slot>
            </main>
        `;
    }
});
