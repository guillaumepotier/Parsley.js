#!/usr/bin/env bash

if [[ -z "$1" ]]
then
  echo "You must give a version number. eg: ./bin/build.sh 1.0.0"
else
  echo "** building parsley.min.js version " $1
  ruby ./bin/minify parsley.js dist/parsley.min.js $1 --force
  echo "  done!"

  echo "** building parsley-standalone.min.js version " $1
  ruby ./bin/minify tests/resources/zepto-1.0rc1[zepto.event.data.ajax.fx.fx_modules].js parsley.js dist/parsley-standalone.min.js $1 --force
  echo "  done!"

  echo "** building parsley.extend.min.js version " $1
  ruby ./bin/minify parsley.extend.js dist/parsley.extend.min.js $1 --force
  echo "  done!"
fi

if [[ "$2" == "doc" ]]
then
  echo "** generating API doc "
  ./bin/doc.sh $1
  echo "  done!"
fi