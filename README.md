# Lizardware One-Click Deployment

This is the compiled Public Launcher for the Lizardware CMS. The core source code is proprietary and not included in this repository.

## Choose Your Deployment Path

Lizardware CMS leverages Cloudflare's Edge network, but Media Storage (images, uploads) can be handled in two ways depending on your preference and Cloudflare account setup.

### Path A: Lizardware CMS Starter (No Credit Card Required)
The frictionless starting point. This path removes Cloudflare R2 native bindings so you can deploy immediately on a free Cloudflare account without putting a credit card on file.
* **Storage:** You will use our built-in Cloudinary integration (or bring-your-own S3 keys) configured via the post-deploy setup wizard.
* **Trade-off:** Requires manually creating a free Cloudinary account and pasting your API keys during setup.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/lizardware/lizardware-oneclick/tree/main)

---

### Path B: Lizardware CMS Standard (Integrated R2)
The full-stack edge experience. Deploy with Cloudflare R2 natively bound to your project for zero-egress media storage directly on the edge.
* **Storage:** Native Cloudflare R2. Zero configuration required during the setup wizard.
* **Requirements:** A Cloudflare account with a valid payment method on file (Cloudflare requires this to prevent abuse before enabling R2, even though their free tier covers 10GB/month).

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/lizardware/lizardware-oneclick/tree/with-r2)

## Getting Started

1. Click one of the buttons above to clone and deploy the pre-compiled worker to your Cloudflare account.
2. The deployment wizard will automatically provision the required D1 Database and KV Namespaces.

---
**💡 Deployment Pro-Tip: Deploying Multiple Sites?**
During the Cloudflare deployment wizard, Cloudflare will suggest a default name for your D1 Database and KV Namespace. If you are deploying multiple instances of this CMS to the same Cloudflare account, simply edit the suggested names in the wizard text boxes to ensure they are unique (e.g., my-site-db).
