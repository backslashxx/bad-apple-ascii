#!/bin/sh
MODDIR="/data/adb/modules/bad_apple"

# mmrl and ksu 11998, ksu-next 12144, apatch 11022 and above can clear action window
if [ "$MMRL" = "true" ] || { [ "$KSU" = "true" ] && [ "$KSU_VER_CODE" -ge 11998 ]; } || 
	{ [ "$KSU_NEXT" = "true" ] && [ "$KSU_VER_CODE" -ge 12144 ]; } ||
	{ [ "$APATCH" = "true" ] && [ "$APATCH_VER_CODE" -ge 11022 ]; }; then
        while read -r frame; do 
                clear
                echo -en "$frame"
                usleep 33333
        done < $MODDIR/frames_30fps.txt
        exit 0  
fi

# old ksu and apatch cant handle much shit
if [ -z "$MMRL" ] && { [ "$APATCH" = "true" ] || [ "$KSU" = "true" ]; }; then
        while read -r frame; do echo -en "$frame"; sleep 1 ; done < $MODDIR/frames_1fps.txt
        exit 0
fi

# magisk and whatever terminal calls it
while read -r frame; do echo -en "$frame" ; usleep 100000 ; done < $MODDIR/frames_10fps.txt
exit 0
