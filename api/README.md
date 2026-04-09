# API Form di contatto (Telegram)

La serverless **Vercel** `send-message` riceve il POST del form e invia il messaggio al tuo **Telegram** (Bot API).

## Cosa fare

1. **Deploy su Vercel**  
   Collega il repo a [Vercel](https://vercel.com); l’endpoint sarà:  
   `https://tuo-progetto.vercel.app/api/send-message`  
   Il frontend usa lo stesso dominio (`/api/send-message`). In locale, con solo `vite`, imposta nel file `.env`:  
   `VITE_CONTACT_API_URL=https://tuo-progetto.vercel.app/api/send-message`

2. **Variabili d’ambiente** (Vercel → Project → Settings → Environment Variables):

   | Nome                 | Descrizione |
   |----------------------|-------------|
   | `TELEGRAM_BOT_TOKEN` | Token del bot da [@BotFather](https://t.me/BotFather) |
   | `TELEGRAM_CHAT_ID`   | Il tuo `chat_id` (es. [@userinfobot](https://t.me/userinfobot)) |
   | `GITHUB_TOKEN`       | *(opzionale)* Per `/api/github-stars` |

3. **Telegram**  
   Crea un bot con @BotFather, **avvia una chat** con il bot (invia `/start`), poi imposta `TELEGRAM_CHAT_ID` con il tuo id utente (o id di un gruppo se il bot è nel gruppo).

Dopo il deploy, il form in **Contact** invia i messaggi su Telegram.

---

## API Statistiche (`/api/stats`)

Contatore visite sito, download CV, messaggi di contatto e **visite per card progetto** (hash Redis `portfolio_stats:project_visits`).

- **GET** `/api/stats` → `{ visits, cvDownloads, contacts, projectVisits }` dove `projectVisits` è tipo `{ "1": 42, "2": 10, ... }` (chiave = `id` progetto in `data.js`)
- **GET** `/api/stats?inc=visit` → incrementa le visite sito
- **GET** `/api/stats?inc=cv` → incrementa i download CV
- **GET** `/api/stats?inc=contact` → incrementa i messaggi inviati
- **GET** `/api/stats?inc=project&projectId=3` → incrementa le “views” del progetto con id `3`

## Stelle GitHub (`/api/github-stars`)

- **GET** `/api/github-stars?repos=owner/repo,owner/repo2` → JSON tipo `{ "MichelBranche/polterTV": 12, ... }` (stargazers da GitHub).
- Opzionale in Vercel: **`GITHUB_TOKEN`** (classic PAT senza scope per repo pubblici) per aumentare il limite di richieste all’API GitHub.

**Storage:** per `/api/stats` usa Redis (Vercel Storage → Redis / Upstash Redis).

- **Upstash Redis (consigliato se usi l’opzione Upstash in Storage):**
  - imposta automaticamente `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`
  - l’API usa `@upstash/redis`
- **Redis generico (es. RedisLabs):**
  - imposta `REDIS_URL` come connection string (es. `redis://default:...@host:port`)
  - l’API usa il client `redis`

Se Redis non è configurato, l’API risponde con `0, 0, 0` ma il sito continua a funzionare.
