import {LitElement, html, css} from 'https://jspm.dev/lit-element';
import {classMap} from "https://jspm.dev/lit-html/directives/class-map";
import {styleMap} from "https://jspm.dev/lit-html/directives/style-map";
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
            this.selectedHome = quiz.getState('selectedHome');
            this.maxPrice = quiz.getAnswer('budget', 'to');
        }

        static get properties() {
            return {
                selectedHome: {attribute: false}
            }
        }

        selectHome(homeIndex = typeof this.home.activeSlideIndex == "number" ? this.home.activeSlideIndex : null) {
            if (typeof homeIndex != "number" || !quiz.homes[homeIndex]) return;
            const home = quiz.homes[homeIndex];
            quiz.selectHome(home.homeId);
            this.selectedHome = home.homeId;
        }

        nextSlide(target) {
            if (!target.activeSlide || !target.activeSlide.nextElementSibling) return;
            this.setActiveSlide(target, target.activeSlide.nextElementSibling);
            return this.skipScrollHandling(target) && target.activeSlide.scrollIntoView({
                inline: "center",
                behavior: "smooth",
                block: 'nearest'
            })
        }

        prevSlide(target) {
            if (!target.activeSlide || !target.activeSlide.previousElementSibling) return;
            this.setActiveSlide(target, target.activeSlide.previousElementSibling);
            return this.skipScrollHandling(target) && target.activeSlide.scrollIntoView({
                inline: "center",
                behavior: "smooth",
                block: 'nearest'
            })
        }

        setSlide(target, index = 0, resetScroll) {
            if (!target.slides || !target.slides[index]) return;
            this.setActiveSlide(target, target.slides[index]);
            this.skipScrollHandling(target);
            if (resetScroll) target.slider.scrollTo(0, 0); else target.activeSlide.scrollIntoView({
                inline: "center",
                behavior: "smooth",
                block: 'nearest'
            });
            return index;
        }

        async performUpdate() {
            if (this.selectedHome && quiz.home[this.selectedHome] && !quiz.home[this.selectedHome].dataLoaded)
                await quiz.loadHomeData(quiz.home[this.selectedHome]);
            super.performUpdate();
        }

        firstUpdated() {
            this.initSlider(this.home, '.home-slider', '.homes-navigation');
            if (this.selectedHome) this.setSlide(this.home, quiz.homes.findIndex(home => home.homeId === this.selectedHome))
        }

        updated() {
            if (this.images.slider) this.destroySlider(this.images);
            if (!this.selectedHome) this.setSlide(this.home, undefined, true);
            if (this.selectedHome && quiz.home[this.selectedHome] && quiz.home[this.selectedHome].images) {
                this.initSlider(this.images, '.image-slider .slides');
                this.setSlide(this.images, undefined, true);
            }
        }

        initSlider(target, sliderSelector, indicatorSelector) {
            if (indicatorSelector) target.indicators = Array.from(this.shadowRoot.querySelector(indicatorSelector).children);
            target.slider = this.shadowRoot.querySelector(sliderSelector);
            if (!target.slider) return;
            target.slides = Array.from(target.slider.children);
            target.observer = new IntersectionObserver(this.sliderScrollHandler.bind(this, target), {
                root: target.slider,
                threshold: 1
            });
            return target.slides.forEach(slide => target.observer.observe(slide));
        }

        destroySlider(target) {
            if (!target || !target.observer) return target;
            target.observer.disconnect();
            delete target.slider;
            delete target.slides;
            delete target.observer;
            delete target.indicators;
            delete target.activeSlide;
            delete target.activeSlideIndex;
            return target;
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

        render() {
            return html`
                <section class="navigation-buttons">
                    <div>
                        <quiz-next-stage stage="home" class="vertical"></quiz-next-stage>
                        <a href="#contacts" class="button">Пропустить шаг</a>
                    </div>
                    <a href="#contacts" class="button alternate"
                       @click="${() => quiz.setAnswer('interest', null, 4) && (quiz.contactSubject = 'Viewing')}">
                        Записаться на просмотр
                    </a>
                </section>
                <section id="summary" class=${classMap({selected: this.selectedHome})}
                         style=${styleMap(this.selectedHome ? {'background-image': quiz.home[this.selectedHome].image ? `url("${quiz.home[this.selectedHome].image.url}")` : 'none'} : {})}>
                    <span class="title">Проекты типовых домов</span>
                    <div class="head-line">
                        <div class="homes-navigation">
                            ${quiz.homes.map((home, i) => this.maxPrice && this.maxPrice < home.price ? html`
                                <button @click="${() => this.selectedHome ? this.selectHome(this.setSlide(this.home, i)) : this.setSlide(this.home, i)}"
                                        data-delta="${this.numberFormat.format(home.price - this.maxPrice)}">
                                    ${home.title}
                                </button>` : html`
                                <button @click="${() => this.selectedHome ? this.selectHome(this.setSlide(this.home, i)) : this.setSlide(this.home, i)}">
                                    ${home.title}
                                </button>`)}
                        </div>
                        <a class="get-pdf" href="#contacts"
                           @click="${() => quiz.setAnswer('interest', null, 5) && (quiz.contactSubject = 'WhatsApp')}">
                            Скачать в PDF
                        </a>
                    </div>
                    <div class="home-slider">
                        ${quiz.homes.map((home, i) => html`
                            <div class="slider-item"
                                 @click="${() => this.setSlide(this.home, i)}"
                                 style=${styleMap({'background-image': home.image ? `url("${home.image.url}")` : 'none'})}>
                                <div class="price">${this.numberFormat.format(home.price)}</div>
                            </div>`)}
                    </div>
                    <div class="bottom-line">
                        <div class="slider-navigation">
                            <button @click="${this.prevSlide.bind(this, this.home)}"><</button>
                            <button @click="${this.nextSlide.bind(this, this.home)}">></button>
                        </div>
                        <div class="buttons-section">
                            <button class="button primary" @click="${() => this.selectHome()}">Подробнее</button>
                            <a class="button" href="#contacts"
                               @click="${() => quiz.setAnswer('interest', null, 4) && (quiz.contactSubject = 'Viewing')}">Посмотреть
                                готовый дом</a>
                        </div>
                    </div>
                    <div class="home-cover">
                        <h1 class="title">Типовой дом со всеми удобствами</h1>
                        <div class="home-price">
                            ${this.selectedHome ? this.numberFormat.format(quiz.home[this.selectedHome].price) : ''}
                        </div>
                        <div class="inviteToScroll">Прокрутите вниз и узнайте больше об этом доме</div>
                    </div>
                </section>
                <section id="details">
                    <h2 class="title">Что входит в дом</h2>
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
                    ${this.selectedHome ? html`
                        <div class="description">
                            Продуманный до мелочей — альтернатива квартире. Каждый проект может быть адаптирован под ваш
                            участок и ваши условия. Выберите дом и адаптируйте планировку под себя.
                        </div>
                        <div id="view" class="card">
                            <span class="title">Запишитесь на просмотр своего будущего дома</span>
                            <span class="description">так вы сможете оценить качество материалов и отделки а также осмотреть район и пообщаться с соседями</span>
                            <a href="#contacts" class="button"
                               @click="${() => quiz.setAnswer('interest', null, 4) && (quiz.contactSubject = 'Viewing')}">Записаться</a>
                        </div>
                        ${quiz.home[this.selectedHome].images ? html`
                            <div class="image-slider">
                                <h2 class="title">Галлерея</h2>
                                <div class="slides">
                                    ${quiz.home[this.selectedHome].images.map((image, i) => html`
                                        <div @click="${() => this.setSlide(this.images, i)}" tabindex="0">
                                            <img src="${image.url}">
                                        </div>`)}
                                </div>
                                <div class="slider-navigation">
                                    <button @click="${this.prevSlide.bind(this, this.images)}"><</button>
                                    <button @click="${this.nextSlide.bind(this, this.images)}">></button>
                                </div>
                            </div>` : null}
                        ${quiz.home[this.selectedHome].plan ? html`
                            <div class="card image-full-width">
                                <h2 class="title">Чертеж</h2>
                                <img src="${quiz.home[this.selectedHome].plan.url}" style="margin-bottom: 0">
                            </div>` : null}
                        <div class="card">
                            <h2 class="title">Фундамент</h2>
                            <p>Используем 2 варианта в зависимости от результатов геологии на участке:</p>
                            <details open>
                                <summary>1 - Свайно-ростверковый фундамент</summary>
                                <p>
                                    способствует повышению устойчивости конструкции, обеспечивая опору на глубоко
                                    залегающие
                                    почвенные слои. Основным элементом основания служат сваи, заглубляемые в грунт и
                                    подвергаемые армированию, способствующему улучшению морозостойкости и увеличению
                                    прочности на изгиб.
                                </p>
                            </details>
                            <details>
                                <summary>2 - Плитный фундамент с ребрами жесткости</summary>
                                <p>
                                    способствует повышению устойчивости конструкции, обеспечивая опору на глубоко
                                    залегающие
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
                            <input type="radio" name="plan" id="basePlan" checked>
                            <label for="basePlan" class="item active">
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
                                    <li class="excluded">Мебельная планировка с артикулами товаров и названием
                                        магазина
                                    </li>
                                </ul>
                                <div class="summary">
                                    <span>${this.numberFormat.format(quiz.home[this.selectedHome].price)}</span>
                                    <!--<button>Выбрать пакет</button>-->
                                </div>
                            </label>
                            <input type="radio" name="plan" id="overhaulPlan">
                            <label for="overhaulPlan" class="item">
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
                                    <span>${this.numberFormat.format(quiz.home[this.selectedHome].totalPrice)}</span>
                                    <!--<button>Выбрать пакет</button>-->
                                </div>
                            </label>
                        </div>` : ''}
                </section>`;
        }


    }))
