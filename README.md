# Twitch Panel — Achievements

Twitch panel extension with two tabs:

- **Leaderboard** — top 10 users on the channel (top 3 displayed as a podium)
- **My Stats** — personal achievement stats for the viewer on this channel

If the user does not exist in the system, a registration page with a link to the website is displayed.

## My Stats

- **Completed** — number of finished achievements / total
- **Total XP** — sum of rewards from completed achievements
- **In Progress** — achievements started but not finished
- **Completion** — completion rate in %

## Leaderboard

Top 10 of the channel, sorted by XP. Top 3 shown as a podium (gold, silver, bronze).

## Architecture

```
config.js    ← API URLs and site URL (only file to edit)
panel.html   ← panel page loaded by Twitch
panel.js     ← logic: tabs, API calls, rendering
```

## API

Calls use `userId` (viewer) and `channelId` (channel) provided by `twitch.onAuthorized()` from the [Twitch Extensions Helper](https://dev.twitch.tv/docs/extensions/reference/#onauthorized):

```js
twitch.onAuthorized(auth => {
    // auth.userId    = viewer ID (the person visiting the channel)
    // auth.channelId = channel ID (the streamer)
    // auth.token     = JWT signed by Twitch
});
```

The JWT is sent in the `Authorization: Bearer {token}` header on every request.

### Endpoints

1. **Check if user exists**:
   ```
   GET {USER_API}/{userId}
   ```
   - `200` → user exists
   - `404` → registration page shown

2. **Personal stats** (My Stats):
   ```
   GET {ACHIEVEMENT_API}/achievements/user/{userId}/channel/{channelId}
   ```

3. **Leaderboard** ⚠️ _endpoint to be created_:
   ```
   GET {ACHIEVEMENT_API}/achievements/channel/{channelId}/leaderboard?limit=10
   ```
   Expected response (sorted by XP descending):
   ```json
   [
     { "userId": "...", "username": "...", "xp": 150, "completed": 5 }
   ]
   ```

`ACHIEVEMENT_API`, `USER_API` and `SITE_URL` are defined in `config.js`.

## Deployment

1. Zip `config.js`, `panel.html` and `panel.js` **at the root** of the zip
2. Upload on the [Twitch Developer Console](https://dev.twitch.tv/console/extensions)
3. **Panel Viewer Path**: `panel.html`
4. **Allowlist**: add API and frontend domains

## Requirements

- The API must return CORS headers to allow origins matching `*.ext-twitch.tv`
- The API can verify the Twitch JWT using the extension's shared secret