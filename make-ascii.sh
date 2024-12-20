#!/bin/bash
# Author: Nguyen Khac Trung Kien
rm -rf frames-bad-apple
mkdir -p frames-bad-apple
ffmpeg -i bad_apple.mp4 -vf fps=2 frames-bad-apple/out%04d.jpg

rm -rf frames-ascii
mkdir -p frames-ascii
for file in $PWD/frames-bad-apple/*;
do
  filename=$(basename "$file")
  echo $filename
  ascii-image-converter -d 30,16 $file >  frames-ascii/$filename.txt
done
