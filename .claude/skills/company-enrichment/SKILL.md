---
name: company-enrichment
description: Search and enrich company data via the Crustdata API. Find companies by criteria or enrich a known company domain.
version: 1.0.0
---

# Company & People Enrichment (Crustdata)

Search for companies, enrich company profiles, and find people at companies using the Crustdata API.

## When This Skill Applies

- "find companies in [industry]"
- "enrich this company"
- "company search for [criteria]"
- "find decision makers at [company]"
- "search for people at [company]"
- "who are the founders of [company]"

## Authentication

| Variable | Purpose |
|----------|---------|
| `CRUSTDATA_API_KEY` | API Token from Crustdata dashboard |

Create your account at: https://crustdata.com

Load from `.env`:
```bash
source .env
```

## Capabilities

### 1. Company Search
Find companies matching criteria (industry, size, location, keywords).

### 2. Company Enrichment
Get full profile for a known company domain (headcount, funding, web traffic, etc.).

### 3. People Search
Find people by title, seniority, company, and location.

## Workflow

### Step 1: Validate Environment

```bash
source .env
```

Verify `CRUSTDATA_API_KEY` is set. If missing, direct user to create account.

### Step 2: Determine Action

Ask or infer what the user needs:

| User Says | Action |
|-----------|--------|
| "find companies in fintech" | Company Search |
| "enrich acme.com" | Company Enrichment |
| "find VPs of Sales at Acme" | People Search |

### Step 3a: Company Search

```bash
curl -s -X POST "https://api.crustdata.com/v1/companies/search" \
  -H "Authorization: Token $CRUSTDATA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "industry": "SaaS",
    "employee_range": "50-200",
    "location": "United States",
    "keywords": "sales automation",
    "limit": 50
  }'
```

**Available filters:**
- `industry` — Industry vertical (e.g., "SaaS", "Fintech", "HR Tech")
- `employee_range` — Size bracket (e.g., "5-50", "50-200", "200-500")
- `location` — Geographic area (e.g., "United States", "Europe")
- `keywords` — Keyword search across company descriptions
- `limit` — Max results (default: 50)

### Step 3b: Company Enrichment

```bash
curl -s "https://api.crustdata.com/v1/companies/enrich?domain=acme.com" \
  -H "Authorization: Token $CRUSTDATA_API_KEY"
```

**Returns:**
- Company name, website, description
- Industry, founded year
- Employee count, location, headquarters
- Funding stage, funding amount
- LinkedIn URL

### Step 3c: People Search

```bash
curl -s -X POST "https://api.crustdata.com/v1/people/search" \
  -H "Authorization: Token $CRUSTDATA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "VP Sales",
    "company_domain": "acme.com",
    "seniority": "VP",
    "location": "United States",
    "limit": 25
  }'
```

**Available filters:**
- `title` — Job title keyword (e.g., "VP Sales", "Founder")
- `company_domain` — Company website domain
- `seniority` — Level (e.g., "C-Level", "VP", "Director", "Manager")
- `location` — Geographic area
- `limit` — Max results (default: 50)

### Step 4: Present Results

Display as a formatted table:

**For companies:**
| # | Company | Website | Industry | Employees | Location | Funding |
|---|---------|---------|----------|-----------|----------|---------|

**For people:**
| # | Name | Title | Company | LinkedIn | Location | Seniority |
|---|------|-------|---------|----------|----------|-----------|

### Step 5: Save Output

Save to:
```
./output/crustdata_{search_type}_{YYYY-MM-DD_HHMM}.json
```

Also offer CSV export.

### Step 6: Next Steps

Suggest:
- "Qualify these leads" (for people results)
- "Find decision makers at these companies" (for company results)
- "Enrich contact info with FullEnrich" (for people results)

## Credit Awareness

Crustdata charges per API call. Before large searches:
- Company search: ~1 credit per call
- Company enrichment: 1-4 credits per company
- People search: ~3 credits per 100 results

Always inform the user of estimated credit cost before executing.

## Error Handling

| Error | Fix |
|-------|-----|
| `CRUSTDATA_API_KEY` not set | Add to `.env` — get key at https://crustdata.com |
| 401 Unauthorized | API key expired or invalid |
| 429 Rate Limit | Wait 60 seconds, retry |
| Empty results | Broaden search criteria |
