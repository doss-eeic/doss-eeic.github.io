#!/bin/bash
#src=new_slides.typ
src=01_report.typ
prefix=$(basename ${src} .typ)
#dst=~/0main/${prefix}.pdf
#dst=../docs/slides/${prefix}.pdf
dst=./${prefix}.pdf
typst watch --open evince ${src} ${dst}
