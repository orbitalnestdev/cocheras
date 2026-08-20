#!/usr/bin/env bash
# Levanta el proyecto Cocheras en local.
# Uso:  ./run-local.sh
set -e

cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js no está instalado. Instalalo desde https://nodejs.org (v18 o superior)."
  exit 1
fi

echo "▸ Node $(node -v) · npm $(npm -v)"

if [ ! -d node_modules ]; then
  echo "▸ Instalando dependencias (la primera vez tarda un par de minutos)..."
  npm install
else
  echo "▸ Dependencias ya instaladas."
fi

echo ""
echo "▸ Levantando el servidor de desarrollo en http://localhost:3000"
echo "  (se abre solo en el navegador · Ctrl+C para frenar)"
echo ""

npm run dev
