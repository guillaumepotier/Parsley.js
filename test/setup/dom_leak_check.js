import $ from 'jquery';

afterEach(function() {
  expect($('form input').length).to.be(0);
});

window.$ = $; // Export for testing purposes...
