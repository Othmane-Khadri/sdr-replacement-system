# Setting Up Unipile

Unipile is the LinkedIn automation API. It handles connection requests, DMs, profile lookups, and post scraping — all through a clean REST API with no browser extensions or session cookies.

## Step 1: Create Your Account

Sign up at: **https://www.unipile.com/?utm_source=partner&utm_campaign=Yalc**

## Step 2: Connect Your LinkedIn Account

1. Log into the Unipile Dashboard
2. Click **Connect Account** → **LinkedIn**
3. Follow the Hosted Auth flow (Unipile handles the LinkedIn OAuth)
4. Wait for the account status to show **OK**

## Step 3: Get Your API Credentials

1. In the Unipile Dashboard, go to **Settings** → **API**
2. Copy your **Access Token** → this is your `UNIPILE_API_KEY`
3. Note your **Base URL** (e.g., `https://api4.unipile.com:13443`) → this is your `UNIPILE_DSN`

## Step 4: Add to .env

```bash
UNIPILE_API_KEY=your_access_token_here
UNIPILE_DSN=https://api4.unipile.com:13443
```

## Step 5: Verify Connection

```bash
source .env
node scripts/unipile-cli.mjs status
node scripts/unipile-cli.mjs accounts
```

You should see your LinkedIn account listed with status `OK`.

## What Unipile Powers

| Skill | Unipile Feature Used |
|-------|---------------------|
| LinkedIn Engagement Scraper | Post reactions + comments API |
| Lead Qualifier (Gate 3) | Profile enrichment |
| Outreach Campaign | Connection requests + DMs |

## Rate Limits

- **30 connection requests/day** (LinkedIn's limit, enforced by the campaign skill)
- **2-second delay** between profile lookups (rate limit safety)
- Unipile handles LinkedIn's internal rate limiting transparently

## Pricing

Unipile plans start around $39/mo for individual use. Check their pricing page for current plans.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Account status `CREDENTIALS` | Re-authenticate: Dashboard → Account → Reconnect |
| `account not found` | Check that your LinkedIn account is connected and active |
| API timeout | Retry after 30 seconds — Unipile may be under load |
| 401 Unauthorized | API key expired — generate a new one in Dashboard |
