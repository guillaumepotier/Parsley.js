import parsley from '../../src/parsley';

describe('parsley', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(parsley, 'greet');
      parsley.greet();
    });

    it('should have been run once', () => {
      expect(parsley.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(parsley.greet).to.have.always.returned('hello');
    });
  });
});
