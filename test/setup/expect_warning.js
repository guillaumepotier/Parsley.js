module.exports = function() {
  beforeEach(function() {
    sinon.spy(window.console, 'warn');
    window.console.warn.expectedCallCount = 0;
  });
  afterEach(function() {
    expect(window.console.warn.callCount).to.be(window.console.warn.expectedCallCount);
    window.console.warn.restore();
  });

  global.expectWarning = function(fn) {
    var w = window.console.warn;
    expect(w.callCount).to.be(w.expectedCallCount);
    var result = fn.call();
    w.expectedCallCount++;
    expect(w.callCount).to.be(w.expectedCallCount);
    return result;
  };
};
