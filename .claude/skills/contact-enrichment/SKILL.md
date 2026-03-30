---
name: contact-enrichment
description: Enrich contacts with email addresses and phone numbers via the FullEnrich API. Bulk or single enrichment.
version: 1.0.0
---

# Contact Enrichment (FullEnrich)

Find verified email addresses and phone numbers for your leads using the FullEnrich API.

## When This Skill Applies

- "enrich emails for these leads"
- "find email addresses"
- "get phone numbers for these contacts"
- "run FullEnrich on this list"
- "enrich contact info"
- "find contact details"

## Authentication

| Variable | Purpose |
|----------|---------|
| `FULLENRICH_API_KEY` | API key from FullEnrich dashboard |

Create your account at: https://fullenrich.com

Load from `.env`:
```bash
source .env
```

## What This Skill Does

Takes a list of contacts (name + company or LinkedIn URL) and returns:
- Verified email addresses (with verification status)
- Phone numbers (when available)
- Enrichment confidence level

## Workflow

### Step 1: Validate Environment

```bash
source .env
```

Verify `FULLENRICH_API_KEY` is set.

### Step 2: Prepare Contact List

Accept input from:
- A JSON file from a previous skill (e.g., `./output/crustdata_people_*.json`)
- A CSV file the user provides
- Manual input (name + company)

Each contact needs at minimum:
```json
{
  "firstname": "Jane",
  "lastname": "Doe",
  "domain": "acme.com",
  "company_name": "Acme Corp",
  "linkedin_url": "https://linkedin.com/in/janedoe"
}
```

`linkedin_url` improves match rate. `domain` or `company_name` required.

### Step 3: Submit Bulk Enrichment

```bash
curl -s -X POST "https://api.fullenrich.com/contact/enrich/bulk" \
  -H "Authorization: Bearer $FULLENRICH_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": [
      {
        "firstname": "Jane",
        "lastname": "Doe",
        "domain": "acme.com",
        "linkedin_url": "https://linkedin.com/in/janedoe"
      }
    ]
  }'
```

Returns an `enrichment_id` for polling.

### Step 4: Poll for Results

FullEnrich processes contacts asynchronously. Poll with exponential backoff:

```bash
curl -s "https://api.fullenrich.com/bulk/{enrichment_id}" \
  -H "Authorization: Bearer $FULLENRICH_API_KEY"
```

**Status values:**
- `processing` — Still working. Wait and retry.
- `completed` — Results ready.
- `failed` — Something went wrong.

**Polling schedule:** 1s → 2s → 4s → 8s → 16s → 30s (max). Timeout after 5 minutes.

### Step 5: Present Results

Display enrichment results:

| # | Name | Company | Email | Email Status | Phone | LinkedIn |
|---|------|---------|-------|-------------|-------|----------|

Show match rates:
- Emails found: X/Y (Z%)
- Phones found: A/Y (B%)
- Verified emails: C/X (D%)

### Step 6: Save Output

Save to:
```
./output/fullenrich_{YYYY-MM-DD_HHMM}.json
```

Also offer CSV export with columns: `firstName`, `lastName`, `company`, `email`, `emailStatus`, `phone`, `linkedinUrl`.

### Step 7: Next Steps

Suggest:
- "Qualify these enriched leads"
- "Launch an outreach campaign with these contacts"
- "Export to Notion CRM"

## Single Contact Enrichment

For one contact, same API — just submit a single-item array. Useful for quick lookups:
```
"Enrich jane@acme.com" → Submit single contact → Return immediately
```

## Cost Awareness

FullEnrich charges per contact enriched (typically $0.10-0.30 per contact). Before large batches:
1. Count total contacts
2. Estimate cost: contacts × ~$0.15
3. Confirm with user before proceeding

## Error Handling

| Error | Fix |
|-------|-----|
| `FULLENRICH_API_KEY` not set | Add to `.env` |
| 401 Unauthorized | API key expired or invalid |
| Poll timeout (5 min) | Batch may be too large — try smaller batches |
| Low match rate | Ensure LinkedIn URLs are included — they significantly improve match rates |
