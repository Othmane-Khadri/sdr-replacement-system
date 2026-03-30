# Setting Up Notion as Your CRM

Notion serves as the CRM layer — store qualified leads, track campaign progress, and export results.

## Option A: Notion MCP (Recommended for Claude Code)

If you're using Claude Code with MCP support, you can connect Notion directly:

1. Go to https://www.notion.so/my-integrations
2. Create a new integration
3. Copy the **Internal Integration Token**
4. Add to your MCP config or `.env`:
   ```bash
   NOTION_API_KEY=ntn_your_integration_token
   ```
5. Share the relevant Notion pages/databases with your integration

## Option B: Manual Export (Simpler)

If you prefer not to set up Notion integration:
- All skills output to `./output/` as JSON and CSV
- Import CSVs directly into Notion databases
- Works without any Notion API setup

## Setting Up Your Leads Database

Create a Notion database with these columns:

| Column | Type | Purpose |
|--------|------|---------|
| Lead Name | Title | Full name |
| LinkedIn URL | URL | Profile link |
| Company | Text | Current company |
| Title | Text | Job title |
| Score | Number | Qualification score (0-100) |
| Tier | Select | Hot / Warm / Monitor / Disqualified |
| Confidence | Select | High / Medium / Low |
| Tags | Multi-select | Qualification tags |
| Source | Select | Where the lead came from |
| Campaign | Text | Which campaign they're in |
| Status | Select | Qualified / Queued / Connect_Sent / DM_Sent / Replied |
| Provider ID | Text | Unipile provider ID (for campaigns) |

## Setting Up Your Campaigns Database

| Column | Type | Purpose |
|--------|------|---------|
| Campaign Name | Title | Descriptive name |
| Status | Select | Draft / Active / Completed |
| Total Leads | Number | Lead count |
| Connects Sent | Number | Connection requests sent |
| Accepts | Number | Connections accepted |
| DMs Sent | Number | Follow-up DMs sent |
| Replies | Number | Replies received |
| Accept Rate % | Number | Accepts / Connects |
| Reply Rate % | Number | Replies / DMs |

## Pricing

Notion's free plan supports unlimited pages and databases. The API integration works on free plans.
