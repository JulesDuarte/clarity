# Publishing the Clarity site

This is a plain static site — HTML, CSS, images, fonts. No build step, no server code.
On Netlify/Vercel the root URL (`/`) opens the **homepage** (`marketplace.html`) — this is
set by `netlify.toml` / `vercel.json`.

Pages: `marketplace.html` (Home) · `index.html` (Ingredients) · `invata.html` (Learn) · `product.html` (Product).

---

## Easiest — Netlify Drop (~1 minute, no account needed to start)

1. Open https://app.netlify.com/drop
2. Drag the whole **`clarity`** folder (or `clarity.zip`) onto the page.
3. You get a live URL instantly, e.g. `https://sunny-tas-123.netlify.app`.
4. To keep it and add a custom domain, create a free account when prompted, then
   Site settings → Domain management.

## Vercel (free CLI)

1. Install once: `npm i -g vercel`
2. In the `clarity` folder: `vercel` (accept the defaults — it detects a static site).
3. Publish to the live URL: `vercel --prod`

`vercel.json` is already included (enables clean URLs like `/product`).

## GitHub Pages

1. Put the **contents** of `clarity/` in a GitHub repo (the `.html` files at the repo root).
2. Repo → Settings → Pages → Source: your branch, `/ (root)` → Save.
3. Live at `https://<your-user>.github.io/<repo>/` in a minute.

Note: GitHub Pages ignores `netlify.toml`/`vercel.json`, so its root serves `index.html`
(the Ingredients page). If you use GitHub Pages and want the marketplace as the root,
ask me to make `marketplace.html` the `index.html` and I'll rewire the links.

---

Notes
- Body text uses Inter from Google Fonts (loads fine over HTTPS on any host);
  the display font (Victor Serif) ships with the site in `assets/fonts/`.
- Everything is relative-path, so it works from any subfolder or domain.
