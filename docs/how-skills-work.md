# How Claude Code Skills Work

Skills are markdown files that teach Claude Code how to perform specific tasks. Think of them as reusable playbooks — you describe what you want, and Claude follows the skill's workflow.

## How It Works

1. Skills live in `.claude/skills/` in your project
2. Each skill has a `SKILL.md` file with triggers, steps, and error handling
3. When you say something that matches a trigger phrase, Claude reads and follows the skill
4. Skills can chain together (scrape → qualify → campaign)

## Skill Anatomy

```
.claude/skills/
└── my-skill/
    ├── SKILL.md          # Main skill file (triggers, workflow, errors)
    ├── config/           # Customizable configuration
    │   └── rules.md      # Rules the skill reads at runtime
    └── templates/        # Message templates, examples
        └── examples.md
```

### SKILL.md Structure

```markdown
---
name: my-skill
description: When to trigger this skill
version: 1.0.0
---

# Skill Name

## When This Skill Applies
- "trigger phrase 1"
- "trigger phrase 2"

## Workflow
### Step 1: ...
### Step 2: ...

## Error Handling
| Error | Fix |
```

## Using Skills

Just talk naturally. The skill triggers automatically:

```
You: "scrape this LinkedIn post: https://linkedin.com/posts/..."
Claude: [reads linkedin-engagement-scraper skill, follows workflow]

You: "qualify these leads"
Claude: [reads lead-qualifier skill, runs 7-gate pipeline]

You: "launch a campaign for hot leads"
Claude: [reads outreach-campaign skill, creates sequence]
```

## Chaining Skills

Skills output to `./output/`. The next skill reads from there:

```
Scrape post → ./output/linkedin_scrape_*.json
      ↓
Qualify leads → ./output/qualified_*.json
      ↓
Enrich contacts → ./output/fullenrich_*.json
      ↓
Launch campaign → ./output/campaign_*.json
```

## Customizing Skills

Edit the config files to match your ICP:

- `lead-qualifier/config/scoring_rubric.md` — Adjust point values, add industries
- `lead-qualifier/config/disqualifiers.md` — Add/remove company patterns
- `outreach-campaign/templates/sequences.md` — Customize message templates

## Requirements

- [Claude Code](https://claude.ai/claude-code) (CLI)
- Node.js 18+ (for the Unipile CLI wrapper)
- API keys configured in `.env`
