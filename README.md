# AP2 Swipecards

Offlinefähige, mobile Lernkarten-App für die schriftliche AP2 FISI und WiSo. Die Karten sind neu formulierte Lerninhalte; sie enthalten keine Originalprüfungsaufgaben.

## Bedienung

- Karte antippen oder Leertaste: Vorder- und Rückseite drehen.
- Nach links wischen / `←`: **Noch lernen**.
- Nach rechts wischen / `→`: **Kann ich**.
- Der Browser speichert den Lernstand nur lokal auf dem Gerät.

## Auf dem iPhone installieren

Die App ist eine PWA und enthält Manifest sowie Service Worker. Sie benötigt zum Installieren eine HTTPS-Adresse, zum Beispiel GitHub Pages:

1. Das Repository zu GitHub pushen.
2. In GitHub unter **Settings → Pages** die veröffentlichte Pages-Adresse prüfen.
3. Nach dem Workflow-Lauf die GitHub-Pages-Adresse in Safari auf dem iPhone öffnen.
4. In Safari **Teilen → Zum Home-Bildschirm** wählen.

Die Karten und der Fortschritt funktionieren nach dem ersten Laden offline.

## Lernprioritäten

Die Reihenfolge „Schwächen zuerst“ bevorzugt offene und als unsicher markierte Karten. Die Karten sind zusätzlich mit einer transparenten Lernpriorität (hoch, mittel, ergänzend) versehen: Sie leitet sich aus den zentralen schriftlichen AP2-Bereichen, den Katalogänderungen ab Sommer 2025 und wiederkehrenden Themen in den vorhandenen Prüfungssätzen ab. Sie ist keine Prognose einzelner kommender Prüfungsfragen.

## Katalograhmen

Die App orientiert sich an den schriftlichen AP2-Bereichen Konzeption/Administration, Analyse/Entwicklung von Netzwerken und WiSo sowie an den öffentlich dokumentierten Katalogänderungen ab Sommer 2025 (u. a. RAID, SQL, UML/BPMN und KI). Der verbindliche Katalog ist kostenpflichtig; diese App ist eine Lernaufbereitung und ersetzt ihn nicht.

Die detaillierte Themenzuordnung steht in `KATALOG_ABDECKUNG.md`.
