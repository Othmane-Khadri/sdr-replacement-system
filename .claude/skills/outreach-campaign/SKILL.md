---
name: outreach-campaign
description: Create and launch LinkedIn outreach campaigns with 3-step sequences via Unipile. Connect → DM1 → DM2.
version: 1.0.0
---

# LinkedIn Outreach Campaign

Create and launch multi-step LinkedIn outreach campaigns via Unipile. Supports connection requests with notes, timed DM follow-ups, and personalized messaging.

## When This Skill Applies

- "create outreach campaign"
- "launch LinkedIn campaign"
- "start LinkedIn sequence"
- "campaign for these leads"
- "outreach to these prospects"

## What This Skill Does NOT Do

- Qualify leads (use the lead-qualifier skill first)
- Send emails (LinkedIn only)
- Run ongoing daily tracking (manual re-runs needed)

## Authentication

| Variable | Purpose |
|----------|---------|
| `UNIPILE_API_KEY` | Access Token from Unipile |
| `UNIPILE_DSN` | Base URL |

Create your account at: https://www.unipile.com/?utm_source=partner&utm_campaign=Yalc

## Workflow

### Step 1: Validate Environment

```bash
source .env
node scripts/unipile-cli.mjs status
node scripts/unipile-cli.mjs accounts
```

Verify Unipile is connected and at least one LinkedIn account exists. Note the `account_id`.

### Step 2: Collect Campaign Inputs

**2a. Campaign basics:**

1. **Campaign name** — descriptive identifier (e.g., "VP Sales SaaS March 2026")
2. **Lead source** — one of:
   - Qualified leads file: `./output/qualified_*.json` (already has provider_id)
   - CSV/JSON file: needs provider_id resolution (Step 4)
3. **Timing config** (defaults):
   - Wait after acceptance before DM 1: **2 days**
   - Wait after DM 1 before DM 2: **3 days**
4. **Daily limit:** **30** connection requests/day

**2b. Choose a messaging template:**

Pick from `templates/sequences.md` or create custom messages:

| Template | Best For |
|----------|----------|
| Warm Connect (2-step) | Content engagers, mutual connections |
| Cold Outreach (3-step) | Standard top-of-funnel |
| Value-First (3-step) | When you have a resource to share |
| Referral/Intro (2-step) | Warm intros from mutual connections |

Customize templates with your:
- Value proposition
- Relevant resources/links
- Industry-specific language

### Step 3: Read and Validate Leads

**From qualified output (default):**
1. Read `./output/qualified_*.json` (most recent)
2. Filter: only Hot and Warm tier leads
3. All leads should have: name, LinkedIn URL, slug, provider_id, company, title

**From CSV/JSON:**
1. Read the file — need at minimum: name + LinkedIn URL
2. Extract slugs
3. Will need Step 4 (provider_id resolution)

**Validation:**
- Skip leads without LinkedIn URL
- Warn about duplicates
- Report total valid leads

### Step 4: Resolve Provider IDs (CSV/JSON source only)

**Skip if leads already have provider_id** (qualified output has it).

For each lead from CSV/JSON:
```bash
node scripts/unipile-cli.mjs profile <account_id> <linkedin_slug>
```

Rate limit: 2-second delay between calls.

### Step 5: Personalize Messages

For each lead, resolve template variables:

| Variable | Source |
|----------|--------|
| `{{first_name}}` | Lead name (first word) |
| `{{last_name}}` | Lead name (remaining words) |
| `{{company}}` | Company field |
| `{{title}}` | Title field |
| `{{headline}}` | Title + "at" + Company |

**Never send a message with unresolved `{{variables}}`** — flag the lead instead.

### Step 6: Preview and Confirm

Show the user:
- Campaign name and sequence type
- Total leads
- 2 example personalized connection notes (randomly selected)
- Daily limit and estimated days to complete
- Summary: "Ready to launch? This will send up to 30 connection requests today."

**Always preview. Never auto-send.**

### Step 7: Execute First Batch

On user confirmation:

1. Take the first N leads (up to daily limit of 30)
2. For each lead:
   a. Personalize the connection note
   b. Run `--dry-run` first for validation:
      ```bash
      node scripts/unipile-cli.mjs send-connection <acct> --provider-id <id> --note "..." --dry-run
      ```
   c. Run without `--dry-run`
   d. Log result (success/failure + timestamp)
3. Save campaign state to `./output/campaign_{name}_{date}.json`
4. Report: "Sent X/30 connection requests. Y remaining for tomorrow."

**Rate limiting:** 3-5 second delay between each send.

### Step 8: Track Progress (Manual)

The campaign state file tracks each lead's status:
```json
{
  "campaign_name": "VP Sales SaaS March 2026",
  "created_at": "2026-03-14",
  "sequence": "connect → DM1 → DM2",
  "leads": [
    {
      "name": "Jane Doe",
      "slug": "janedoe",
      "provider_id": "ACoAA...",
      "status": "connect_sent",
      "connect_sent_at": "2026-03-14",
      "accepted_at": null,
      "dm1_sent_at": null,
      "dm2_sent_at": null,
      "replied": false
    }
  ]
}
```

To advance the campaign (check acceptances, send DMs), re-run this skill:
- "continue the campaign" or "advance campaign {name}"
- The skill reads the state file, checks for new acceptances, and sends queued DMs

### Step 9: DM Follow-Up Flow

When re-running to advance:

1. **Check for acceptances:** Compare connection list vs. sent connections
2. **Queue DM1:** For accepted connections where `connect_sent_at` + wait_days has passed
3. **Queue DM2:** For DM1-sent leads where `dm1_sent_at` + wait_days has passed AND no reply
4. **Send queued DMs:**
   ```bash
   node scripts/unipile-cli.mjs send-message <acct> --attendee-id <provider_id> --text "..." --dry-run
   ```
5. Update campaign state file

## Safety Rules

1. **Always preview before sending.** Show personalized messages. Never auto-send.
2. **Respect daily limits.** Hard cap at 30 connection requests/day.
3. **Dry-run every send.** Run with `--dry-run` first.
4. **Handle errors gracefully.** One failure doesn't stop the batch.
5. **No duplicate sends.** Check status before sending.

## Error Handling

| Error | Fix |
|-------|-----|
| `UNIPILE_API_KEY not set` | Add to `.env` |
| No LinkedIn account | Connect in Unipile dashboard |
| Profile 404 | Wrong LinkedIn slug |
| Rate limit hit | Stop, report what was sent, resume tomorrow |
| Lead has no Provider ID | Skip lead, log warning |
