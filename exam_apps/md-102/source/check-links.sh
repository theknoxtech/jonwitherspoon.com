#!/usr/bin/env bash
# Run this in a normal Mac terminal (needs internet). Lists every Learn link in the question bank that does not load.
# Usage: bash check-links.sh   (reads link-urls.tsv: URL <tab> question ids)
cd "$(dirname "$0")"
bad=0
while IFS=$'\t' read -r url ids; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -m 20 -L -A "Mozilla/5.0" "$url")
  if [ "$code" != "200" ]; then echo "$code  $url  (question ids: $ids)"; bad=$((bad+1)); fi
done < link-urls.tsv
echo "Done. $bad link(s) did not return 200."
