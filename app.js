'use strict'
const modelController = (function () {

  return {
    init: () => {
      console.log('Model controller initialized');
    }
  }
})();

const viewController = (function () {

  const _app = _getElement('#root');
  const _main = _createElement('main', 'main');
  const _loader = _createElement('div', 'loader');

  // Header
  const _header = _createElement('header', 'header');
  const _logo = _createElement('h1', 'logo');
  _logo.textContent = 'Trivia Quiz';
  const _score = _createElement('div', 'header__score');
  const _par = _createElement('p');
  const _span = _createElement('span', 'js-score');
  _span.textContent = 0;
  _par.textContent = `Your score: `;

  _par.append(_span);
  _score.append(_par);
  _header.append(_logo, _score);
  _app.append(_header, _main, _loader);

  // Create Quiz Configurator
  function createQuizConfig() {

    const form = _createElement('form', 'quiz-config');
    form.id = 'quiz-config';
    form.noValidate = true;
    const formHeading = _createElement('h2', 'heading-secondary');
    formHeading.textContent = 'Customize your quiz';

    const amountGroup = _createElement('div', 'quiz-config__group');
    const amountLabel = _createElement('label', 'quiz-config__label');
    amountLabel.htmlFor = 'trivia_amount';
    amountLabel.textContent = 'Number of questions';
    const inputAmount = _createElement('input', 'quiz-config__input');
    inputAmount.type = 'number';
    inputAmount.name = 'amount';
    inputAmount.id = 'trivia_amount';
    inputAmount.min = 1;
    inputAmount.max = 50;
    inputAmount.value = 10;
    amountGroup.append(amountLabel, inputAmount);

    const triviaCategories = [
      { value: 'any', option: 'Any Category' },
      { value: '9', option: 'General Knowledge' },
      { value: '10', option: 'Entertainment: Books' },
      { value: '11', option: 'Entertainment: Film' },
      { value: '12', option: 'Entertainment: Music' },
      { value: '13', option: 'Entertainment: Musicals & Theatres' },
      { value: '14', option: 'Entertainment: Television' },
      { value: '15', option: 'Entertainment: Video Games' },
      { value: '16', option: 'Entertainment: Board Games' },
      { value: '17', option: 'Science & Nature' },
      { value: '18', option: 'Science: Computers' },
      { value: '19', option: 'Science: Mathematics' },
      { value: '20', option: 'Mythology' },
      { value: '21', option: 'Sports' },
      { value: '22', option: 'Geography' },
      { value: '23', option: 'History' },
      { value: '24', option: 'Politics' },
      { value: '25', option: 'Art' },
      { value: '26', option: 'Celebrities' },
      { value: '27', option: 'Animals' },
      { value: '28', option: 'Vehicles' },
      { value: '29', option: 'Entertainment: Comics' },
      { value: '30', option: 'Science: Gadgets' },
      { value: '31', option: 'Entertainment: Japanese Anime & Manga' },
      { value: '32', option: 'Entertainment: Cartoon & Animations' },
    ];

    const triviaDifficulty = [
      { value: 'any', option: 'Any difficulty' },
      { value: 'easy', option: 'Easy' },
      { value: 'medium', option: 'Medium' },
      { value: 'hard', option: 'Hard' }
    ];

    const triviaType = [
      { value: 'any', option: 'Any' },
      { value: 'multiple', option: 'Multiple Choice' },
      { value: 'boolean', option: 'True / False ' }
    ];

    const categoryGroup = _createSelectGroup({ name: 'category', id: 'trivia_category' }, triviaCategories);
    const difficultyGroup = _createSelectGroup({ name: 'difficulty', id: 'trivia_difficulty' }, triviaDifficulty);
    const typeGroup = _createSelectGroup({ name: 'type', id: 'trivia_type' }, triviaType);

    const submitBtn = _createElement('button', 'quiz-config__btn');
    submitBtn.classList.add('js-send-request', 'u-mg-top-md');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Start';

    form.append(formHeading, amountGroup, categoryGroup, difficultyGroup, typeGroup, submitBtn);

    console.log('load quiz configurator');

    return form;
  }

  function _createSelectGroup({ name, id }, options) {
    const configGroup = _createElement('div', 'quiz-config__group');

    const label = _createElement('label', 'quiz-config__label');
    label.htmlFor = id;
    label.textContent = `Select ${name}`;

    const select = _createElement('select', 'quiz-config__select');
    select.name = name;
    select.id = id;
    select.classList.add('quiz-config__select');

    // Create and append option elements from options array
    options.forEach(({ value, option }) => {
      const optionEl = _createElement('option');
      optionEl.value = value;
      optionEl.textContent = option;

      select.append(optionEl);
    })

    configGroup.append(label, select);

    return configGroup;
  }

  function resetView() {
    console.log('everything deleted');
  }

  function showLoader() {
    _loader.classList.add('active');
  }

  function hideLoader() {
    _loader.classList.remove('active');
  }

  function _getElement(selector) {
    const element = document.querySelector(selector);

    return element;
  }

  function _createElement(selector, className) {
    const element = document.createElement(selector);

    if (className) element.classList.add(className);

    return element;
  }

  return {
    init: () => {
      console.log('View controller initialized');
    },
    app: _app,
    config: createQuizConfig,
    main: _main,
    showLoader: showLoader,
    hideLoader: hideLoader
  }
})();

const app = (function (view, model) {

  return {
    init: () => {
      view.init();
      model.init();
      console.log('app initialized');
    },
    model,
    view
  }
})(viewController, modelController);

// app.init();

// FETCHING QUIZ DATA
// 1. display loader
// 2. fetch quiz questions
// 3. generate first question
// 4. hide loader

// USER ANSWERS THE QUETSION
// 1. user selects an answer
// 2. prevent submiting more than 1 answer
// 2. answer validation
// 3. update score
// a. show loader after 500ms
// 4. show next question
// b. hide loader