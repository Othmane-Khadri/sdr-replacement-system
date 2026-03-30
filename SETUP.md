# Setup Guide

Get the SDR Replacement System running in under 10 minutes.

## Prerequisites

- [Claude Code](https://claude.ai/claude-code) installed (CLI)
- Node.js 18+ installed (`node --version` to check)
- A LinkedIn account

## Step 1: Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/sdr-replacement-system.git
cd sdr-replacement-system
mkdir -p output
```

## Step 2: Create API Accounts

You need 3 API keys (4th is optional):

### 1. Unipile — LinkedIn Automation

Sign up: **REFERRAL_LINK_HERE**

1. Create account → Connect your LinkedIn via Hosted Auth
2. Get your **Access Token** and **Base URL** from Settings → API

### 2. Crustdata — Company & People Intelligence

Sign up: **REFERRAL_LINK_HERE**

1. Create account
2. Get your **API Token** from the API Keys section

### 3. FullEnrich — Email & Phone Enrichment

Sign up: https://fullenrich.com

1. Create account
2. Get your **API Key** from the API section

### 4. Notion (Optional) — CRM Layer

1. Go to https://www.notion.so/my-integrations
2. Create a new integration
3. Copy the **Internal Integration Token**
4. Share your leads database with the integration

## Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your API keys:

```bash
# Required
UNIPILE_API_KEY=your_unipile_access_token
UNIPILE_DSN=https://api4.unipile.com:13443

# Required for company search
CRUSTDATA_API_KEY=your_crustdata_token

# Required for contact enrichment
FULLENRICH_API_KEY=your_fullenrich_key

# Optional — for Notion CRM integration
NOTION_API_KEY=ntn_your_integration_token
```

## Step 4: Verify Setup

```bash
chmod +x scripts/setup-check.sh
./scripts/setup-check.sh
```

This checks each API connection and reports status.

## Step 5: Open Claude Code

```bash
claude
```

Claude Code will automatically detect the skills in `.claude/skills/`. Start with:

```
"Scrape this LinkedIn post: https://linkedin.com/posts/..."
```

## Detailed API Setup Guides

- [Unipile setup](docs/api-setup/unipile.md)
- [Crustdata setup](docs/api-setup/crustdata.md)
- [FullEnrich setup](docs/api-setup/fullenrich.md)
- [Notion setup](docs/api-setup/notion-mcp.md)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `node: command not found` | Install Node.js 18+: https://nodejs.org |
| `claude: command not found` | Install Claude Code: https://claude.ai/claude-code |
| Setup check fails for an API | Check the specific API's setup guide above |
| Skills not triggering | Make sure you're running Claude Code from the repo root |
