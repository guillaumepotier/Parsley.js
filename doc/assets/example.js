(function() {
  var html = $.trim($('div.example').html());
  var js = $.trim($('script.example').text());
  function createCodeExample() {
    $('code.example').text(
      html +
      '\n\n<' + 'script type="text/javascript">\n' +
      js +
      '\n<' + '/script>\n'
    );
  }

  function launchEditor() {
    var css = $.trim($('style.example').text());

    var data = {
      title: $(document).attr('title'),
      description: "Where does this show???",
      html: html,
      js: js,
      css: css + '\nhtml.codepen body {\n  margin: 1em;\n}\n',
      html_classes: 'codepen',
      js_external: [
        '//code.jquery.com/jquery-2.1.3.js',
        'https://rawgit.com/guillaumepotier/Parsley.js/2.2.0-rc4/dist/parsley.js'
      ].join(';'),
      css_external: [
        'https://rawgit.com/guillaumepotier/Parsley.js/2.2.0-rc4/bower_components/bootstrap/dist/css/bootstrap.css',
        'https://rawgit.com/guillaumepotier/Parsley.js/2.2.0-rc4/doc/assets/docs.css',
        'https://rawgit.com/guillaumepotier/Parsley.js/2.2.0-rc4/src/parsley.css'
      ].join(';')
    };

    var $input = $('<input type="hidden" name="data">')
      .val(JSON.stringify(data));
    var $form = $('<form action="http://codepen.io/pen/define?editors=101" method="POST" target="_blank">')
      .append($input)
      .submit();
  }

  function track() {
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-37229467-1']);
    _gaq.push(['_trackPageview']);

    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  }

  function init() {
    createCodeExample();

    try {
      hljs.initHighlightingOnLoad();
    } catch ( err ) {}

    $('.play').click(launchEditor)

    track();
  }

  init();
})();
