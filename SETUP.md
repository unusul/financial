# Cassetto – configuration and deployment

The code contains no keys: `index.html` holds the placeholders `__G_CLIENT__`, `__FB_KEY__`, `__FB_DB__`.
The workflow `.github/workflows/deploy.yml` replaces them when it deploys to GitHub Pages, taking the values from the
repository variables. A fork sets its own variables and uses its own projects, without touching the code.
An empty variable hides the sync backend that needs it (Firebase also needs the Google client ID).

| repository variable | content | where to find it |
|---|---|---|
| `GOOGLE_CLIENT_ID` | OAuth client ID (web application) | Google Cloud → APIs & Services → Credentials, in the client's project |
| `FB_API_KEY` | Firebase project `apiKey` | Firebase → Project settings → Web app |
| `FB_DATABASE_URL` | Realtime Database `databaseURL` | same as above, or at the top of the Realtime Database page |

None of them is a secret: they end up in the published page anyway. The data is protected by the database rules
and by the key restrictions (step 5).

## 1. Deploy with GitHub Actions
1. Repository → **Settings → Secrets and variables → Actions → Variables** → create the three variables in the table.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow runs on every push to `master`, or manually from **Actions → Deploy → Run workflow**.
   It publishes only `index.html`, `sw.js`, `manifest.webmanifest` and `icons/`.
4. After every app update, increment `VERSIONE` in `sw.js` so installed copies pick up the new version.

## 2. Firebase project
Firebase console → **Add project** (Analytics not needed).

## 3. Google sign-in
1. **Authentication** → Get started → **Sign-in method** → **Google** → Enable.
2. If the OAuth client lives in a different Google Cloud project (as it does for Cassetto): on the same page, under
   **Safelist client IDs from external projects**, add the value of `GOOGLE_CLIENT_ID` → **Save**.
   Without this step sign-in fails with `INVALID_IDP_RESPONSE`.
3. **Authentication** → **Settings** → **Authorized domains**: add the domain where the app is published.

## 4. Realtime Database
1. **Realtime Database** → Create database → location `europe-west1` → **locked mode**.
2. Open the published app, **Altro → Sincronizzazione** → cylinder button, and sign in with Google once: this creates
   your Firebase user. Then **Authentication → Users** → copy your **User UID**.
3. **Rules** tab: paste these rules with your UID and publish. Only the listed accounts can read or write; anyone else
   who signs in through the app (or calls the database with the public API key) gets *Permission denied*, so nobody
   else can fill your database. `d` (the compressed data) is capped at about 2 MB per save.

```json
{
  "rules": {
    "u": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid && $uid === 'YOUR_UID'",
        ".write": "auth != null && auth.uid === $uid && $uid === 'YOUR_UID'",
        "d": { ".validate": "newData.isString() && newData.val().length < 2000000" }
      }
    }
  }
}
```

To let another person use the same database, add their UID to both lines: `($uid === 'YOUR_UID' || $uid === 'OTHER_UID')`.

From the command line instead of the console (Node ≥ 20): `npx -y firebase-tools login`, then
`npx -y firebase-tools auth:export users.json --project <project id>` lists the users with their `localId` (the UID);
put the rules in `database.rules.json` next to a `firebase.json` containing
`{ "database": { "rules": "database.rules.json" } }` and run `npx -y firebase-tools deploy --only database --project <project id>`.
Delete `users.json` afterwards: it contains the accounts' emails.

## 5. Key restrictions
Google Cloud → `https://console.cloud.google.com/apis/credentials?project=<Firebase project id>` →
*Browser key (auto created by Firebase)*:
- **Application restrictions → Websites**: the app's domain, e.g. `https://<user>.github.io/*`.
- **API restrictions**: must include at least **Identity Toolkit API** and **Token Service API**
  (Firebase already adds them to the key it creates).

## 6. In the app
- **Altro → Sincronizzazione** shows two buttons: the cloud (Google Drive) and the cylinder (Firebase).
- One backend at a time: to switch, tap ✕ (disconnect), then the other button. Local data stays on the device and is merged with the new backend on the first sync.
- With Firebase you sign in with Google once per device; afterwards the app renews the session by itself, with no popups.
- The database stores the data compressed (about 175 KB for 9,886 transactions).
- Opening `index.html` locally, without the workflow, leaves the placeholders in place and the sync buttons hidden.
