'use strict'
const modelController = (function () {

  let _questions = [];
  let _score = 0;
  let _apiEndpoint = 'https://opentdb.com/api.php?';

  let request = new XMLHttpRequest();
  request.onload = function () {
    if (this.status === 200) {
      (function ({ results, ...rest }) {
        _questions = results;
        console.log(results);
      })(JSON.parse(this.response))
    } else console.log('Couldn\'t load questions. Try again.');
  }

  function fetchQuestions(formData) {
    let query = [];
    for (let [key, value] of formData) {
      if (value === 'any') continue;
      query.push(`${key}=${value}`);
    }

    query = query.join('&');

    console.log(`${_apiEndpoint}${query}`);

    request.open('GET', `${_apiEndpoint}${query}`);
    request.send();
  }

  return {
    // Public methods
    fetchQuestions: fetchQuestions,
    get questions() {
      return _questions;
    }
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

  function buildQuestions(questions) {
    responseField.textContent = JSON.stringify(questions);
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

  // USER ANSWERS THE QUETSION
  // 1. user selects an answer
  // 2. prevent submiting more than 1 answer
  // 2. answer validation
  // 3. update score
  // a. show loader after 500ms
  // 4. show next question
  // b. hide loader
  //#endregion

  view.form.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = new FormData(this);

    // Patched up wait for the response :)
    model.fetchQuestions(data);

    view.toggleLoader();
    setTimeout(() => {
      view.buildQuestions(model.questions);
      view.toggleLoader();
    }, 1000);
  })

  return {

    init() { console.log('app initialized'); },
    view,
    model

  }

})(viewController, modelController);