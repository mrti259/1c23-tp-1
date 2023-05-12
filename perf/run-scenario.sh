#!/bin/sh
npm run artillery -- run scenarios/$1/$2.yaml -e $3
