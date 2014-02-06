!function ($) {

  $(function () {

    var $window = $(window)
    var $body   = $(document.body)

    var navHeight = $('.navbar').outerHeight(true) + 10;
    console.log(navHeight);

    $body.scrollspy({
      target: '.sidebar',
      // offset: 45
    })

    $window.on('load', function () {
      $body.scrollspy('refresh')
    })

    // back to top
    setTimeout(function () {
      var $sideBar = $('.sidebar')

      $sideBar.affix({
        offset: {
          top: function () {
            var offsetTop      = $sideBar.offset().top
            var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10)
            var navOuterHeight = 10

            return (this.top = offsetTop - navOuterHeight - sideBarMargin)
          },
          bottom: function () {
            return (this.bottom = $('.footer').outerHeight(true))
          }
        }
      })
    }, 100)

    setTimeout(function () {
      $('.top').affix()
    }, 100)
  })

}(jQuery)
