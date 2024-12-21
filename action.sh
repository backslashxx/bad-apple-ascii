#!/bin/sh
MODDIR="${0%/*}"

# ksu and apatch cant handle much shit
# mmrl and magisk has no issues
# you can even run 10 fps on them but 
# the time skew becomes greater
if [ -z $MMRL ] && { [ $KSU = true ] || [ $APATCH = true ]; }; then
	while read -r frame; do echo -en "$frame"; sleep 1 ;done < $MODDIR/frames_1fps.txt
else
	while read -r frame; do echo -en "$frame"; sleep 0.25 ;done < $MODDIR/frames_4fps.txt
fi
