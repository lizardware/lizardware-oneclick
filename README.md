# Lizardware CMS
Welcome to your new Edge-powered Content Management System.

## 🚀 Getting Started
If you have just deployed this repository via Cloudflare, your infrastructure is provisioning!
1. Wait for the Cloudflare deployment pipeline to finish.
2. Navigate to your new `.workers.dev` URL.
3. Follow the on-screen Setup Wizard to initialize your database and create your Admin account.

## 💻 Local Development
Because this is a compiled distribution, local development requires the Wrangler CLI to emulate the Cloudflare Edge network.
1. Run `npm install`
2. Run `npm run deploy` to manually push updates to your Cloudflare Worker.
