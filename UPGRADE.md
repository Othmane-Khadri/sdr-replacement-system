# What You're Missing

This repo gives you a working outbound pipeline. Here's what the full system adds.

## This Repo vs. GTM-OS

| Feature | This Repo | GTM-OS |
|---------|-----------|--------|
| LinkedIn scraping | Single post | Multi-post monitoring |
| Lead qualification | Manual trigger, single batch | Automated 7-gate + signal research |
| Outreach campaigns | Single message template | Multi-variant A/B testing |
| Message optimization | Manual | Automatic winner declaration |
| Intelligence | None | 8-category evidence store |
| Learning | None | RLHF — approve/reject rows, system improves |
| Campaign analytics | Manual tracking | Weekly intelligence reports |
| CRM sync | CSV/JSON export | Full Notion sync with pipeline views |
| Campaign execution | Manual re-runs | Automated daily tracker |
| Knowledge base | None | Upload ICP docs, competitor analysis — AI uses them |
| Onboarding | Configure `.env` | AI-powered GTM context builder |

## GTM-OS — Free & Open Source

GTM-OS is the full system. It's a TypeScript application with:
- Chat-first interface (describe a goal → get a structured workflow)
- Provider registry (Unipile, Crustdata, FullEnrich, Notion — auto-selected based on context)
- Intelligence store with confidence scoring (hypothesis → validated → proven)
- RLHF feedback loop (approve/reject results → system learns your preferences)
- Campaign variant testing with automatic winner declaration
- SQLite database (local-first, no external dependencies)

**Clone it:** https://github.com/Othmane-Khadri/YALC-the-GTM-operating-system

```bash
git clone https://github.com/Othmane-Khadri/YALC-the-GTM-operating-system.git
cd YALC-the-GTM-operating-system
pnpm install
cp .env.example .env.local
# Add ANTHROPIC_API_KEY
pnpm db:push
pnpm dev
```

## Want It Done For You?

We run this entire system for B2B SaaS companies.

**What you get:**
- Full GTM-OS deployment customized to your ICP
- Dedicated GTM engineer + AI agents running 24/7
- Multi-variant campaign management with weekly reports
- Reddit GEO (Generative Engine Optimization) for organic visibility
- Monthly performance reports with actionable recommendations

**Starting at $3,500/mo**

[earleads.com](https://earleads.com) — or DM [Othmane on LinkedIn](https://www.linkedin.com/in/othmane-khadri-b48162236/)
