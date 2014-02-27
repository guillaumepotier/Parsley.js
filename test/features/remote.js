define('features/remote', [
  'src/parsley.remote',
], function (ParsleyExtend) {

  // Preseve ParsleyExtend in order to load it only when needed by this suite and do not alter other tests runned before
  window._remoteParsleyExtend = window.ParsleyExtend;
  window.ParsleyExtend = {};

  return function () {
    describe('ParsleyRemote', function () {
      before(function () {
        // Restore ParsleyExtend from remote
        window.ParsleyExtend = window._remoteParsleyExtend;
        sinon.stub($, 'ajax');
      });
      it('should have window.ParsleyExtend defined', function () {
        expect(window.ParsleyExtend).not.to.be(undefined);
      });
      it('should return a promise object when calling asyncIsValid and asyncValidate on a field', function () {
        $('body').append('<input type="email" id="element" required data-parsley-remote="http://foo.bar" />');
        var promise = $('#element').psly().asyncIsValid();
        expect(promise).to.be.an('object');
        expect(promise).to.have.key('promise');
        promise = $('#element').psly().asyncValidate();
        expect(promise).to.be.an('object');
        expect(promise).to.have.key('promise');
      });
      it('should return a promise object when calling asyncIsValid and asyncValidate on a form', function () {
        $('body').append(
          '<form id="element" data-parsley-trigger="change">'                 +
            '<input id="field1" type="text" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                         +
            '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
          '</form>');
        var promise = $('#element').psly().asyncIsValid();
        expect(promise).to.be.an('object');
        expect(promise).to.have.key('promise');
        promise = $('#element').psly().asyncValidate();
        expect(promise).to.be.an('object');
        expect(promise).to.have.key('promise');
      });
      it('should trigger right events on asyncValidate for form and field', function (done) {
        $.listen('parsley:form:validated', function () { done(); });
        $('body').append(
          '<form id="element" data-parsley-trigger="change">'                 +
            '<input id="field1" type="text" data-parsley-required="true" />'  +
            '<div id="field2"></div>'                                         +
            '<textarea id="field3" data-parsley-notblank="true"></textarea>'  +
          '</form>');
        $('#element').psly().asyncValidate();
      });
      it.skip('should handle properly validation with remote validator', function () {});
      it.skip('should save some calls for querries already done');
      it.skip('should handle remote reverse option');
      it.skip('should handle remote options');

      afterEach(function () {
        if ($('#element').length)
          $('#element').remove();

        if ($('.parsley-errors-list').length)
          $('.parsley-errors-list').remove();
      });

      after(function () {
        $.ajax.restore();
      });
    });
  };
});
