
markdown

# Homebridge iMow Plugin

## Übersicht

Das Homebridge iMow Plugin ermöglicht die Integration von STIHL iMow Mährobotern in Homebridge. Mit diesem Plugin kannst du den Status deines Mähroboters überwachen und grundlegende Aktionen wie das Starten und Stoppen des Mähens sowie das Zurückkehren zur Ladestation über Apple HomeKit ausführen.

## Funktionen

- Anzeigen des aktuellen Status des Mähroboters (Mähen oder im Dock)
- Starten des Mähens über HomeKit
- Stoppen des Mähens und Zurückkehren zur Ladestation über HomeKit
- Anzeigen von Ladezustand und letzter Kontaktzeit

## Voraussetzungen

- Homebridge v1.3.4 oder höher
- Node.js v14.17.0 oder höher
- Python3 und Quart
- Ein STIHL iMow Mähroboter mit gültigem Benutzerkonto

## Installation

1. **Installiere Homebridge:**

   Folge der offiziellen [Homebridge Installationsanleitung](https://github.com/homebridge/homebridge/wiki).

2. **Klone das Repository und installiere die Abhängigkeiten:**

   ```sh
   cd ~
   git clone https://github.com/USERNAME/homebridge-imow.git
   cd homebridge-imow
   npm install

3. Kopiere das Projektverzeichnis in den globalen Node.js Modulpfad:
```'sh
sudo cp -r ~/homebridge-imow /usr/local/lib/node_modules/homebridge-imow
```

4. Starte den Quart-Server und starte Homebridge neu:
```sh
cd /usr/local/lib/node_modules/homebridge-imow
sudo python3 .\imow_server.py &
sudo systemctl restart homebridge
```

## Konfiguration
Öffne die config.json Datei deiner Homebridge Installation (üblicherweise in ~/.homebridge):
Füge die Plattform-Konfiguration hinzu:

```json

{
    "platforms": [
        {
            "platform": "HomebridgeIMow",
            "name": "iMow",
            "email": "DEINE_EMAIL@EXAMPLE.COM",
            "password": "DEIN_PASSWORT"
        }
    ]
}
```
Speichere die Datei, starte den Quart-Server und Homebridge neu:

```sh
cd /usr/local/lib/node_modules/homebridge-imow
sudo python3 .\imow_server.py &
sudo systemctl restart homebridge
```

Du kannst Quart automatisiert bei jedem Reboot per Cron neustarten. 
Eine .service Datei ist noch in Arbeit
```sh
sudo crontab -e
```
Füge diese Zeile hinzu. Achte auf die korrekte Bepfadung deiner Python3 Installation (which python3)
```sh
@reboot /usr/bin/python3 /usr/local/lib/node_modules/homebridge-imow/imow_server.py &
```

## Abhängigkeiten
- axios: ^0.21.1
- homebridge: ^1.3.4
- hap-nodejs: ^0.9.4
- Python3
- quart
- stihl-imow-webapi: (wird während der Installation des Plugins automatisch installiert)

## Nutzung
Nach der erfolgreichen Installation und Konfiguration sollte dein STIHL iMow Mähroboter in der Home-App auf deinem iOS-Gerät erscheinen. Du kannst den Mäher starten oder stoppen, indem du den Schalter in der Home-App betätigst.

## Entwicklung
Wenn du Änderungen an diesem Plugin vornehmen möchtest, kannst du das Repository klonen und Pull-Requests erstellen.

```sh
git clone https://github.com/USERNAME/homebridge-imow.git
```

## Lizenz
Dieses Projekt ist unter der MIT-Lizenz lizenziert. Siehe die LICENSE Datei für weitere Details.

Danksagungen
- [Homebridge](https://github.com/homebridge/homebridge)
- [STIHL iMow webAPI](https://github.com/ChrisHaPunkt/stihl-imow-webapi)

Wenn du Fragen oder Probleme hast, erstelle bitte ein Issue in diesem Repository.
