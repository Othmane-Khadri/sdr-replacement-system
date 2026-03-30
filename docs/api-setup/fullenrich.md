# Setting Up FullEnrich

FullEnrich is the contact enrichment API. It finds verified email addresses and phone numbers from names + company data.

## Step 1: Create Your Account

Sign up at: https://fullenrich.com

## Step 2: Get Your API Key

1. Log into the FullEnrich Dashboard
2. Go to **API** section
3. Copy your API key

## Step 3: Add to .env

```bash
FULLENRICH_API_KEY=your_api_key_here
```

## Step 4: Verify Connection

```bash
source .env
curl -s "https://api.fullenrich.com/contact/enrich/bulk" \
  -H "Authorization: Bearer $FULLENRICH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contacts": [{"firstname": "Test", "lastname": "User", "domain": "example.com"}]}'
```

You should get an `enrichment_id` response.

## What FullEnrich Powers

| Skill | FullEnrich Feature Used |
|-------|----------------------|
| Contact Enrichment | Bulk email + phone lookup |

## How It Works

1. Submit contacts (name + company/domain + optional LinkedIn URL)
2. FullEnrich processes asynchronously (30s - 5min depending on batch size)
3. Poll for results until status = `completed`
4. Get back: verified emails, phone numbers, confidence scores

## Match Rates

- **With LinkedIn URL:** 70-85% email match rate
- **Without LinkedIn URL:** 50-65% email match rate
- **Phone numbers:** 30-50% match rate

Include LinkedIn URLs whenever possible for better results.

## Pricing

FullEnrich charges per contact enriched (typically $0.10-0.30/contact). Check their website for current pricing.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 401 Unauthorized | Check API key — use `Bearer` prefix |
| Poll timeout | Try smaller batch sizes (max 100 per request) |
| Low match rate | Include LinkedIn URLs — they significantly improve results |
| `failed` status | Contact FullEnrich support with the enrichment_id |
