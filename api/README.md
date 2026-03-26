# API Form di contatto (Email + Telegram)

Questa cartella contiene la serverless **Vercel** che riceve il messaggio del form, lo invia alla tua email (Resend) e al tuo Telegram.

## Cosa fare

1. **Deploy su Vercel**  
   Collega il repo a [Vercel](https://vercel.com); l’endpoint sarà tipo:  
   `https://tuo-progetto.vercel.app/api/send-message`

2. **In `data.js`** imposta l’URL dell’API:
   ```js
   const contactFormApiUrl = 'https://tuo-progetto.vercel.app/api/send-message'
   ```

3. **Variabili d’ambiente** (Vercel → Project → Settings → Environment Variables):

   | Nome                 | Descrizione |
   |----------------------|-------------|
   | `RESEND_API_KEY`     | API key da [resend.com](https://resend.com) (invio email) |
   | `TO_EMAIL`           | Email dove ricevere i messaggi (es. `michel.lavoro@gmail.com`) |
   | `FROM_EMAIL`         | Mittente (per test: `onboarding@resend.dev`; in produzione usa un dominio verificato su Resend) |
   | `TELEGRAM_BOT_TOKEN` | Token del bot da [@BotFather](https://t.me/BotFather) su Telegram |
   | `TELEGRAM_CHAT_ID`   | Il tuo chat_id (scrivendo a [@userinfobot](https://t.me/userinfobot) te lo dice) |
   | `GITHUB_TOKEN`       | *(opzionale)* Per `/api/github-stars`: più richieste/ora verso l’API GitHub (repo pubblici: PAT senza scope) |

4. **Telegram**  
   Crea un bot con @BotFather, avvia una chat con il bot, poi usa @userinfobot per ottenere il tuo `chat_id` e inseriscilo in `TELEGRAM_CHAT_ID`.

Dopo il deploy e la configurazione, il form invierà i messaggi sia alla mail che al tuo profilo Telegram.

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
