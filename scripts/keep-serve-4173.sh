#!/bin/bash
cd /workspace || exit 1
export HOST=0.0.0.0
export PORT=4173
mkdir -p /workspace/.logs
LOG=/workspace/.logs/serve-4173.log

port_up() {
  curl -s -o /dev/null --connect-timeout 1 "http://127.0.0.1:${PORT}/login"
}

while true; do
  if port_up; then
    echo "$(date -Is) already serving :${PORT}" >>"$LOG"
    sleep 5
    continue
  fi
  echo "$(date -Is) starting serve-producto" | tee -a "$LOG"
  node scripts/serve-producto.mjs >>"$LOG" 2>&1
  code=$?
  echo "$(date -Is) exited code=$code — restart in 1s" | tee -a "$LOG"
  sleep 1
done
