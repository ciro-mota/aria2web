#!/bin/sh

awk '($5 == "/downloads" || index($5, "/downloads/") == 1) && index("," $6 ",", ",rw,") { print $5 }' /proc/self/mountinfo | sort > /www/dirs.txt

echo "/dirs.txt:aria2:$RPC_SECRET" > /tmp/httpd.conf

httpd -p 8080 -h /www -c /tmp/httpd.conf

exec aria2c --enable-rpc --rpc-listen-all --rpc-allow-origin-all \
  --rpc-secret="$RPC_SECRET" --dir=/downloads