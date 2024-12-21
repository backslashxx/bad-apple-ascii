#!/bin/sh

dir="/data/adb/modules/bad_apple/combined.txt" 
sleep_time=250000000 #nanoseconds
frames=876

/data/adb/modules/bad_apple/badapple $dir 16 30 $frames $sleep_time
