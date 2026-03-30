# Workflow: Post Engagement → Qualified Leads → Outreach Campaign

The end-to-end workflow for turning LinkedIn post engagement into qualified outreach.

## Overview

```
LinkedIn Post → Scrape Engagers → Enrich Companies → Qualify Leads → Enrich Contact Info → Launch Campaign
```

## Step 1: Scrape a LinkedIn Post

Find a viral post in your industry (or your own post) and scrape everyone who engaged:

```
You: "Scrape this LinkedIn post: https://linkedin.com/posts/..."
     "Get both commenters and reactions"
```

The scraper will:
- Resolve the post ID
- Scrape all reactions (up to ~3K)
- Scrape all comments
- Save to `./output/linkedin_scrape_both_YYYY-MM-DD.json`

## Step 2: Qualify the Leads

Run the scraped leads through the 7-gate qualification pipeline:

```
You: "Qualify these leads"
     (or "qualify latest" to auto-detect the most recent scrape)
```

The qualifier will:
- Filter obvious non-fits (students, big corps, agencies) — free, no API calls
- Enrich remaining leads via Unipile — gets full profile, experience, provider_id
- Score each lead (0-100) based on your rubric
- Output: `./output/qualified_content_engagers_YYYY-MM-DD.json`

**Expected conversion:** ~30-40% of scraped leads will be Hot or Warm.

## Step 3: Enrich Contact Info (Optional)

Get email addresses and phone numbers for your top leads:

```
You: "Enrich contact info for the hot leads"
```

FullEnrich will:
- Take qualified leads as input
- Return verified emails + phone numbers
- Save to `./output/fullenrich_YYYY-MM-DD.json`

## Step 4: Launch Outreach Campaign

Create a LinkedIn campaign targeting your qualified leads:

```
You: "Create outreach campaign for hot leads"
```

The campaign skill will:
- Read qualified leads (Hot tier)
- Help you choose/customize a message template
- Preview personalized messages
- Send up to 30 connection requests/day
- Track campaign state for follow-up DMs

## Step 5: Follow Up

After a few days, advance the campaign:

```
You: "Continue the campaign"
```

This checks for new acceptances and sends queued DM follow-ups.

## Timeline

| Day | Action | Estimated Time |
|-----|--------|---------------|
| Day 1 | Scrape post + qualify leads | 10-15 min |
| Day 1 | Launch campaign (30 connects) | 5 min |
| Day 2-3 | Send remaining connects | 5 min/day |
| Day 4+ | Check acceptances, send DMs | 5 min |
| Day 7+ | Follow up on non-replies | 5 min |

## Cost Estimate

For a post with 500 engagers:

| Item | Cost |
|------|------|
| Unipile enrichment (~200 leads past Gate 2) | ~$2.00 |
| FullEnrich (~60 Hot/Warm leads) | ~$9.00 |
| Unipile campaign sends | Included in subscription |
| **Total** | **~$11.00** |

Compare to: hiring an SDR ($3,000-5,000/mo) or using Clay + Apollo + Outreach ($500+/mo).
