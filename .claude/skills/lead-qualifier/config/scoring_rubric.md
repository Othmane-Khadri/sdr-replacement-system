# Lead Scoring Rubric

Customize this file for your ICP. The qualifier skill reads these rules to score leads.

## Country Preferences

### Preferred Countries (bonus points)
United States, United Kingdom, Germany, France, Netherlands, Sweden, Norway, Denmark, Finland, Canada

### Countries to Exclude (customize for your market)
Add countries where you cannot or do not want to sell. Example:
<!-- Uncomment and customize:
India, Nigeria, Nepal, Afghanistan
-->

### How to extract country from location
- Unipile returns location like "San Francisco, California, United States"
- Last component after the last comma = country
- If location is empty or ambiguous, do NOT disqualify — proceed to next gate

---

## Scoring Rubric (0-100)

Start at base 50. Apply adjustments:

### Title / Role (+25 to -50)

| Signal | Points |
|---|---|
| CEO, Founder, Co-Founder, Owner | +25 |
| CRO, CMO, COO, CSO | +25 |
| VP or Head of Sales/Marketing/Revenue/Growth/GTM/BD/Partnerships | +25 |
| Managing Director, General Manager | +20 |
| Director of Sales/Marketing/Revenue/Growth/GTM/BD | +15 |
| Manager of Sales/Marketing/Growth/BD (at companies <100 emp) | +15 |
| Manager of Sales/Marketing/Growth/BD (at companies >100 emp) | +10 |
| Advisory, Board Member, Mentor, Fractional | +5 |
| Engineering, Product, Design, Finance, HR, Legal, Ops (non-founder) | -10 |
| SDR, AE, BDR, Sales Rep, Marketing Coordinator | -20 |
| Student, Intern, Job Seeker, Career Coach, Recruiter | -50 |

### Company Type (+15 to -40)

| Signal | Points |
|---|---|
| B2B SaaS (verified) | +15 |
| B2B Tech (non-SaaS) | +10 |
| B2B Services (consulting, professional services) | +5 |
| Unknown / insufficient data | 0 |
| B2C company | -15 |
| Agency / Lead gen / SDR-as-a-service | -40 |

### Company Size (+10 to -5)

| Signal | Points |
|---|---|
| 5-50 employees | +10 |
| 50-200 employees | +10 |
| 200-500 employees | +8 |
| 1-5 employees (solo/micro) | +3 |
| 500+ employees | -5 |

### Geography (+5 to 0)

| Signal | Points |
|---|---|
| Preferred country (see above) | +5 |
| Other | 0 |

### Network Signals (+5 to 0)

| Signal | Points |
|---|---|
| 2nd degree connection | +5 |
| 1st degree connection | +3 |
| 3rd degree or unknown | 0 |

### LinkedIn Profile Signals (+3 to 0)

| Signal | Points |
|---|---|
| LinkedIn Premium subscriber | +3 |

### Engagement Signals (+8 to 0)

| Signal | Points |
|---|---|
| Commented on your post (substantive) | +8 |
| Commented on your post (short/generic) | +5 |
| Liked your post | +5 |
| Visited your profile | +5 |
| No engagement (cold) | 0 |

### Buying Signals (+10 to 0)

| Signal | Points |
|---|---|
| Recent fundraise (Series A, Seed, etc.) | +10 |
| Hiring GTM roles (SDR, AE, RevOps) | +10 |
| Y Combinator / top accelerator | +10 |
| Other accelerator | +5 |
| Recent product launch | +5 |

### Signal Bonus (Gate 5.5 — only when enabled)

| Signal Confidence | Bonus Points |
|---|---|
| High (verified, recent) | +10 |
| Medium (ambiguous or older than 6 months) | +5 |
| Low or none | +0 |

---

## Confidence Level

| Level | When to assign |
|---|---|
| **High** | Full enrichment succeeded, all gates had complete data, company verified |
| **Medium** | Enrichment succeeded but some data incomplete |
| **Low** | Enrichment failed (scoring from raw data only) |

---

## Tier Thresholds

| Tier | Score Range | Action |
|---|---|---|
| **Hot** | 80-100 | Ready for outreach |
| **Warm** | 50-79 | Worth monitoring |
| **Monitor** | 20-49 | Save for later |
| **Disqualified** | 0-19 | Not a fit |

---

## Qualification Tags

Assign ALL applicable tags (3-6 per lead):

### Role Tags
- `Founder-CEO` — Founder, Co-Founder, CEO, Owner
- `Revenue-Leader` — CRO, VP Sales, Head of Revenue
- `Marketing-Leader` — CMO, VP Marketing, Head of Marketing
- `RevOps` — RevOps, GTM Ops, Sales Ops
- `Partnerships` — Partnerships, BD, Alliances

### Company Stage Tags
- `Early-Stage` — 5-50 employees, seed/pre-seed signals
- `Growth-Stage` — 50-200 employees
- `Scale-Up` — 200-500 employees

### Signal Tags
- `Post-Fundraise` — recent funding detected
- `Hiring-GTM` — hiring sales/marketing roles
- `YC-Company` — Y Combinator company
- `Content-Engager` — interacted with your content
- `Profile-Visitor` — visited your profile
- `2nd-Degree` — 2nd degree connection

### Industry Tags
Customize for your market:
- `Fintech`, `HR-Tech`, `Sales-Tech`, `Marketing-Tech`, `Dev-Tools`, `Cybersecurity`, `AI-ML`, `eCommerce-Tech`
