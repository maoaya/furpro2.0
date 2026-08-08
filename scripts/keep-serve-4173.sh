#!/bin/bash
cd /workspace || exit 1
export HOST=0.0.0.0
export PORT=4173
mkdir -p /workspace/.logs
while true; do
  echo "$(date -Is) starting serve-producto" | tee -a /workspace/.logs/serve-4173.log
  node scripts/serve-producto.mjs >> /workspace/.logs/serve-4173.log 2>&1
  code=$?
  echo "$(date -Is) exited code=$code — restart in 1s" | tee -a /workspace/.logs/serve-4173.log
  sleep 1
done
