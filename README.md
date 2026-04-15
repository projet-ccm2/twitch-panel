# Twitch Panel — Achievements Stats

Panneau Twitch qui affiche les statistiques des succès (achievements) d'une chaîne.

## Stats affichées

- **Total** — nombre total de succès
- **Actifs** — succès actifs
- **Visibles** — succès publics
- **Cachés** — succès secrets

+ lien vers le site principal.

## Architecture

```
config.js    ← URLs de l'API et du site (seul fichier à modifier)
panel.html   ← page du panneau chargée par Twitch
panel.js     ← logique : appel API + rendu des stats
```

## API

L'appel se fait dynamiquement via le `channelId` fourni par le callback `twitch.onAuthorized()` du [Twitch Extensions Helper](https://dev.twitch.tv/docs/extensions/reference/#onauthorized) :

```js
twitch.onAuthorized(auth => {
    // auth.channelId = l'ID numérique de la chaîne
});
```

Endpoint appelé :

```
GET {API_BASE}/achievements/channel/{channelId}
```

`API_BASE` est défini dans `config.js`.

## Déploiement

1. Zipper `config.js`, `panel.html` et `panel.js` **à la racine** du zip
2. Uploader sur le [Twitch Developer Console](https://dev.twitch.tv/console/extensions)
3. **Panel Viewer Path** : `panel.html`
4. **Allowlist** : ajouter le domaine de l'API et du front

## Prérequis

L'API doit renvoyer les headers CORS (`Access-Control-Allow-Origin`) pour autoriser les requêtes depuis l'origin de l'extension Twitch.
