#!/bin/sh
MODDIR="${0%/*}"

# ksu and apatch cant handle much shit
# mmrl and magisk has no issues
# you can even run 10 fps on them but 
# the time skew becomes greater
if [ -z $MMRL ] && { [ $KSU = true ] || [ $APATCH = true ]; }; then
	for i in $(cat $MODDIR/frames_1fps.txt); do echo $i | base64 -d ; sleep 1 ; done
else
	for i in $(cat $MODDIR/frames_4fps.txt); do echo $i | base64 -d ; sleep 0.25 ; done
fi
