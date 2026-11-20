#!/usr/bin/env bash
# Genera dist/taqueria-server.exe: el servidor de sincronización en red
# empaquetado para Windows (doble clic, sin instalar Node.js).
#
# Requiere Node.js y npm en la máquina que compila.
# El exe es un binario: NO se sube a GitHub (queda en dist/, ignorado
# por .gitignore). En la computadora de la taquería va junto a
# index.html; data.json y data.json.bak se crean junto al exe.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p dist
npx --yes @yao-pkg/pkg server.js --targets node22-win-x64 --output dist/taqueria-server.exe
echo "Listo: dist/taqueria-server.exe"
echo "Copia el exe junto a index.html en la computadora de la taquería."
