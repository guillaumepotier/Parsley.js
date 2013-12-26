define(function () {
  return function (ParsleyUtils) {
    describe('Utils', function () {
      it('should have a proper attr() function', function () {
        var element = [{
          attributes: [
            {
              specified: true,
              name: "data-parsley-foo",
              value: "bar"
            },
            {
              specified: true,
              name: "parsley-foo",
              value: "baz"
            },
            {
              specified: true,
              name: "data-parsley-bar",
              value: "[0, 42]"
            },
            {
              specified: false,
              name: "data-parsley-foo",
              value: "bar"
            },
            {
              foo: "bar"
            }
          ]
        }],
        attr = ParsleyUtils.attr(element, 'data-parsley-');

        expect(attr).to.eql({'foo': 'bar', 'bar': [0, 42]});
      });
    });
  }
});
