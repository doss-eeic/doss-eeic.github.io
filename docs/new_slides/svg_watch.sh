#!/bin/bash

inotifywait -m -e close_write svg/*.svg | while read; do
  make -f svg_watch.mk
done
