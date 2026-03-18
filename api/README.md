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

4. **Telegram**  
   Crea un bot con @BotFather, avvia una chat con il bot, poi usa @userinfobot per ottenere il tuo `chat_id` e inseriscilo in `TELEGRAM_CHAT_ID`.

Dopo il deploy e la configurazione, il form invierà i messaggi sia alla mail che al tuo profilo Telegram.

---

## API Statistiche (`/api/stats`)

Contatore visite, download CV e messaggi di contatto inoltrati.

- **GET** `/api/stats` → restituisce `{ visits, cvDownloads, contacts }`
- **GET** `/api/stats?inc=visit` → incrementa le visite e restituisce i conteggi
- **GET** `/api/stats?inc=cv` → incrementa i download CV
- **GET** `/api/stats?inc=contact` → incrementa i messaggi inviati

**Storage:** usa Redis (Vercel Storage → Redis / Upstash Redis).

- **Upstash Redis (consigliato se usi l’opzione Upstash in Storage):**
  - imposta automaticamente `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`
  - l’API usa `@upstash/redis`
- **Redis generico (es. RedisLabs):**
  - imposta `REDIS_URL` come connection string (es. `redis://default:...@host:port`)
  - l’API usa il client `redis`

Se Redis non è configurato, l’API risponde con `0, 0, 0` ma il sito continua a funzionare.
