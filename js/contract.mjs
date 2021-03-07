import quiz, {LitElement, html, css, loadStyles} from "./quiz.mjs";

loadStyles(import.meta.url).then(styles =>
    window.customElements.define('quiz-contract', class extends LitElement {
        static get styles() {
            return css([styles]);
        }

        render() {
            return html`
                <section class="intro">
                    <h1>Возьмем все заботы по созданию вашей мечты на себя</h1>
                    <ul class="tasks">
                        <li>Проектирование</li>
                        <li>Оформим документы</li>
                        <li>Стройку</li>
                        <li>Страхование</li>
                    </ul>
                    <ul class="conditions">
                        <li><img src="/img/1.cover.contract.svg">Личный менеджер на всех этапах</li>
                        <li><img src="/img/2.cover.contract.svg">Для старта нужно всего 10%</li>
                    </ul>
                    <img class="intro-cover" src="/img/cover.intro.contract.png">
                </section>
                <h2>Как устроен процесс</h2>
                <section class="card process">
                    <input data-label="Согласование" name="stage" type="radio" checked>
                    <input data-label="Подготовка участка" name="stage" type="radio">
                    <input data-label="Создание основы дома" name="stage" type="radio">
                    <input data-label="Инженерные коммуникации" name="stage" type="radio">
                    <input data-label="Отделка" name="stage" type="radio">
                    <input data-label="Подготовка обьекта к сдаче" name="stage" type="radio">
                    <input data-label="Сдача обьекта" name="stage" type="radio">
                    <div class="stages-content">
                        <article>
                            <img src="/img/1.process.contract.png">
                            <div class="details">
                                <p>Согласовываем с вами все предварительные вопросы, касательно будещего дома</p>
                                <ul>
                                    <li>детально обсуждаем смету</li>
                                    <li>устанавливаем сроки сдачи объекта</li>
                                    <li>клиент получает полный пакет документов и детализированную смету</li>
                                </ul>
                                <p>При этом Вы экономите от 35 000 рублей на создании проекта дома</p>
                            </div>
                        </article>
                        <article>
                            <img src="/img/1.process.contract.png">
                            <div class="details">
                                <p>Подготовка участка</p>
                                <ul>
                                    <li>проводим тщательное геологическое исследование грунта</li>
                                    <li>доставка строительных материалов и организация строительной площадки</li>
                                    <li>очистка участка от растений</li>
                                </ul>
                                <p>Приступаем к строительству дома!</p>
                            </div>
                        </article>
                        <article>
                            <img src="/img/1.process.contract.png">
                            <div class="details">
                                <p>Создание основы дома</p>
                                <ul>
                                    <li>заливка фундамента</li>
                                    <li>строительство стен будущего дома</li>
                                    <li>монтаж и укладка кровли</li>
                                    <li>вставляем окна и двери</li>
                                </ul>
                            </div>
                        </article>
                        <article>
                            <img src="/img/1.process.contract.png">
                            <div class="details">
                                <p>Инженерные коммуникации</p>
                                <ul>
                                    <li>закладка сети электропитания</li>
                                    <li>подключение систему отопления</li>
                                    <li>подведение канализации</li>
                                </ul>
                                <p>Подключены все коммуникации нужные для проживания в доме</p>
                            </div>
                        </article>
                        <article>
                            <img src="/img/1.process.contract.png">
                            <div class="details">
                                <p>Отделка объекта</p>
                                <ul>
                                    <li>закупка материалов и доставка на объект</li>
                                    <li>производим внешнюю отделку фасада дома</li>
                                    <li>работы по внутренней отделке</li>
                                </ul>
                                <p>На этом этапе дом готов под финишную отделку</p>
                            </div>
                        </article>
                        <article>
                            <img src="/img/1.process.contract.png">
                            <div class="details">
                                <p>Подготовка объекта к сдаче</p>
                                <ul>
                                    <li>производим уборку внутри дома</li>
                                    <li>уборка участка от строительного мусора и его вывоз</li>
                                    <li>вывоз объектов строительной площадки и строительной техники</li>
                                </ul>
                            </div>
                        </article>
                        <article>
                            <img src="/img/1.process.contract.png">
                            <div class="details">
                                <p>Сдача дома</p>
                                <ul>
                                    <li>финальный осмотр объекта</li>
                                    <li>подписание актов выполненных работ</li>
                                    <li>вы принимаете объект, готовый под финишную отделку</li>
                                </ul>
                            </div>
                        </article>
                    </div>
                </section>
                <section class="card offer">
                    <h3>Проектирование в подарок</h3>
                    <p>целая команда из дизайнеров и архитекторов ждет, чтобы начать работу над вашим проектом</p>
                    <a href="#contacts" class="button"
                       @click="${() => quiz.setAnswer('interest', null, 9) && (quiz.contactSubject = 'Design')}">
                        Оставить заявку
                    </a>
                </section>
                <h2><span>Отзыв</span> счастливого владельца дома</h2>
                <iframe class="video" height="auto" src="https://www.youtube.com/embed/-PvLnOFiFLU?controls=0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        frameborder="0" allowfullscreen></iframe>
                <h2>Строим более <span>10 лет</span> и построили <span>160 объектов</span></h2>
                <section class="image-slider">
                    <div class="slides">
                        <div>
                            <img src="https://core.woodstone.online/static/d0bb87cf-1de5-430f-81da-de09ae909d61.1.png">
                        </div>
                        <div>
                            <img src="https://core.woodstone.online/static/01439374-4c31-4685-8bc8-9ffa9057e08c.2.png">
                        </div>
                        <div>
                            <img src="https://core.woodstone.online/static/6810fd0b-1e1b-468c-8c62-370515aab1d8.3.png">
                        </div>
                        <div>
                            <img src="https://core.woodstone.online/static/5397da91-c214-45d8-973a-bac6bda52b63.4.png">
                        </div>
                        <div>
                            <img src="https://core.woodstone.online/static/56829dca-3b55-43e1-bf9e-854a36fbb8f0.5.png">
                        </div>
                        <div>
                            <img src="https://core.woodstone.online/static/e7126e63-aedd-487d-aa16-26543b72e9a1.6.png">
                        </div>
                        <div>
                            <img src="https://core.woodstone.online/static/f95faba1-4d05-4481-851e-f1a48e52c2dc.7.png">
                        </div>
                        <div>
                            <img src="https://core.woodstone.online/static/d0101386-7b00-49d4-bbb1-4333bef1a888.8.png">
                        </div>
                    </div>
                </section>
                <h2><span>Ответы</span> на вопросы</h2>
                <details>
                    <summary>
                        Выезжают ли ваши специалисты на участок до заключения договора или все встречи проходят только в
                        офисе?
                    </summary>
                    <p>
                        Да, мы организуем выезд инженера и архитектора на участок еще до заключения договора. Если вы
                        выберете типовой проект, то наши специалисты смогут выполнить адаптировать его под участок.
                        Также возможно будет измерить перепад участка, дать консультацию по организации подъездных
                        путей, ориентированию дома по сторонам света и многое другое. Вместе с тем мы приглашаем
                        посетить наш выставочный дом, чтобы убедиться в качестве материалов и добросовестности домов.
                    </p>
                </details>
                <details>
                    <summary>Где я могу посмотреть готовые и строящиеся дома Woodstone?</summary>
                    <p>
                        Свяжитесь с нашим офисом, и менеджер покажет объекты. Так же всех желающих мы приглашаем
                        посетить выставочный дом, расположенный в коттеджном поселке «Клевер».
                    </p>
                </details>
                <details>
                    <summary>
                        Расскажите об этапах оплаты услуг. Я должен сразу оплатить всю цену, указанную на сайте?
                    </summary>
                    <p>
                        Как правило, оплата по договору происходит в три этапа: Фундамент — до начала строительства,
                        Стеновой комплект — до его производства, заключительный этап — Кровля и Окна. Мы гарантируем,
                        что цена, прописанная в договоре, не вырастет на протяжении всего срока работ.
                    </p>
                </details>
                <details>
                    <summary>Какие системы слежения за стройкой, помимо фотоотчетов, еще есть?</summary>
                    <p>
                        Клиент может заказать у нас приобретение и установку видеокамеры на объекте, трансляция с
                        которой ведется в режиме онлайн в личном кабинете. При этом оборудование передается в
                        собственность клиента. После окончания строительства заказчик может оставить камеру себе, чтобы
                        использовать как облегченную систему видеонаблюдения за участком и домом на протяжении
                        неограниченного времени, или же мы выкупим ее по остаточной цене.
                    </p>
                </details>
                <details>
                    <summary>Подскажите, вы можете помочь с документами для разрешения на строительство?</summary>
                    <p>
                        Для наших заказчиков специалисты корпорации оказывают полный комплекс услуг, связанных с
                        оформлением разрешения на строительство. Вы можете обратиться к нам для получения всего
                        комплекса работ от проектирования загородного дома до его внутренней отделки и покраски.
                    </p>
                </details>
                <details>
                    <summary>
                        Какой гарантийный срок дома?
                    </summary>
                    <p>
                        Мы предоставляем гарантию на наши дома до 5 лет
                    </p>
                </details>
                <section class="navigation-buttons">
                    <quiz-next-stage stage="contract"
                                     @click="${() => quiz.setAnswer('interest', null, 3) && (quiz.contactSubject = 'Offer')}"></quiz-next-stage>
                </section>
            `;
        }
    }))
