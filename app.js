'use strict'
const modelController = (function () {

  return {
    init: () => {
      console.log('Model controller initialized');
    }
  }
})();

const viewController = (function () {

  return {
    init: () => {
      console.log('View controller initialized');
    }
  }
})();

const app = (function (view, model) {
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

  return {
    init: () => {
      view.init();
      model.init();
      console.log('app initialized');
    }
  }
})(viewController, modelController);

app.init();