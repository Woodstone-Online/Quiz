import {LitElement, html, css} from 'https://jspm.dev/lit-element';

window.customElements.define('quiz-menu', class extends LitElement {
    static get styles() {
        return css`
          :host {
            font-family: 'Montserrat', sans-serif;
          }

          header {
            display: block;
            height: 60px;
            background: white;
            box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.03);
          }

          header > img {
            padding: 20px;
            height: 20px;
          }

          aside {
            height: 60px;
          }

          nav {
            display: flex;
            overflow: auto;
            height: 100%;
          }

          nav > a {
            text-decoration: inherit;
            color: rgba(0, 0, 0, .2);
            padding: 20px 0;
            font-weight: 600;
            font-size: 12px;
            display: flex;
            align-items: center;
          }

          nav > a:first-of-type {
            padding-left: 20px
          }

          nav > a:last-of-type {
            padding-right: 20px
          }

          nav > a:not(:last-of-type):after {
            content: '';
            display: inline-block;
            width: 24px;
            height: 0;
            border-bottom: 1px solid #C4C5C6;
            vertical-align: middle;
            margin: 0 7px;
          }

          nav > a.active {
            color: inherit;
          }

          @media (min-width: 1024px) {
            header, aside {
              padding: 0 30px;
            }
          }

          @media (min-width: 1364px) {
            :host {
              display: flex;
              flex-direction: column;
              font-family: 'Open Sans', sans-serif;
            }

            header {
              background: initial;
              box-shadow: initial;
              padding: 30px;
            }

            header > img {
              padding: unset;
              height: 24px;
            }

            aside {
              height: 100%;
              padding: 30px;
              overflow-y: scroll;
            }

            nav {
              flex-direction: column;
              counter-reset: step;
              overflow: initial;
              border-left: 3px solid #F2F2F2;
              height: auto;
            }

            nav > a,
            nav > a:first-of-type,
            nav > a:last-of-type {
              position: relative;
              padding: 20px 0;
              font-size: 14px;
              font-weight: normal;
              counter-increment: step;
              margin-bottom: 40px;
              padding-left: 23px;
              margin-left: -3px;
              padding-bottom: unset;
              padding-top: 40px;
              color: rgba(0, 0, 0, .3);
            }

            nav > a:last-of-type {
              margin-bottom: unset;
            }

            nav > a:not(:last-of-type):after {
              content: unset;
            }

            nav > a:before {
              content: "Шаг " counter(step);
              font-family: 'Montserrat', sans-serif;
              color: #6B6B72;
              font-size: 18px;
              font-weight: 600;
              position: absolute;
              top: 0px;
            }

            nav > a.active {
              border-left: 3px solid #6EBC61;
              color: inherit;
            }

            nav > a.active:before {
              color: #6EBC61;
            }

          }
        `;
    }

    render() {
        return html`
            <header>
                <img src="img/Logo.svg" alt="Logo">
            </header>
            <aside>
                <nav>
                    <a href="/quiz/" class="active">Потребности</a>
                    <a href="">Направления</a>
                    <a href="">Дом</a>
                    <a href="">Условия</a>
                </nav>
            </aside>
        `;
    }
});
