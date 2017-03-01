import $ from 'jquery';

import Parsley from '../../../src/parsley';

describe('extra/plugin/bind', () => {
  // Hack to load and undo the loading of the plugin:
  before(() => {
    require('../../../src/extra/plugin/bind');
  });
  after(() => {
    window.ParsleyExtend = {}; // Undo the plugin...
  });

  it('should have a bind.js plugin allowing to give pure json validation config to parsley constructor', () => {
    $('body').append(
      '<form id="element" >' +
        '<input type="text" name="name" />' +
        '<input type="text" name="email" id="email" />' +
        '<input type="checkbox" name="sexe" id="sexe" value="male" />' +
        '<input type="checkbox" name="sexe" value="female" />' +
      '</form>');

    var parsleyInstance;
    expectWarning(() => {
      parsleyInstance = $('#element').parsley({
        fields: {
          '[name="name"]': {
            required: true,
            length: [4, 20]
          },
          '#email': {
            type: 'email'
          },
          '#sexe': {
            required: true
          }
        }
      });
    });
    expect($('[name="name"]').parsley().constraints.length).to.be(2);
    expect($('#email').parsley().constraints.length).to.be(1);
    expect($('#sexe').parsley().constraints.length).to.be(1);
    expect($('#sexe').parsley().constraints[0].name).to.be('required');
  });

  afterEach(() => {
    $('#element, .fixture, .parsley-errors-list').remove();
  });
});
