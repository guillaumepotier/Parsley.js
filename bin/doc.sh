#!/usr/bin/env bash

if [[ "$1" ]]
  then
    yuidoc -n -o doc/api --project-version $1 --quiet .
  else
    yuidoc -n -o doc/api .
fi
