#!/usr/bin/env bash
# Add a specimen film: encodes a seamless 14 s loop and a poster, then updates the catalogue.
#   tools/add-film.sh A41 path/to/A41.mp4
set -euo pipefail
code=$(echo "$1" | tr '[:lower:]' '[:upper:]'); src="$2"
here="$(cd "$(dirname "$0")/.." && pwd)"; out="$here/site/assets/films/$(echo "$code" | tr '[:upper:]' '[:lower:]')"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
end=$(python3 -c "print(min(float('$dur'),15.04))"); off=$(python3 -c "print(max(1.0,$end-2))")
ffmpeg -nostdin -v error -y -i "$src" -filter_complex "[0]trim=1:$end,setpts=PTS-STARTPTS[m];[0]trim=0:1,setpts=PTS-STARTPTS[h];[m][h]xfade=transition=fade:duration=1:offset=$off,scale=960:-2,format=yuv420p[v]" \
  -map "[v]" -an -c:v libx264 -preset slow -crf 26 -profile:v high -movflags +faststart "$out.mp4"
ffmpeg -nostdin -v error -y -ss 4 -i "$out.mp4" -frames:v 1 -q:v 3 "$out.jpg"
python3 -I "$here/tools/add-specimens.py" "$here/site/catalogue.json"
echo "Added $out.mp4 ($(du -h "$out.mp4" | cut -f1)) and poster to $code"
