#!/bin/sh
MODDIR="/data/adb/modules/bad_apple"

# ksu and apatch cant handle much shit
if [ -z "$MMRL" ] && [ "$APATCH" = "true" ]; then
        while read -r frame; do echo -en "$frame"; sleep 1 ; done < $MODDIR/frames_1fps.txt
        exit 0
fi

# requires https://github.com/bryanyee33/KernelSU/commit/3da19277a2efadcc52e2b48c01329ee2c36712ef
if [ -z "$MMRL" ] && [ "$KSU" = "true" ]; then
	while read -r frame; do 
		clear
		echo -en "$frame"	
		usleep 33333
	done < $MODDIR/frames_30fps.txt
	exit 0	
fi

# use mmrl's feature
# https://github.com/DerGoogler/MMRL/blob/master/docs/INSTALLER.md#clear-terminal
if [ "$MMRL" = "true" ]; then
	if echo $CLASSPATH | grep -q "mmrl.debug" > /dev/null 2>&1; then
		mmrl_clear() { am broadcast -a com.dergoogler.mmrl.debug.CLEAR_TERMINAL > /dev/null 2>&1; }
	else
		mmrl_clear() { am broadcast -a com.dergoogler.mmrl.CLEAR_TERMINAL > /dev/null 2>&1; }
	fi
	while read -r frame; do 
		mmrl_clear
		echo -en "$frame"
		usleep 33333
	done < $MODDIR/frames_30fps.txt
	exit 0	
fi

while read -r frame; do echo -en "$frame" ; usleep 100000 ; done < $MODDIR/frames_10fps.txt
exit 0
