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
# --public-packages "*" + --public: NO embeber bytecode V8 en el exe.
# Sin esto, al compilar en Linux para Windows, pkg incrusta bytecode del
# V8 anfitrión que el binario de Windows rechaza al arrancar ("V8 rejected
# the bytecode cache") y el exe no hace nada. --public-packages "*" cubre
# los paquetes, pero el ARCHIVO DE ENTRADA (server.js) también necesita
# --public para ir como texto plano; si no, server.js sigue como bytecode
# y Windows lo rechaza igual. Con ambos, todo el código va como texto y
# el exe arranca en cualquier plataforma.
npx --yes @yao-pkg/pkg server.js --targets node22-win-x64 --output dist/taqueria-server.exe --public-packages "*" --public
echo "Listo: dist/taqueria-server.exe"
echo "Copia el exe junto a index.html en la computadora de la taquería."
