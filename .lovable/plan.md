Yeh site TanStack Start + Nitro SSR pe bani hai. `npm run build` do cheezein generate karta hai:

- `dist/index.html` — static client assets (SPA fallback). Agar tera server sirf static files serve karta hai toh yeh use hota hai, lekin SSR, server functions (API routes), aur SEO-friendly first render nahi milega.
- `.output/server/index.mjs` — yeh Nitro SSR server hai. Isme server functions, API routes, auth sessions, SSR sab handle hote hain. Node.js/Docker capable server ke liye yeh wala output use karna hai.

Lovable ka default build target Cloudflare Worker hota hai. Tera Webyne server Node.js/Docker hai, isliye build target ko Node.js preset mein switch karna hoga, tab `.output/server/index.mjs` directly `node` se run hoga.

Plan:

1. Node.js build target configure karna
   - `vite.config.ts` mein Nitro preset ko `node` (ya env-based) set karna taaki self-host output Node-compatible bane.
   - Saath mein Lovable Cloud publish na toote, isliye ek alag `build:node` script ya env-driven config rakhna.

2. Production build scripts add karna
   - `package.json` mein scripts: `build:node`, `start` (node .output/server/index.mjs), `serve`.

3. Docker setup banana (optional lekin recommended)
   - `Dockerfile` jo Node 22 base use kare, build kare, aur sirf `.output` copy kare.
   - `docker-compose.yml` jisme env vars aur port mapping ho.

4. Reverse proxy + SSL config
   - Nginx config snippet: upstream `localhost:3000`, domain, SSL via Certbot/Let's Encrypt, gzip, static asset caching.

5. Process manager / service file
   - PM2 ecosystem file (`ecosystem.config.cjs`) ya systemd service file for persistent server process.

6. Env & secrets checklist
   - Production `.env` mein `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server side), `CLIENT_CREDS_ENC_KEY` (agar client portal use hota hai), etc.
   - `.env` ko server pe secure rakhna, git mein nahi dalna.

7. Deploy steps
   - Local: `bun run build:node` (ya `npm run build:node`).
   - Server pe `.output` copy karo (rsync/tar/zip).
   - Env vars configure karo.
   - `node .output/server/index.mjs` ya Docker se chalao.
   - Nginx reverse proxy + SSL lagao.
   - PM2/systemd se restart on crash configure karo.

8. Verify
   - Home page SSR se load ho rahi hai.
   - Server functions (contact forms, admin APIs, auth callbacks) respond kar rahe hain.
   - Logs PM2/systemd mein capture ho rahe hain.

Deliverables after approval:
- Updated `vite.config.ts` / `package.json` with Node build target
- `Dockerfile` + `docker-compose.yml`
- Nginx config snippet
- PM2 ecosystem / systemd service file
- Short deployment guide
