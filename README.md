# anavevo
Project Anavevo

Installation de postgresql:
-Télécharger postgresql: https://www.postgresql.org/download/
-Installer postgresql
-Définir un port et un mdp admin
-Créer la base de donnée
-Se placer au niveau des fichiers binaires de postgresql:
cd C:\ProgramFiles\PostgreSQL\14\bin
-Effectuer le dump restore de la bdd en invite commande: 
psql.exe -U postgres -d databaseName -f C:\<fileNameLocation>

Installation de python:
-Télécharger python: https://www.python.org/downloads/
-Installer python
-Installer pip: -m pip install --upgrade pip
-Installer tornado: python -m pip install tornado
-Installer psycopg2: -m pip install --upgrade psycopg2
-Installer PIL: -m pip install --upgrade pillow
-Installer TinyTag: -m pip install --upgrade tinytag
-Installer Requests: python -m pip install requests
-Installer SSL: python -m pip install pyOpenSSL

Configuration du projet:
-Dans le répertoire Anavevo, éditer le fichier serv.py
-Mettre la bonne valeur du chemin dans les variables path et static_path

Lancement du serveur:
-Se mettre à la racine du projet Anavevo en invite de commandes ou powershell
-Pour démarrer le serveur, taper la commande : python serv.py 

Utilisation:
-Se rendre sur l'adresse qui a été configurée, à savoir localhost:8888/home


