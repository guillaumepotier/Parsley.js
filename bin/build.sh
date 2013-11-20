#!/usr/bin/env bash

if [[ -z "$1" ]]
then
  echo "You must give a version number. eg: ./bin/build.sh 1.0.0"
else
  echo "** building parsley.min.js version " $1
  ruby ./bin/minify parsley.js dist/parsley.min.js $1 --force
  echo "  done!"

  echo "** building parsley.extend.min.js version " $1
  ruby ./bin/minify parsley.extend.js dist/parsley.extend.min.js $1 --force
  echo "  done!"

  echo "** building parsley.es.min.js version " $1
  ruby ./bin/minify l10n/parsley.es.js dist/parsley.es.min.js $1 --force
  echo "  done!"
fi

if [[ "$2" == "doc" ]]
then
  echo "** generating API doc "
  ./bin/doc.sh $1
  echo "  done!"
fi
