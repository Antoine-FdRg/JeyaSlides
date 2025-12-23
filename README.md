# JeyaSlides

Ce repo contient le code source de JeyaSlides, un projet proposant un DSL permettant de créer des présentations de
manière simple et efficace.

## Technologies Utilisées

- Langium : pour la création du DSL.
- TypeScript : pour la génération du code

## Utilisation

Installer l'extension "Langium"

1. `npm i`

2. `npm run langium:generate`

3. `npm run build`

### Pour convertir un fichier

1. `cd .\demo`
2. `node ..\bin\cli generate .\generated\<file_name>.sml`

### Pour afficher une présentation

1. `cd .\demo\presentationexecutor`
2. `npm install` (à faire la première fois seulement)
3. `npm start <file_name>.html`

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
