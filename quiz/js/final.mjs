import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import quiz, {loadStyles} from "./quiz.mjs";

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
                    <a href=""><img src="/quiz/img/instagram.svg">Наш инстаграм с отзывами клиентов и новостями</a>
                    <a href=""><img src="/quiz/img/yt.svg">YouTube канал с процессами строительства</a>
                    <a href=""><img src="/quiz/img/like.svg">Видеоотзывы наших клиентов</a>
                </nav>
            `;
        }
    }))
