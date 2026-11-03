# Cassetto su GitHub Pages – guida passo passo

Contenuto di questa cartella: `index.html` (l'app), `manifest.webmanifest`, `sw.js`, `icons/`, `.nojekyll`.
NON mettere qui la cartella `dati/` e non caricare mai i tuoi movimenti su GitHub: il repository sarà pubblico.

## 1. Account e repository
1. Vai su https://github.com e crea un account gratuito (o accedi).
2. In alto a destra: **+ > New repository**.
3. Nome: per esempio `cassetto`. Visibilità: **Public** (GitHub Pages gratuito la richiede).
   Lascia deselezionato "Add a README". Clicca **Create repository**.

## 2. Carica i file
1. Nella pagina del repository vuoto clicca **uploading an existing file**.
2. Trascina dentro TUTTO il contenuto di questa cartella: `index.html`, `manifest.webmanifest`, `sw.js`,
   la cartella `icons` e il file `.nojekyll` (se il sistema lo nasconde, crealo dopo con
   **Add file > Create new file**, nome `.nojekyll`, contenuto vuoto).
3. Clicca **Commit changes**.

## 3. Attiva Pages
1. Nel repository: **Settings > Pages**.
2. Sotto "Build and deployment": Source = **Deploy from a branch**; Branch = **main**, cartella **/ (root)**; **Save**.
3. Dopo 1–2 minuti, in cima alla stessa pagina compare l'indirizzo:
   `https://TUONOME.github.io/cassetto/`

## 4. Primo avvio e installazione
- **Android (Chrome):** apri l'indirizzo > menu ⋮ > **Installa app** (o "Aggiungi a schermata Home").
- **iPhone (Safari):** pulsante Condividi > **Aggiungi alla schermata Home**.
- **PC (Chrome/Edge):** icona di installazione nella barra dell'indirizzo.
- Poi in Altro > import carica il tuo `dati_puliti.json` (o il `.backup` di Financisto).
  I dati restano nel browser di quel dispositivo: finché non c'è la sincronizzazione, PC e cellulare sono separati.

## 5. Aggiornare l'app in futuro
1. Nel repository apri `index.html` > matita (Edit) oppure **Add file > Upload files** per sostituirlo.
2. Apri `sw.js` e cambia `cassetto-v1` in `cassetto-v2` (poi v3, ...) così i dispositivi scaricano la nuova versione.
3. Commit. In 1–2 minuti l'app online è aggiornata.

## 6. Prossimo passo: Google Drive
L'indirizzo `https://TUONOME.github.io` servirà come "origine JavaScript autorizzata" nell'ID client OAuth
di Google Cloud. Quando l'avrai attivo, ti preparo la guida per il progetto Google Cloud e il codice di sincronizzazione.
