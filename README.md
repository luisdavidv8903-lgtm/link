# DELIVERYLINK LLC — Company Website

React + Vite + Tailwind CSS website with Claude-powered AI chat widget.

## Local Development

```bash
npm install
cp .env.example .env
# Edit .env and add your Anthropic API key
npm run dev
```

## Deploy to Cloudflare Pages

### 1. Create GitHub Repository

```bash
cd deliverylink-website
git init
git add .
git commit -m "Initial commit — DELIVERYLINK website"
gh repo create deliverylink-website --private --source=. --push
```

### 2. Connect Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create**
2. Select **Pages** → **Connect to Git**
3. Authorize GitHub and select the `deliverylink-website` repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** 18 (or latest LTS)
5. Click **Save and Deploy**

### 3. Add Environment Variable

1. In Cloudflare Pages → your project → **Settings** → **Environment variables**
2. Add variable:
   - **Name:** `VITE_ANTHROPIC_API_KEY`
   - **Value:** your Anthropic API key (`sk-ant-api03-...`)
3. Set for **Production** and **Preview** environments
4. Trigger a new deployment for the variable to take effect

### 4. Custom Domain (deliverylinktech.com)

1. Go to project → **Custom domains** → **Set up a custom domain**
2. Enter `deliverylinktech.com`
3. Follow DNS instructions (add CNAME record pointing to your Pages project)
4. Also add `www.deliverylinktech.com` as a redirect

## Tech Stack

- **React 18** + **Vite 4**
- **Tailwind CSS 3** for styling
- **Lucide React** for icons
- **Claude API** (claude-sonnet-4-6) for AI chat widget
- **Cloudflare Pages** for hosting
