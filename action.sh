#!/bin/sh

dir="/data/adb/modules/bad_apple/frames-4fps" 
sleep_time=0.25
lastframe=876

if [ -z $MMRL ] && { [ $KSU = true ] || [ $APATCH = true ]; }; then
	# somehow even 2fps (0.5 sleep) fails on ksu and apatch)
	dir="/data/adb/modules/bad_apple/frames-1fps" 
	sleep_time=1
	lastframe=219	
fi

x=0; while [ $x -lt 10 ] ; do cat $dir/out000${x}.jpg.txt ; x=$((x+1)) ; echo "" ; sleep $sleep_time ; done
x=10; while [ $x -lt 100 ] ; do cat $dir/out00${x}.jpg.txt ; x=$((x+1)) ; echo ""  ; sleep $sleep_time ; done
x=100; while [ $x -lt $lastframe ] ; do cat $dir/out0${x}.jpg.txt ; x=$((x+1)) ; echo ""  ; sleep $sleep_time ; done


