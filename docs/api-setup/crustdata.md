# Setting Up Crustdata

Crustdata is the company and people intelligence API. It provides company search, enrichment, and people search across 200M+ companies and 800M+ profiles.

## Step 1: Create Your Account

Sign up at: **https://crustdata.com**

## Step 2: Get Your API Key

1. Log into the Crustdata Dashboard
2. Go to **API Keys** section
3. Generate a new API key
4. Copy the token

## Step 3: Add to .env

```bash
CRUSTDATA_API_KEY=your_api_token_here
```

## Step 4: Verify Connection

```bash
source .env
curl -s "https://api.crustdata.com/v1/credits" \
  -H "Authorization: Token $CRUSTDATA_API_KEY" | python3 -m json.tool
```

You should see your credit balance.

## What Crustdata Powers

| Skill | Crustdata Feature Used |
|-------|----------------------|
| Company Enrichment | Company search + enrichment |
| Lead Qualifier (Gate 5) | Company verification (optional) |

## Key Capabilities

- **Company Search:** Find companies by industry, size, location, keywords
- **Company Enrichment:** Get headcount, funding, web traffic, LinkedIn data for a domain
- **People Search:** Find decision makers by title, seniority, company

## Credit System

Crustdata charges credits per API call:

| Action | Credits |
|--------|---------|
| Company identify (free) | 0 |
| Company enrichment | 1-4 |
| People search (DB) | 3 per 100 |
| People enrichment | 2-5 |

**Best practice:** Always check credits before large batch operations.

## Pricing

Plans start around $25/mo. Check their website for current pricing.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 401 Unauthorized | Check API key is correct — use `Token` prefix in Authorization header |
| 429 Rate Limit | Wait 60 seconds, retry |
| Empty results | Broaden search filters or try different keywords |
| Low credit balance | Top up credits in the dashboard |
