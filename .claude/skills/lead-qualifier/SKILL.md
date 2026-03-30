---
name: lead-qualifier
description: Qualify and score leads through a 7-gate waterfall pipeline. Minimizes API calls by filtering cheap signals first.
version: 1.0.0
---

# Lead Qualification Pipeline

Score and qualify leads through a 7-gate waterfall pipeline. Cheap filters first, expensive API calls last — only pre-qualified leads hit the enrichment API.

## When This Skill Applies

- "qualify these leads"
- "score these prospects"
- "run the qualification pipeline"
- "ICP check these"
- "who should I reach out to"
- "qualify latest"

## Authentication

| Variable | Purpose |
|----------|---------|
| `UNIPILE_API_KEY` | For LinkedIn profile enrichment (Gate 3) |
| `UNIPILE_DSN` | Unipile base URL |

Load from `.env`:
```bash
source .env
```

## What This Skill Does

Runs leads through a 7-gate waterfall:
- **Gates 0-2** (free): dedup, headline pre-qualification, exclusion — NO API calls
- **Gate 3** (expensive): Unipile LinkedIn enrichment — only for leads surviving Gates 0-2
- **Gates 4-5** (free): country + role fit, company qualification
- **Gate 5.5** (optional): Signal research via web search
- **Gate 6** (free): final scoring + tagging

Output: scored leads with tier (Hot/Warm/Monitor/Disqualified), confidence level, and tags.

## Workflow

### Step 1: Validate Environment

```bash
source .env
node scripts/unipile-cli.mjs accounts
```

Get the LinkedIn `account_id`. If Unipile is not configured, warn user — enrichment will be skipped (lower confidence scores).

### Step 2: Identify Input Source

Detect or ask which source to process:

| Source | Files |
|--------|-------|
| Scraper output | `./output/linkedin_scrape_*.json` |
| CSV / JSON | User-provided file path |
| Crustdata output | `./output/crustdata_people_*.json` |

If user says "qualify latest" — check `./output/` for the most recent file.

### Step 3: Load and Normalize Leads

Read the source file. Normalize to:

```json
{
  "name": "Jane Doe",
  "profile_url": "https://linkedin.com/in/janedoe",
  "profile_slug": "janedoe",
  "headline": "VP Sales at Acme Corp",
  "company": "Acme Corp",
  "title": "VP Sales",
  "location": "San Francisco, CA",
  "source": "content_engager",
  "engagement_type": "Commented"
}
```

Report: "Found X leads from {source}."

### Step 4: Load Configuration

Read these config files:
1. `.claude/skills/lead-qualifier/config/scoring_rubric.md` — scoring rules
2. `.claude/skills/lead-qualifier/config/disqualifiers.md` — company disqualifier patterns

### Step 5: Run the 7-Gate Pipeline

For each lead, execute gates sequentially. Stop at first disqualification.

**GATE 0: Dedup**
Check `profile_url` against already-processed leads in this batch. Skip duplicates.

**GATE 1: Lightweight Pre-Qualification** (NO API calls)
- Parse headline/title/company from source data
- DISQUALIFY if headline = student, intern, recruiter, job seeker, career coach
- DISQUALIFY if company is obvious big corp (see disqualifiers.md) or agency pattern
- DISQUALIFY if location matches your country blocklist (customize in scoring_rubric.md)

**GATE 2: Exclusion Check** (NO API calls)
- Check against your exclusion list (existing clients, partners, team members)
- Customize the exclusion list in the scoring rubric config

--- UNIPILE API BOUNDARY — only pre-qualified leads reach here ---

**GATE 3: Enrich via Unipile**
```bash
node scripts/unipile-cli.mjs profile <account_id> <slug>
```
- Wait 2 seconds between API calls (rate limit safety)
- Extract: location, experience[], headline, connections, network_distance, is_premium, provider_id
- If enrichment fails: continue with raw data (reduced confidence)

**GATE 4: Country + Role Fit** (enriched data)
- Apply country preferences on enriched location
- Role fit on experience[] array:
  - PASS: founders, C-level, VP, Head-of, Director
  - FAIL: SDR, AE, BDR, IC roles
  - "Sales Manager" = PASS (manages team). "Account Executive" = FAIL (executes).

**GATE 5: Company Qualification**
- Evaluate current roles/companies from experience[]
- Eliminate: agencies, lead gen, big corps (500+), B2C, VCs, nonprofits, freelancers
- Verify: B2B company, target employee range, active operating company
- Pick best-fit company as primary

**GATE 5.5: Signal Research** (optional — user says "qualify with signals")
- Web search for funding/hiring/news about the winning company
- Bonus points: high-confidence signal +10, medium +5

**GATE 6: Final Scoring**
- Apply scoring rubric from `scoring_rubric.md`
- Assign confidence: High / Medium / Low
- Assign tier: Hot (80-100), Warm (50-79), Monitor (20-49), Disqualified (0-19)
- Assign qualification tags

Show progress every 10 leads.

### Step 6: Present Results

Summary table:

| # | Name | Company | Title | Score | Tier | Confidence | Tags |
|---|------|---------|-------|-------|------|------------|------|

Pipeline statistics:
- Total input / Gate 0 dedup / Gate 1 pre-qual / Gate 3 API calls
- Final: Hot: H, Warm: W, Monitor: M, Disqualified: D

Cost estimate:
- Unipile API calls: N × ~$0.01 = $X.XX

### Step 7: Save Output

Save to: `./output/qualified_{source}_{YYYY-MM-DD_HHMM}.json`

Also offer CSV export.

### Step 8: Next Steps

Suggest:
- "Enrich contact info with FullEnrich"
- "Launch an outreach campaign for Hot leads"
- "Export to Notion"

## Key Principle

The 7-gate architecture is a cost optimization pattern:
- Gates 0-2 are free (pure data filtering)
- Gate 3 is the expensive API call — but only ~40-60% of leads reach it
- Gates 4-6 work on enriched data for accurate scoring

This means you pay for enrichment ONLY on leads that have already passed basic quality checks.

## Error Handling

| Error | Fix |
|-------|-----|
| No input file found | Check `./output/` or provide a file path |
| Unipile not configured | Enrichment skipped — scores will have Low confidence |
| API rate limit | Wait 60 seconds, resume |
| Empty results | Broaden your ICP criteria in the config files |
