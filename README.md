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
panel.html   ← page du panneau chargée par Twitch
panel.js     ← logique : appel API + rendu des stats
```

## API

L'appel se fait dynamiquement via le `channelId` fourni par Twitch :

```
GET https://achievement-management-dev-54587681968.europe-west1.run.app/achievements/channel/{channelId}
```

## Déploiement

1. Zipper `panel.html` et `panel.js` **à la racine** du zip
2. Uploader sur le [Twitch Developer Console](https://dev.twitch.tv/console/extensions)
3. **Panel Viewer Path** : `panel.html`
4. **Allowlist** : ajouter le domaine de l'API et du front

## Prérequis

L'API doit renvoyer les headers CORS (`Access-Control-Allow-Origin`) pour autoriser les requêtes depuis l'origin de l'extension Twitch.
