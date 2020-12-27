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
          }

          aside {
            height: 60px;
          }

          nav {
            display: flex;
            overflow-x: scroll;
          }

          nav > a {
            color: inherit;
            text-decoration: inherit;
            opacity: .2;
            padding: 20px;
            font-weight: 600;
            font-size: 12px;
          }

          nav > a.active {
            opacity: initial;
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
                    <a href="" class="active">Потребности</a>
                    <a href="">Направления</a>
                    <a href="">Дом</a>
                    <a href="">Условия</a>
                </nav>
            </aside>
        `;
    }
});
