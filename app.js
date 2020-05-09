'use strict'
const modelController = (function () {

  let _questions;
  let _currentQuestionIndex = 0;
  let _score = 0;

  function saveQuestions(responseResults) {
    _questions = [...responseResults];
  }

  function serveNextQuestion() {
    const nextQuestion = _questions[_currentQuestionIndex++];

    return nextQuestion;
  }

  function isQuizOver() {
    return _currentQuestionIndex == _questions.length ? true : false;
  }

  function resetQuestionIndex() {
    _currentQuestionIndex = 0;
  }

  function getCorrectAnswer() {
    return _questions[(_currentQuestionIndex - 1)].correct_answer;
  }

  function incrementScore() {
    return ++_score;
  }

  function getScore() {
    return _score;
  }

  return {
    init: () => {
      console.log('Model controller initialized');
    },
    saveQuestions: saveQuestions,
    get questions() {
      return _questions;
    },
    serveNextQuestion: serveNextQuestion,
    resetQuestionIndex: resetQuestionIndex,
    getCorrectAnswer: getCorrectAnswer,
    incrementScore: incrementScore,
    getScore: getScore,
    isQuizOver: isQuizOver,
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
  _par.textContent = `Score: `;

  _par.append(_span);
  _score.append(_par);
  _header.append(_logo, _score);
  _app.append(_header, _main, _loader);


  // Create Quiz Configurator
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

  function clearView() {
    while (_main.firstChild) _main.removeChild(_main.firstChild);
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

  function buildQuestionCard(questionObj) {
    const questionCard = _createElement('div', 'question-card');
    const question = _createElement('h2', 'question-card__question');
    question.textContent = questionObj.question;
    const btn = _createElement('button', 'question-card__btn');
    btn.classList.add('js-next-question');
    btn.textContent = 'Next question'

    const answers = _buildAnswers(questionObj);

    questionCard.append(question, answers, btn);

    return questionCard;
  }

  function _buildAnswers({ correct_answer, incorrect_answers }) {
    const answersContainer = _createElement('ul', 'question-card__answers');
    const answers = [correct_answer, ...incorrect_answers];
    const correctAnswer = _createElement('li', 'question-card__answer');

    answers.forEach(answer => {
      const elem = _createElement('li', 'question-card__answer');
      elem.textContent = answer;

      answersContainer.appendChild(elem);
    })

    // answers = [..._shuffleAnswers(answers)];???
    return answersContainer;
  }

  function _shuffleAnswers(answers) {
    // shuffle answers so they don't always have the same order
  }

  function updateScore(newScore) {
    // The span element that shows the score value
    _span.textContent = newScore;
  }

  function applyCorrectAnswerStyleTo(answer) {
    answer.classList.add('correct');

    _flagQuestionCard();
  }

  function applyIncorrectAnswerStyleTo(answer) {
    answer.classList.add('incorrect');

    _flagQuestionCard();
  }

  function showCorrectAnswer(correctAnswerText) {
    const answers = Array.from(document.querySelectorAll('.question-card__answer'));

    let correctAnswer = answers.filter(answer => answer.textContent === correctAnswerText);
    correctAnswer = correctAnswer[0];

    applyCorrectAnswerStyleTo(correctAnswer);
  }

  // Mark question card as answered so that further clicks are not possible
  function _flagQuestionCard() {
    const questionCard = document.querySelector('.question-card');

    if (!questionCard.classList.contains('js-answered')) questionCard.classList.add('js-answered');
  }

  function showNextQuestionButton() {
    const btn = document.querySelector('.js-next-question');
    btn.style.visibility = 'visible';
  }

  function showQuizSummary(score, totalQuestions) {
    const quizSummary = _createElement('div', 'quiz-summary');
    const title = _createElement('h2', 'quiz-summary__title');
    title.textContent = `You got ${score} of ${totalQuestions} questions!`;
    const restartBtn = _createElement('button', 'quiz-summary__btn');
    restartBtn.textContent = 'Restart Quiz';
    const answersBtn = _createElement('button', 'quiz-summary__btn');
    answersBtn.textContent = 'My answers';

    console.log(`You got ${score} out of ${totalQuestions} questions`);

    quizSummary.append(title, restartBtn, answersBtn);
    return quizSummary;
  }

  return {
    init() {
      clearView();
      _main.append(form);
      console.log('View controller initialized');
    },
    main: _main,
    form: form,
    showLoader: showLoader,
    hideLoader: hideLoader,
    clearView: clearView,
    buildQuestionCard: buildQuestionCard,
    updateScore: updateScore,
    applyCorrectAnswerStyleTo: applyCorrectAnswerStyleTo,
    applyIncorrectAnswerStyleTo: applyIncorrectAnswerStyleTo,
    showNextQuestionButton: showNextQuestionButton,
    showCorrectAnswer: showCorrectAnswer,
    showQuizSummary: showQuizSummary,
  }
})();

const app = (function (view, model) {


  // Event listeners and stuff
  // Maybe take the form out of the quizConfig function
  view.form.addEventListener('submit', function passFormData(e) {
    e.preventDefault();

    view.showLoader();

    const data = new FormData(e.target);
    const url = buildURL(data);

    // fetch questions
    fetchQuestions(url)
  });

  document.addEventListener('load-question', function loadFirstQuestion(e) {
    view.clearView();

    const question = model.serveNextQuestion();

    const questionCard = view.buildQuestionCard(question);

    view.main.appendChild(questionCard);

    view.hideLoader();
  })

  document.addEventListener('click', function loadNextQuestion(e) {
    if (!e.target.classList.contains('js-next-question')) return;

    view.clearView();

    if (model.isQuizOver()) {
      const quizSummary = view.showQuizSummary(model.getScore(), model.questions.length);
      view.main.appendChild(quizSummary);
    } else {
      const question = model.serveNextQuestion();
      const questionCard = view.buildQuestionCard(question);
      view.main.appendChild(questionCard);
    }
  })

  // Check if the answer is correct and show the button for next question
  view.main.addEventListener('click', function checkAnswer(e) {
    if (e.target.tagName !== 'LI') return;
    // If the question card was answered, prevent further clicks
    if (e.target.closest('.question-card').classList.contains('js-answered')) return;

    const clickedEl = e.target;
    const userAnswer = clickedEl.textContent;
    const correctAnswer = model.getCorrectAnswer();

    if (userAnswer === correctAnswer) {
      const newScore = model.incrementScore();
      view.updateScore(newScore);

      view.applyCorrectAnswerStyleTo(clickedEl);
      view.showNextQuestionButton();
      console.log('you answered correctly');
    } else {

      view.applyIncorrectAnswerStyleTo(clickedEl);
      view.showCorrectAnswer(correctAnswer);
      view.showNextQuestionButton();
      console.log('you answered incorrectly');
    }

  })

  function buildURL(data) {
    const _apiEndpoint = 'https://opentdb.com/api.php';
    const _URL = new URL(_apiEndpoint);
    for (let [key, value] of data) {
      if (value === 'any') continue;
      _URL.searchParams.set(key, value);

    }
    console.log(_URL);

    return _URL;
  }

  function fetchQuestions(url) {
    const request = new XMLHttpRequest();
    request.onload = function handleResponse() {
      if (this.status === 200) {
        const res = JSON.parse(this.response);
        model.saveQuestions(res.results);

        view.main.dispatchEvent(new CustomEvent('load-question', { bubbles: true }));
      }
    }

    request.open('GET', url);
    request.send();
  }

  return {
    init: () => {
      view.init();
      model.init();
      console.log('app initialized');
    },
    model,
    view,
  }
})(viewController, modelController);

app.init();

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