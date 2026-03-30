---
name: linkedin-engagement-scraper
description: Scrape commenters, likers, or both from any LinkedIn post URL via the Unipile API.
version: 1.0.0
---

# LinkedIn Post Engagement Scraper

Scrape commenters, likers/reactors, or both from any LinkedIn post URL via the Unipile API.

## When This Skill Applies

- "scrape LinkedIn post"
- "get LinkedIn post likers"
- "get LinkedIn post commenters"
- "who liked this LinkedIn post"
- "who commented on this LinkedIn post"
- "scrape this post"

## Authentication

Two environment variables required:

| Variable | Purpose |
|----------|---------|
| `UNIPILE_API_KEY` | Access Token from Unipile dashboard |
| `UNIPILE_DSN` | Base URL (e.g. `https://api4.unipile.com:13443`) |

Load from `.env` in the repo root:
```bash
source .env
```

CLI location: `./scripts/unipile-cli.mjs`

## Required Inputs

| Input | Required | Description |
|-------|----------|-------------|
| LinkedIn post URL | Yes | Full URL (e.g., `https://www.linkedin.com/posts/...`) |
| Scrape type | Yes | One of: `commenters`, `reactions` (likers), `both` |

## Workflow

### Step 1: Validate URL

Parse the LinkedIn post URL. Accept these formats:
- `https://www.linkedin.com/posts/{slug}-{activity_id}/`
- `https://www.linkedin.com/feed/update/urn:li:activity:{id}`
- `https://www.linkedin.com/feed/update/urn:li:ugcPost:{id}`

If the URL doesn't match, tell the user: "This doesn't look like a LinkedIn post URL."

### Step 2: Check Environment & Get Account

```bash
source .env
```

1. Verify `UNIPILE_API_KEY` and `UNIPILE_DSN` are set. If missing, stop and tell user.

2. Get the LinkedIn account ID:
```bash
node scripts/unipile-cli.mjs accounts
```

Find the LinkedIn account. Store its `id` as `$ACCOUNT_ID`.

### Step 3: Resolve Post ID

Extract the numeric activity ID from the LinkedIn URL:

- `linkedin.com/posts/...-activity-7437839112063234049-...` → `7437839112063234049`
- `linkedin.com/feed/update/urn:li:activity:7437839112063234049` → `7437839112063234049`
- `linkedin.com/feed/update/urn:li:ugcPost:7437839064957034496` → `urn:li:ugcPost:7437839064957034496`

Then call `get-post` with the extracted ID:

```bash
ACTIVITY_ID="7437839112063234049"
node scripts/unipile-cli.mjs get-post "$ACCOUNT_ID" "$ACTIVITY_ID"
```

This returns `social_id`, `reaction_counter`, `comment_counter`, author info, and post content.

### Step 4: Confirm Before Scraping

Show the user:
```
Post by: {author.name}
Content: {first 100 chars of text}...
Reactions: {reaction_counter}
Comments: {comment_counter}
Will scrape: {scrape_type}
```

Wait for explicit user confirmation.

### Step 5: Scrape Reactions (if requested)

```bash
node scripts/unipile-cli.mjs list-post-reactions "$ACCOUNT_ID" "$SOCIAL_ID" --max-pages 10
```

Returns reactor profiles with name, profile URL, reaction type. Auto-paginates (100/page, up to max-pages).

### Step 6: Scrape Comments (if requested)

```bash
node scripts/unipile-cli.mjs list-post-comments "$ACCOUNT_ID" "$SOCIAL_ID" --max-pages 10
```

Returns commenter name, headline, profile URL, comment text, reaction count.

### Step 7: Merge & Present Results

Combine reactions and comments into a unified list. Display a summary table:

| # | Name | Profile URL | Reacted | Reaction Type | Commented | Comment Text |
|---|------|-------------|---------|---------------|-----------|-------------|

Show the first 20 rows. If more: "Showing 20 of {total}. Full data saved to file."

### Step 8: Save Output

Save results as JSON:
```
./output/linkedin_scrape_{type}_{YYYY-MM-DD_HHMM}.json
```

Also offer CSV export with columns: `firstName`, `lastName`, `fullName`, `profileUrl`, `headline`, `reactionType`, `hasCommented`, `commentText`.

### Step 9: Next Steps (Optional)

After presenting results, suggest:
- "Run the lead qualifier on these results"
- "Enrich companies with Crustdata"
- "Launch an outreach campaign"

Suggestions only. Never auto-trigger.

## Error Handling

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `UNIPILE_API_KEY` not set | Env var missing | Add to `.env` file |
| No LinkedIn account found | Account not connected | Connect in Unipile dashboard |
| `get-post` fails | Invalid post URL | Verify URL opens in browser |
| Empty reactions list | Post has no reactions | Expected for private posts |
| Pagination stops early | LinkedIn caps data | Hard cap: ~3K likers |
