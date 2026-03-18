#!/bin/bash
# Export cv.html to PDF on Desktop using headless Chrome

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INPUT="file://${SCRIPT_DIR}/cv.html"
OUTPUT="$HOME/Desktop/SeongRae_Noh_CV.pdf"

google-chrome \
  --headless \
  --disable-gpu \
  --no-sandbox \
  --print-to-pdf="$OUTPUT" \
  --print-to-pdf-no-header \
  "$INPUT"

echo "✅ CV exported to: $OUTPUT"
