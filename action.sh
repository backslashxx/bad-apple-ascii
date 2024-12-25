#!/bin/sh
MODDIR="/data/adb/modules/bad_apple"

# mmrl's custom feature
# https://github.com/DerGoogler/MMRL/blob/master/docs/INSTALLER.md#clear-terminal
if [ "$MMRL" = "true" ]; then
        if echo "$CLASSPATH" | grep -q "mmrl.debug" > /dev/null 2>&1; then
                clear() { am broadcast -a com.dergoogler.mmrl.debug.CLEAR_TERMINAL > /dev/null 2>&1; }
        else
                clear() { am broadcast -a com.dergoogler.mmrl.CLEAR_TERMINAL > /dev/null 2>&1; }
        fi
fi

# mmrl and kernelsu 11998 and above can clear action window
# ksu-next too https://github.com/rifsxd/KernelSU-Next/commit/f935077bb80337f578abaa2fd4f7ec1c08baa3ab
if [ "$MMRL" = "true" ] || { [ "$KSU" = "true" ] && [ "$KSU_VER_CODE" -ge 11998 ]; } || { [ "$KSU_NEXT" = "true" ] && [ "$KSU_VER_CODE" -ge 12144 ]; }; then
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
