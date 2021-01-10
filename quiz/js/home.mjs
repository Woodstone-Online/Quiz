import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import quiz, {loadStyles} from "./quiz.mjs";

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-home', class extends LitElement {
        static get styles() {
            return css([styles]);
        }

        constructor() {
            super();
            this.home = {};
            this.images = {};
            this.numberFormat = new Intl.NumberFormat('ru-RU');
        }

        nextSlide(target) {
            if (!target.activeSlide.nextElementSibling) return;
            this.setActiveSlide(target, target.activeSlide.nextElementSibling);
            return this.skipScrollHandling(target) && target.activeSlide.scrollIntoView({
                inline: "center",
                behavior: "smooth",
                block: 'nearest'
            })
        }

        prevSlide(target) {
            if (!target.activeSlide.previousElementSibling) return;
            this.setActiveSlide(target, target.activeSlide.previousElementSibling);
            return this.skipScrollHandling(target) && target.activeSlide.scrollIntoView({
                inline: "center",
                behavior: "smooth",
                block: 'nearest'
            })
        }

        setSlide(target, index) {
            if (!target.slides[index]) return;
            this.setActiveSlide(target, target.slides[index]);
            return this.skipScrollHandling(target) && target.activeSlide.scrollIntoView({
                inline: "center",
                behavior: "smooth",
                block: 'nearest'
            })
        }

        firstUpdated() {
            this.initSlider(this.home, '.home-slider', '.homes-navigation');
            this.initSlider(this.images, '.image-slider .slides');
        }

        initSlider(target, sliderSelector, indicatorSelector) {
            if (indicatorSelector) target.indicators = Array.from(this.shadowRoot.querySelector(indicatorSelector).children);
            target.slider = this.shadowRoot.querySelector(sliderSelector);
            target.slides = Array.from(target.slider.children);
            target.observer = new IntersectionObserver(this.sliderScrollHandler.bind(this, target), {
                root: target.slider,
                threshold: 1
            });
            return target.slides.forEach(slide => target.observer.observe(slide));
        }

        sliderScrollHandler(target, entries, observer) {
            if (!entries[0].isIntersecting || target.skipHandling) return;
            return this.setActiveSlide(target, entries[0].target);
        }

        setActiveSlide(target, slide) {
            target.slides.forEach(s => s.classList.toggle('active', false));
            slide.classList.toggle('active', true);
            target.activeSlideIndex = target.slides.findIndex(item => item === slide);
            if (target.indicators) {
                target.indicators.forEach(i => i.classList.toggle('active', false));
                target.indicators[target.activeSlideIndex].classList.toggle('active', true);
                // clearTimeout(target.indicatorScrollTimeout);
                /*target.indicatorScrollTimeout = setTimeout(() => */
                target.indicators[target.activeSlideIndex].scrollIntoView({
                    inline: "center",
                    // behavior: "smooth",
                    block: 'nearest'
                })/*, 1000)*/
            }
            return target.activeSlide = slide
        }

        skipScrollHandling(target, time = 1000) {
            clearTimeout(target.skipHandling);
            return target.skipHandling = setTimeout(() => target.skipHandling = false, time)
        }

        renderHomeSlider() {

        }

        render() {
            return html`
                <section class="navigation-buttons">
                    <div>
                        <a href="#contacts" class="button primary">Далее<span>Выбор готового решения</span></a>
                        <a href="#contacts" class="button">Пропустить шаг</a>
                    </div>
                    <a href="#contacts" class="button alternate">Записаться на просмотр</a>
                </section>
                <section id="summary">
                    <span class="title">Проекты типовых домов</span>
                    <div class="head-line">
                        <div class="homes-navigation">
                            ${quiz.homes.map((home, i) => html`
                                <button @click="${this.setSlide.bind(this, this.home, i)}">
                                    ${home.title}
                                </button>`)}
                        </div>
                        <a class="get-pdf" href="">Скачать в PDF</a>
                    </div>
                    <div class="home-slider">
                        ${quiz.homes.map((home, i) => html`
                            <div class="slider-item toggle-image-viewer"
                                 @click="${this.setSlide.bind(this, this.home, i)}"
                                 style="background-image: url(${home.image ? home.image.url : ''})">
                                <div class="price">${this.numberFormat.format(home.price)}</div>
                            </div>`)}
                    </div>
                    <div class="bottom-line">
                        <div class="slider-navigation">
                            <button @click="${this.prevSlide.bind(this, this.home)}"><</button>
                            <button @click="${this.nextSlide.bind(this, this.home)}">></button>
                        </div>
                        <div class="buttons-section">
                            <button class="primary">Подробнее</button>
                            <button>Посмотреть готовый дом</button>
                        </div>
                    </div>
                </section>
                <section id="details">
                    <h1 class="title">Что входит в дом</h1>
                    <div class="grid">
                        <div class="grid-item">
                            <img src="/quiz/img/1.grid.home.landing.svg"><span>Устройство фундамента</span></div>
                        <div class="grid-item">
                            <img src="/quiz/img/2.grid.home.landing.svg"><span>Стеновой комплект</span></div>
                        <div class="grid-item">
                            <img src="/quiz/img/3.grid.home.landing.svg"><span>Отделка фасадов</span>
                        </div>
                        <div class="grid-item">
                            <img src="/quiz/img/4.grid.home.landing.svg"><span>Кровельные работы</span></div>
                        <div class="grid-item wide-item"><img src="/quiz/img/5.grid.home.landing.svg">
                            <span class="title">Сопровождение строительства</span>
                            <span>Специалисты будут контролировать каждый этап строительства</span>
                        </div>
                        <div class="grid-item">
                            <img src="/quiz/img/6.grid.home.landing.svg"><span>Водосточная система</span></div>
                        <div class="grid-item">
                            <img src="/quiz/img/7.grid.home.landing.svg"><span>Окна и двери</span>
                        </div>
                    </div>
                    <div class="description">
                        Продуманный до мелочей — альтернатива квартире. Каждый проект может быть адаптирован под ваш
                        участок и ваши условия. Выберите дом и адаптируйте планировку под себя.
                    </div>
                    <div id="view" class="card">
                        <span class="title">Запишитесь на просмотр своего будущего дома</span>
                        <span class="description">так вы сможете оценить качество материалов и отделки а также осмотреть район и пообщаться с соседями</span>
                        <a href="#contacts" class="button">Записаться</a>
                    </div>
                    <div class="image-slider">
                        <h2 class="title">Галлерея</h2>
                        <div class="slides">
                            <img src="/quiz/img/1.demo.slider.home.landing.png">
                            <img src="/quiz/img/1.demo.slider.home.landing.png">
                            <img src="/quiz/img/1.demo.slider.home.landing.png">
                        </div>
                        <div class="slider-navigation">
                            <button @click="${this.prevSlide.bind(this, this.images)}"><</button>
                            <button @click="${this.nextSlide.bind(this, this.images)}">></button>
                        </div>
                    </div>
                    <div class="card image-full-width">
                        <h2 class="title">Чертеж</h2>
                        <img src="/quiz/img/1.demo.card.home.landing.png" style="margin-bottom: 0">
                    </div>
                    <div class="card">
                        <h2 class="title">Фундамент</h2>
                        <p>Используем 2 варианта в зависимости от результатов геологии на участке:</p>
                        <details open>
                            <summary>1 - Свайно-ростверковый фундамент</summary>
                            <p>
                                способствует повышению устойчивости конструкции, обеспечивая опору на глубоко залегающие
                                почвенные слои. Основным элементом основания служат сваи, заглубляемые в грунт и
                                подвергаемые армированию, способствующему улучшению морозостойкости и увеличению
                                прочности на изгиб.
                            </p>
                        </details>
                        <details>
                            <summary>2 - Плитный фундамент с ребрами жесткости</summary>
                            <p>
                                способствует повышению устойчивости конструкции, обеспечивая опору на глубоко залегающие
                                почвенные слои. Основным элементом основания служат сваи, заглубляемые в грунт и
                                подвергаемые армированию, способствующему улучшению морозостойкости и увеличению
                                прочности на изгиб.
                            </p>
                        </details>
                        <img src="/quiz/img/2.card.home.landing.png">
                    </div>
                    <div class="card">
                        <h2 class="title">Крыша</h2>
                        <p>Кровельный материал</p>
                        <span class="description">металлочерепица из нержавеющей стали толщиной 0,5 мм с 50-летней гарантией качества.</span>
                        <p>Утепление</p>
                        <span class="description">природный и долговечный базальтовый утеплитель 200 мм.</span>
                        <p>Пароизоляционная мембрана</p>
                        <span class="description">увеличиваетсрок службы утеплителя и дерявянных конструкций.</span>
                        <p>Водосточная система</p>
                        <span class="description">немецкая водосточная система DOCKE не допускает контакта стен с осадками.</span>
                        <div class="feature"><img src="/quiz/img/1.feature.home.landing.svg">
                            <span>Утеплитель 200 мм — тишина в доме.</span>
                        </div>
                        <img src="/quiz/img/3.card.home.landing.png">
                    </div>
                    <div class="card">
                        <h2 class="title">Стены и эко-фасады</h2>
                        <span class="description">Утепляем экологичными и безопасными материалами – никакого пенополистирола.</span>
                        <ol>
                            <li>Фасадная штукатурка</li>
                            <li>Грунтовка под штукатурку</li>
                            <li>Стекловолокная сетка</li>
                            <li>Грунтовка</li>
                            <li>Фасадный дюбель</li>
                            <li>Базальтовый эко-утеплитель</li>
                            <li>Грунтовка</li>
                            <li>Газоблок автоклавный</li>
                        </ol>
                        <div class="logos-section">
                            <img src="/quiz/img/1.logo.home.landing.png">
                            <img src="/quiz/img/2.logo.home.landing.png">
                            <img src="/quiz/img/3.logo.home.landing.png">
                        </div>
                        <img src="/quiz/img/4.card.home.landing.png">
                    </div>
                    <h2 class="title">Цены</h2>
                    <div class="plans">
                        <div class="item active">
                            <h3 class="title">Чистовая отделка</h3>
                            <ul>
                                <li>Фундамент</li>
                                <li>Стеновой комплект</li>
                                <li>Кровля</li>
                                <li>Окна и двери</li>
                                <li>Канализация</li>
                                <li>Отопление</li>
                                <li>Электричество</li>
                                <li>Водоснабжение</li>
                                <li>Водосточная система</li>
                                <li>Отделка фасадов</li>
                                <li class="excluded">Ремонт</li>
                                <li class="excluded">Чистовая отделка</li>
                                <li class="excluded">Мебельная планировка с артикулами товаров и названием магазина</li>
                            </ul>
                            <div class="summary">
                                <span>2 450 000 ₽</span>
                                <button>Выбрать пакет</button>
                            </div>
                        </div>
                        <div class="item">
                            <h3 class="title">Под ключ</h3>
                            <ul>
                                <li>Фундамент</li>
                                <li>Стеновой комплект</li>
                                <li>Кровля</li>
                                <li>Окна и двери</li>
                                <li>Канализация</li>
                                <li>Отопление</li>
                                <li>Электричество</li>
                                <li>Водоснабжение</li>
                                <li>Водосточная система</li>
                                <li>Отделка фасадов</li>
                                <li>Ремонт</li>
                                <li>Чистовая отделка</li>
                                <li>Мебельная планировка с артикулами товаров и названием магазина</li>
                            </ul>
                            <div class="summary">
                                <span>3 450 000 ₽</span>
                                <button>Выбрать пакет</button>
                            </div>
                        </div>
                    </div>
                </section>`;
        }
    }))
