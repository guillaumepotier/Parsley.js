
$1 = $Args[0]
$2 = $Args[1]

if($1 -eq $null) {
  echo "You must give a version number. eg: ./bin/build.sh 1.0.0"
}
else {
  echo "** building parsley.min.js version " $1
  ruby ./bin/minify parsley.js dist/parsley.min.js $1 --force
  echo "  done!"

  echo "** building parsley-standalone.min.js version " $1
  ruby ./bin/minify tests/resources/zepto-1.0rc1[zepto.event.data.ajax.fx.fx_modules].js parsley.js dist/parsley-standalone.min.js $1 --force
  echo "  done!"

  echo "** building parsley.extend.min.js version " $1
  ruby ./bin/minify parsley.extend.js dist/parsley.extend.min.js $1 --force
  echo "  done!"
}

if($2 -eq "doc") {
  echo "** generating API doc "
  ./bin/doc.sh $1
  echo "  done!"
}