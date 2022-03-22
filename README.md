# Projet Anavevo

## Installation de postgresql:

### Windows
* Télécharger postgresql: https://www.postgresql.org/download/
* Installer postgresql via l'installeur
* Le mot de passe du superutilisateur postgres doit être un mot de passe fort, conservez le mot de passe précieusement, et ne pas le fournir à quiconque de non confiance
* Définir le numéro port de votre postgres si vous ne souhaitez pas le port par défaut 5432
* Une fois l'installation terminée, lancer pgAdmin
* Une fois dans l'interface pgAdmin, sur le navigateur à gauche, double-cliquer sur le serveur de la version postgresql désirée, et saisir le mot de passe renseigné du superutilisateur postgres au moment de l'installation
* Une fois connecté, faire un clic-droit sur Databases et cliquer sur Create > Database ...
* Choisir un nom pour la base de données puis valider
* Se placer au niveau des fichiers binaires de votre version de postgresql là où postgresql a été installé, en invite commande ou PowerShell:
`cd <cheminInstallation>PostgreSQL\14\bin` où cheminInstallation = `C:\ProgramFiles\` dans mon cas
* Effectuer le dump restore du fichier de base de données '20220221anavevo.db' qui est situé dans le répertoire du projet github: 
`psql.exe -U postgres -d databaseName -f <fileNameLocation>` où databaseName correspond au nom de la base de données créée précédemment et fileNameLocation = `C:\Projets\anavevo\20220221anavevo.db` dans mon cas, le mot de passe du superutilisateur postgres sera à renseigner pour valider le restore

### Debian
Debian possède en général un package de postgresql, qu'il faudra soit installer, soit mettre à jour.
* Etre connecté en `sudo su` via ligne de commande
* Pour vérifier si le paquet postgresql est présent `dpkg -l postgresql`
* Si le paquet n'est pas présent ou si la version de postgresql n'est pas celle désirée, alors suivre ces tâches 
    * Créer le fichier de configuration du repos `sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'` 
    * Importer la clé signée du repos `wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -`
    * Mettre à jour la liste des packages `sudo apt-get update`
    * Installer la dernière version de postgresql `sudo apt-get -y install postgresql` si vous souhaitez installer une version spécifique, il faudra utiliser `sudo apt-get -y install postgresql-<version>` où version correspond au numéro de version de postgresql désiré
* Pour vérifier le statut du paquet `dpkg -s postgresql`
* Si le paquet n'est pas installé, faire `apt-get update && apt-get upgrade postgresql`
* Pour voir l'état du service postgresql `systemctl status postgresql`
* Vérification version de postgresql installée `sudo -u postgres psql -c "SELECT version();"`
* Pour se connecter en tant que superutilisateur postgres `sudo -i -u postgres psql`
* Pour modifier le mot de passe de l'utilisateur postgres `\password` puis saisir 2 fois le mot de passe
* Créer la base de données toujours depuis psql `CREATE DATABASE <databasename>` où databasename est le nom de la base de données, puis faire exit
* En utilisateur root, lancer la commande suivante pour faire un restore de la base créée juste au-dessus via le fichier '20220221anavevo.db' c `psql -U postgres -h <localhost> -d <databaseName> -f <fileNameLocation>` où databaseName est le nom de la base de données, fileNameLocation est l'endroit où se trouve le fichier, pour mon cas, ça donne respectivement databaseName = anavevo_rec et fileNameLocation = /home/tahingpf/20220221anavevo.db

## Installation de python:
* Télécharger python: https://www.python.org/downloads/
* Installer python
* Installer pip: -m pip install --upgrade pip
* Installer tornado: python -m pip install tornado
* Installer psycopg2: -m pip install --upgrade psycopg2
* Installer PIL: -m pip install --upgrade pillow
* Installer TinyTag: -m pip install --upgrade tinytag
* Installer Requests: python -m pip install requests
* Installer SSL: python -m pip install pyOpenSSL

## Configuration du projet:
* Dans le répertoire Anavevo, éditer le fichier serv.py
* Mettre la bonne valeur du chemin dans les variables path et static_path

## Lancement du serveur:
* Se mettre à la racine du projet Anavevo en invite de commandes ou powershell
* Pour démarrer le serveur, taper la commande : python serv.py 

## Utilisation:
* Se rendre sur l'adresse qui a été configurée, à savoir localhost:8888/home


