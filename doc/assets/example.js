(function() {
  var html = $.trim($('div.example').html());
  var js = $.trim($('script.example').text());
  $('code.example').text(
    html +
    '\n\n<' + 'script type="text/javascript">\n' +
    js +
    '\n<' + '/script>\n'
  );
  try {
    hljs.initHighlightingOnLoad();
  } catch ( err ) {}

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-37229467-1']);
  _gaq.push(['_trackPageview']);

  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
