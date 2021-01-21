import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import {loadStyles} from "./quiz.mjs";

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-final', class extends LitElement {
        static get styles() {
            return css([styles]);
        }

        render() {
            return html`
                <h1>Заявка принята, мы свяжемся с вами в течении <span>14 минут</span></h1>
                <p>Пока вы можете ознакомиться с материалами о нашей компании</p>
                <nav>
                    <a href="https://www.instagram.com/woodstone_ekb/" target="_blank">
                        <img src="/img/instagram.svg">Наш инстаграм с отзывами и новостями
                    </a>
                    <a href="https://www.facebook.com/woodstoneekb/" target="_blank">
                        <img src="/img/yt.svg">Facebook с примерами нетиповых проектов
                    </a>
                    <a href="https://youtu.be/-PvLnOFiFLU" target="_blank">
                        <img src="/img/like.svg">Видеоотзывы наших клиентов
                    </a>
                </nav>
            `;
        }
    }))
