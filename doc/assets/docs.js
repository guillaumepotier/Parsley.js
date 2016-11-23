!function ($) {

  $(function () {

    var $window = $(window);
    var $body   = $(document.body);

    var navHeight = $('.navbar').outerHeight(true) + 10;

    $body.scrollspy({
      target: '.sidebar'
    });

    // analyse prefixed hash on load and redirect to right anchor
    $window.on('load', function () {
      $body.scrollspy('refresh');
      if (/^#psly-/i.test(window.location.hash)) {
        var h = window.location.hash.replace('psly-', '');

        if ($(h).length)
          window.location.hash = h;
      }
    });

    // back to top hack with scrollipsy
    $('.back-to-top').on('click', function () {
      $('.sidebar .active').each(function () {
        $(this).removeClass('active');
      });

      $('.sidebar ul:first li:first').addClass('active');
    });

    // back to top
    setTimeout(function () {
      var $sideBar = $('.sidebar');

      $sideBar.affix({
        offset: {
          top: function () {
            var offsetTop      = $sideBar.offset().top;
            var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10);
            var navOuterHeight = 10;

            return (this.top = offsetTop - navOuterHeight - sideBarMargin);
          },
          bottom: function () {
            return (this.bottom = $('.footer').outerHeight(true));
          }
        }
      });
    }, 100);

    setTimeout(function () {
      $('.top').affix();
    }, 100);
  });

}(window.jQuery);
