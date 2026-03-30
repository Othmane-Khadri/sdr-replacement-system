# The SDR Replacement System

**Replace your SDR with Claude Code + 4 APIs. ~$100/mo instead of $3,000+/mo.**

A complete outbound system that scrapes LinkedIn engagement, qualifies leads through a 7-gate pipeline, enriches contact info, and launches personalized outreach campaigns — all orchestrated by Claude Code skills.

> Built by [Othmane Khadri](https://www.linkedin.com/in/othmane-khadri-b48162236/) at [Earleads](https://earleads.com)

---

## The Stack

| API | What It Does | Setup Guide |
|-----|-------------|-------------|
| **[Unipile](https://www.unipile.com/?utm_source=partner&utm_campaign=Yalc)** | LinkedIn outreach — connections, DMs, profile enrichment, post scraping | [Setup](docs/api-setup/unipile.md) |
| **[Crustdata](https://crustdata.com)** | Company & people intelligence — search, enrich, find decision makers | [Setup](docs/api-setup/crustdata.md) |
| **[FullEnrich](https://fullenrich.com?via=sNO0yIysrHzw)** | Email & phone enrichment — verified contact data | [Setup](docs/api-setup/fullenrich.md) |
| **[Notion](https://notion.so)** | CRM layer — store leads, track campaigns | [Setup](docs/api-setup/notion-mcp.md) |

---

## What's Included

| Skill | What It Does |
|-------|-------------|
| **LinkedIn Engagement Scraper** | Scrape commenters and likers from any LinkedIn post |
| **Company Enrichment** | Search and enrich companies via Crustdata |
| **Contact Enrichment** | Find emails and phone numbers via FullEnrich |
| **Lead Qualifier** | 7-gate waterfall pipeline — cheap filters first, expensive API calls last |
| **Outreach Campaign** | 3-step LinkedIn sequence: Connect → DM1 → DM2 |

---

## Quickstart

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/sdr-replacement-system.git
cd sdr-replacement-system
```

### 2. Configure

```bash
cp .env.example .env
# Fill in your API keys (see SETUP.md for step-by-step)
```

### 3. Verify

```bash
chmod +x scripts/setup-check.sh
./scripts/setup-check.sh
```

### 4. Open Claude Code

```bash
claude
```

### 5. Run Your First Workflow

```
You: "Scrape this LinkedIn post: https://linkedin.com/posts/..."
You: "Qualify these leads"
You: "Create outreach campaign for hot leads"
```

See [docs/workflows/scrape-qualify-outreach.md](docs/workflows/scrape-qualify-outreach.md) for the full walkthrough.

---

## The Pipeline

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  LinkedIn    │────→│   Enrich     │────→│  7-Gate     │────→│   Contact    │────→│  Outreach   │
│  Scraper     │     │  Companies   │     │  Qualifier  │     │  Enrichment  │     │  Campaign   │
│              │     │  (Crustdata) │     │             │     │ (FullEnrich) │     │  (Unipile)  │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘     └─────────────┘
                                               │
                                    ┌──────────┴──────────┐
                                    │   Gate 0: Dedup     │  FREE
                                    │   Gate 1: Pre-qual  │  FREE
                                    │   Gate 2: Exclusion │  FREE
                                    │ ─────────────────── │
                                    │   Gate 3: Enrich    │  API
                                    │ ─────────────────── │
                                    │   Gate 4: Role fit  │  FREE
                                    │   Gate 5: Company   │  FREE
                                    │   Gate 6: Score     │  FREE
                                    └─────────────────────┘
```

The 7-gate architecture saves money: ~60% of leads are filtered out before any API call.

---

## Cost Breakdown

| Service | Monthly Cost |
|---------|-------------|
| Unipile (LinkedIn API) | ~$39/mo |
| Crustdata (Company intel) | ~$25/mo |
| FullEnrich (Contact data) | ~$29/mo |
| Notion (CRM) | Free |
| Claude Code | $20/mo |
| **Total** | **~$113/mo** |

Compare to: SDR salary ($3,000-5,000/mo) or Clay + Apollo + Outreach ($500+/mo).

---

## How Skills Work

Skills are markdown files that teach Claude Code to perform specific tasks. They live in `.claude/skills/` and trigger automatically based on what you say.

Read [docs/how-skills-work.md](docs/how-skills-work.md) for the full explanation.

---

## Workflows

| Workflow | Guide |
|----------|-------|
| Post engagement → qualified leads → campaign | [scrape-qualify-outreach.md](docs/workflows/scrape-qualify-outreach.md) |
| Company research → decision makers | [company-research.md](docs/workflows/company-research.md) |
| Signal monitoring → timed outreach | [signal-based-outreach.md](docs/workflows/signal-based-outreach.md) |

---

## Customization

The skills are designed to be customized for your ICP:

- **Scoring rubric:** Edit `.claude/skills/lead-qualifier/config/scoring_rubric.md` — adjust point values, add your preferred countries, industries
- **Company disqualifiers:** Edit `.claude/skills/lead-qualifier/config/disqualifiers.md` — add competitors, excluded company types
- **Message templates:** Edit `.claude/skills/outreach-campaign/templates/sequences.md` — customize for your value prop

---

## Want the Full System?

This repo gives you the core outbound pipeline. The full system includes:

- Multi-variant A/B testing with automatic winner declaration
- Intelligence store that learns from campaign results (RLHF)
- Campaign analytics with weekly performance reports
- Full Notion CRM sync with pipeline views
- Automated daily campaign execution
- Knowledge base integration (ICP docs, competitor analysis)

**It's free and open source:** [GTM-OS on GitHub](https://github.com/Othmane-Khadri/YALC-the-GTM-operating-system)

**Want it done for you?** [earleads.com](https://earleads.com)

---

## License

MIT — do whatever you want with it.
