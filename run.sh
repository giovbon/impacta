#!/usr/bin/env bash

# se for projeto novo, rode antes: npm install

PORT=${1:-8081}
WS_PORT=${2:-3001}

echo "🧹 Limpando processos antigos e liberando portas $PORT e $WS_PORT..."

if command -v fuser >/dev/null 2>&1; then
  fuser -k ${PORT}/tcp 2>/dev/null || true
  fuser -k ${WS_PORT}/tcp 2>/dev/null || true
fi

if command -v lsof >/dev/null 2>&1; then
  lsof -ti:${PORT} | xargs -r kill -9 2>/dev/null || true
  lsof -ti:${WS_PORT} | xargs -r kill -9 2>/dev/null || true
fi

sleep 0.5

echo "🚀 Iniciando Quartz na porta $PORT..."
exec npx quartz build --serve --port "$PORT" --ws-port "$WS_PORT"
