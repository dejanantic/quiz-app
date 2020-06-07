'use strict'
const modelController = (function () {

  let _questions = [];
  let _currentQuestionIndex = 0;
  let _score = 0;

  function saveQuestions(responseResults) {
    _questions = _prepareQuestions([...responseResults]);
  }

  function _prepareQuestions(questionsArray) {
    return questionsArray.map((questionObj, index) => {
      const question = {
        index: index,
        category: questionObj.category,
        difficulty: questionObj.difficulty,
        text: questionObj.question,
        correctAnswer: questionObj.correct_answer,
        answers: _shuffleAnswers([questionObj.correct_answer, ...questionObj.incorrect_answers]),
        userAnswer: null,
      }

      return question;
    });
  }

  function _shuffleAnswers(answers) {
    let arr = [...answers];
    let result = [];

    while (arr.length > 0) {
      let r = Math.floor(Math.random() * arr.length);
      let answer = arr.splice(r, 1)[0];
      result.push(answer);
    }
    return result;
  }

  function serveNextQuestion() {
    const nextQuestion = _questions[_currentQuestionIndex++];

    return nextQuestion;
  }

  function isQuizOver() {
    return _currentQuestionIndex == _questions.length ? true : false;
  }

  function resetQuiz() {
    _currentQuestionIndex = 0;
    _score = 0;
    _questions = [];
  }

  function getCorrectAnswerIndex() {
    const currentQuestion = _questions[_currentQuestionIndex - 1];
    return currentQuestion.answers.indexOf(currentQuestion.correctAnswer);
  }

  function incrementScore() {
    return ++_score;
  }

  function getScore() {
    return _score;
  }

  function calculateQuizProgress() {
    return (_currentQuestionIndex * 100) / _questions.length;
  }

  function saveUserAnswer(userAnswer) {
    _questions[_currentQuestionIndex - 1].userAnswer = userAnswer;
  }

  function isAnswerCorrect(userAnswer) {
    return userAnswer == getCorrectAnswerIndex() ? true : false;
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
    resetModel: resetQuiz,
    getCorrectAnswerIndex: getCorrectAnswerIndex,
    incrementScore: incrementScore,
    getScore: getScore,
    isQuizOver: isQuizOver,
    progress: calculateQuizProgress,
    saveUserAnswer: saveUserAnswer,
    isAnswerCorrect: isAnswerCorrect,
  }
})();

const viewController = (function () {

  const _app = _getElement('#root');
  const _main = _createElement('main', 'main');
  const _loader = _createElement('div', 'loader');

  // Progress bar
  const _progressBar = _createElement('div', 'progress-bar');
  const _progress = _createElement('div', 'progress-bar__progress')
  _progressBar.appendChild(_progress);

  // Header
  const _header = _createElement('header', 'header');
  const _logo = _createElement('h1', 'logo');
  _logo.textContent = 'Trivia Quiz';

  _header.appendChild(_logo);
  _app.append(_header, _progressBar, _main, _loader);


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

  const submitBtn = _createElement('button', 'btn');
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

    const questionDetails = _createElement('div', 'question-card__question-details');
    const questionCategory = _createElement('div', 'question-card__category');
    questionCategory.textContent = questionObj.category;
    const questionDifficulty = _createElement('div', 'question-card__difficulty');
    questionDifficulty.textContent = questionObj.difficulty;
    questionDetails.append(questionCategory, questionDifficulty);

    const question = _createElement('h2', 'question-card__question');
    question.innerHTML = questionObj.text;
    const btn = _createElement('button', 'btn');
    btn.classList.add('js-next-question');
    btn.classList.add('u-mg-top-md');
    btn.textContent = 'Next question'

    const answers = _buildAnswers(questionObj.answers);

    questionCard.append(questionDetails, question, answers, btn);

    return questionCard;
  }

  function _buildAnswers(answersArr) {
    const answersContainer = _createElement('ul', 'question-card__answers');
    const answers = [...answersArr];

    const HTMLanswers = answers.map((answer, index) => {
      const elem = _createElement('li', 'question-card__answer');
      elem.dataset.answerId = index;
      elem.innerHTML = answer;

      return elem;
    })

    answersContainer.append(...HTMLanswers);

    return answersContainer;
  }

  function applyCorrectAnswerStyleTo(answer) {
    answer.classList.add('correct');

    _flagQuestionCard();
  }

  function applyIncorrectAnswerStyleTo(answer) {
    answer.classList.add('incorrect');

    _flagQuestionCard();
  }

  function showCorrectAnswer(correctAnswerIndex) {
    const answers = Array.from(document.querySelectorAll('.question-card__answer'));

    let correctAnswer = answers.filter(answer => answer.dataset.answerId == correctAnswerIndex);
    correctAnswer = correctAnswer[0];

    applyCorrectAnswerStyleTo(correctAnswer);
  }

  // Mark question card as answered so that further clicks are not possible
  function _flagQuestionCard() {
    const questionCard = _getElement('.question-card');

    if (!questionCard.classList.contains('js-answered')) questionCard.classList.add('js-answered');
  }

  function showNextQuestionButton() {
    const btn = _getElement('.js-next-question');
    btn.style.visibility = 'visible';
  }

  function updateProgress(handler) {
    _progress.style.width = `${Math.floor(handler())}%`;
  }

  function updateNextButtonText() {
    const btn = _getElement('.js-next-question');
    btn.textContent = 'Finish Quiz';
  }

  function showQuizSummary(score, totalQuestions) {
    const quizSummary = _createElement('div', 'quiz-summary');
    const title = _createElement('h2', 'quiz-summary__title');
    title.textContent = `You got ${score} out of ${totalQuestions} questions!`;

    const btnContainer = _createElement('div', 'quiz-summary__buttons');

    const answersBtn = _createElement('button', 'btn');
    answersBtn.classList.add('btn--light');
    answersBtn.textContent = 'My answers';

    const restartBtn = _createElement('button', 'btn');
    restartBtn.textContent = 'Restart Quiz';
    restartBtn.addEventListener('click', function resetQuiz(e) {
      window.location.reload();
    }, { once: true });

    btnContainer.append(restartBtn, answersBtn);

    console.log(`You got ${score} out of ${totalQuestions} questions`);

    quizSummary.append(title, btnContainer);

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
    applyCorrectAnswerStyleTo: applyCorrectAnswerStyleTo,
    applyIncorrectAnswerStyleTo: applyIncorrectAnswerStyleTo,
    showNextQuestionButton: showNextQuestionButton,
    showCorrectAnswer: showCorrectAnswer,
    showQuizSummary: showQuizSummary,
    updateProgress: updateProgress,
    updateNextButtonText: updateNextButtonText,
  }
})();

const app = (function (view, model) {


  // Event listeners and stuff
  // Maybe take the form out of the quizConfig function
  view.form.addEventListener('submit', function passFormData(e) {
    e.preventDefault();

    view.showLoader();

    const data = new FormData(e.target);
    const url = _buildURL(data);

    // fetch questions
    _fetchQuestions(url)
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
      view.updateProgress(model.progress);
    } else {
      view.updateProgress(model.progress);
      const question = model.serveNextQuestion();
      const questionCard = view.buildQuestionCard(question);
      view.main.appendChild(questionCard);
      if (model.isQuizOver()) view.updateNextButtonText();
    }
  })

  // Check if the answer is correct and show the button for next question
  view.main.addEventListener('click', function checkAnswer(e) {
    if (e.target.tagName !== 'LI') return;
    // If the question card was answered, prevent further clicks
    if (e.target.closest('.question-card').classList.contains('js-answered')) return;

    const clickedLi = e.target;
    const userAnswer = clickedLi.dataset.answerId;
    const correctAnswerIndex = model.getCorrectAnswerIndex();
    // Save user answer in question object
    model.saveUserAnswer(userAnswer);

    // userAnswer === correctAnswer
    if (model.isAnswerCorrect(userAnswer)) {
      model.incrementScore();

      view.applyCorrectAnswerStyleTo(clickedLi);
      view.showNextQuestionButton();
    } else {

      view.applyIncorrectAnswerStyleTo(clickedLi);
      view.showCorrectAnswer(correctAnswerIndex);
      view.showNextQuestionButton();
    }

  })

  function _buildURL(data) {
    const apiEndpoint = 'https://opentdb.com/api.php';
    const url = new URL(apiEndpoint);
    for (let [key, value] of data) {
      if (value === 'any') continue;
      url.searchParams.set(key, value);

    }

    return url;
  }

  function _fetchQuestions(url) {
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