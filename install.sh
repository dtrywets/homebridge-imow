#!/bin/bash

# Prüfen, ob Python3 und Pip installiert sind
command -v python3 &>/dev/null || { echo "Python3 ist nicht installiert."; exit 1; }
command -v pip &>/dev/null || { echo "Pip ist nicht installiert."; exit 1; }

# Klonen des Python-Repositories
if [ ! -d "stihl-imow-webapi" ]; then
    echo "Klonen des stihl-imow-webapi Repositories..."
    git clone https://github.com/ChrisHaPunkt/stihl-imow-webapi.git
    cd stihl-imow-webapi
    echo "Installiere die stihl-imow-webapi und ihre Python-Abhängigkeiten..."
    pip install -e .
else
    echo "stihl-imow-webapi ist bereits installiert."
fi

# Installieren von Flask, falls noch nicht installiert
pip show flask &>/dev/null || {
    echo "Installiere Flask..."
    pip install flask
    pip install "flask[async]"
    pip install quart
}


# Installieren von Node.js-Abhängigkeiten, falls noch nicht installiert
echo "Installiere Node.js-Abhängigkeiten..."
npm install axios  # Stellen Sie sicher, dass dieses Skript im Verzeichnis des Node.js-Projekts ausgeführt wird, wo die package.json vorhanden ist

echo "Installation abgeschlossen."
