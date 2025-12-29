# JeyaSlides

Ce repo contient le code source de JeyaSlides, un projet proposant un DSL permettant de créer des présentations de
manière simple et efficace.

## Technologies Utilisées

- Langium : pour la création du DSL.
- TypeScript : pour la génération du code

## Utilisation

1. Installer les dépendances du projet :
`npm i`

2. Générer les fichiers Langium (AST, services, etc.) et compiler le projet TypeScript : `npm run langium:full-build`

Cette commande regroupe :

- La génération des fichiers Langium à partir de la grammaire (`npm run langium:generate`)

- La compilation du projet TypeScript (`npm run build`)

Elle doit être relancée à chaque modification de la grammaire du DSL.


### Pour afficher une présentation générée



### Génération de slides à partir d'un fichier .sml

Un script est fourni pour automatiser la génération d’un fichier HTML à partir d’un fichier .sml et lancer
directement le serveur Reveal.js (compatible avec Linux, macOS & Git Bash).

Depuis le dossier scripts, exéctuer la commande suivante :

`./run-demo.sh <file_name>` 

Ce script :
- génère le fichier HTML à partir du fichier .sml
- démarre le serveur Reveal.js
- affiche la présentation correspondante

Pour faire la même chose manuellement, il faut suivre les étapes suivantes : 
- Convertir le fichier
    1. `cd .\demo`
    2. `node ..\bin\cli generate .\<file_name>.sml`
- Afficher la présentation générée
    1. `cd .\demo\presentationexecutor`
    2. `npm install` (à faire la première fois seulement)
    3. `npm start ./generated/<file_name>.html`


### Utiliser l'extension VSCode

1. Ouvrir le fichier out/extension.js
2. Appuyer sur la touche F5 et sélectionner "VSCode Extension developpement" si c'est demandé

-> Un VSCode avec l'extension s'ouvre

## Architecture du projet

### Langium

Le dossier `src/` contient les fichiers nécessaires à la définition du DSL et à la génération de code.

### Demo

#### Source

Le dossier `demo/sml` contient les fichiers `.sml`

#### Génération

Le dossier `demo/presentationexecutor` contient les fichiers générés à partir des fichiers `.sml`. On peut les afficher
en utilisant reveal.js. avec la commande suivante dans le dossier `demo/presentationexecutor` :

```
npm start <chemin_du_fichier>.html
```

## Contributors

- Antoine Fadda Rodriguez
- Jessica Kahungu
- Yannick Ascari
- Emma Allain
