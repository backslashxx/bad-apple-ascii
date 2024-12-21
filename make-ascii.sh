#!/bin/bash
# Author: Nguyen Khac Trung Kien
rm -rf frames-bad-apple
mkdir -p frames-bad-apple
ffmpeg -i bad_apple.mp4 -vf fps=4 frames-bad-apple/out%04d.jpg

rm -rf frames-ascii
mkdir -p frames-ascii
for file in $PWD/frames-bad-apple/*;
do
  filename=$(basename "$file")
  ascii-image-converter -d 30,16 $file | sed -z 's|\n|\\n|g' >> frames-ascii/frames.txt
  echo "" >> frames-ascii/frames.txt
done
