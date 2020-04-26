'use strict'
const modelController = (function () {

  let _questions = [];
  let _score = 0;

  function loadQuestions(questions) {
    _questions = [...questions];
    _score = 0;
  }

  return {
    // Public methods
    loadQuestions: loadQuestions,
    questions: () => _questions
  }

})();

const viewController = (function () {

  const score = document.querySelector('.js-score');
  const form = document.getElementById('quiz-config');
  const loader = document.getElementById('loader');
  const responseField = document.getElementById('response');

  function toggleLoader() {
    if (loader.classList.contains('active')) loader.classList.remove('active');
    else loader.classList.add('active');
  }

  function _generateQuestionHTML(question) {
    return ``
  }

  function buildQuestions(questions) {
    responseField.textContent = JSON.stringify(questions);
    questions.forEach(question => {

    });

    if (!responseField.classList.contains('show')) responseField.classList.add('show');
  }

  return {
    // Public properties and methods
    buildQuestions: buildQuestions,
    toggleLoader: toggleLoader,
    form: form,
  }

})();

const app = (function (view, model) {
  //#region Comments 
  // FETCHING QUIZ DATA
  // 1. display loader
  // 2. fetch quiz questions
  // 3. generate first question
  // 4. hide loader
  const _apiEndpoint = 'https://opentdb.com/api.php?';
  let request = new XMLHttpRequest();
  request.onload = function () {
    if (this.status === 200) {
      const res = JSON.parse(this.response);
      model.loadQuestions(res.results);
      view.buildQuestions(model.questions());

      view.toggleLoader();
    } else console.log('Couldn\'t load questions. Try again.');
  }

  // USER ANSWERS THE QUETSION
  // 1. user selects an answer
  // 2. prevent submiting more than 1 answer
  // 2. answer validation
  // 3. update score
  // a. show loader after 500ms
  // 4. show next question
  // b. hide loader
  //#endregion

  function createQueryParams(formData) {
    let query = [];
    for (let [key, value] of formData) {
      if (value === 'any') continue;
      query.push(`${key}=${value}`);
    }
    return query.join('&');
  }

  view.form.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = new FormData(this);

    // Patched up wait for the response :)
    const queryParams = createQueryParams(data);
    request.open('GET', `${_apiEndpoint}${queryParams}`);
    request.send();
    view.toggleLoader();
  });

  document.querySelectorAll('button').addEventListener('click', function () {
    model.setAnswer(quiestionIndex, questuion); // here next questions should be selected
    view.setActiveQuestion(model.getActiveQuestionIndex());
  });

  return {
    init: () => { },
    view,
    model
  }

})(viewController, modelController);
