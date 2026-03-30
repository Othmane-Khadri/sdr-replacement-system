#!/bin/bash
# SDR Replacement System — Setup Verification
# Run this to check all API connections are working

set -e

echo "================================"
echo "SDR Replacement System — Setup Check"
echo "================================"
echo ""

# Load .env if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | grep -v '^\s*$' | xargs)
  echo "[OK] .env file found"
else
  echo "[FAIL] No .env file found. Run: cp .env.example .env"
  exit 1
fi

echo ""
PASS=0
FAIL=0

# Check Node.js
echo "--- Node.js ---"
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  echo "[OK] Node.js $NODE_VERSION"
  PASS=$((PASS + 1))
else
  echo "[FAIL] Node.js not found. Install: https://nodejs.org"
  FAIL=$((FAIL + 1))
fi

# Check Unipile
echo ""
echo "--- Unipile (LinkedIn API) ---"
if [ -n "$UNIPILE_API_KEY" ] && [ -n "$UNIPILE_DSN" ]; then
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "X-API-KEY: $UNIPILE_API_KEY" \
    "$UNIPILE_DSN/api/v1/accounts" 2>/dev/null || echo "000")
  if [ "$RESPONSE" = "200" ]; then
    echo "[OK] Unipile connected (HTTP $RESPONSE)"
    PASS=$((PASS + 1))
  else
    echo "[FAIL] Unipile returned HTTP $RESPONSE — check API key and DSN"
    FAIL=$((FAIL + 1))
  fi
else
  echo "[SKIP] UNIPILE_API_KEY or UNIPILE_DSN not set"
  FAIL=$((FAIL + 1))
fi

# Check Crustdata
echo ""
echo "--- Crustdata (Company Intel) ---"
if [ -n "$CRUSTDATA_API_KEY" ]; then
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Token $CRUSTDATA_API_KEY" \
    "https://api.crustdata.com/v1/credits" 2>/dev/null || echo "000")
  if [ "$RESPONSE" = "200" ]; then
    echo "[OK] Crustdata connected (HTTP $RESPONSE)"
    PASS=$((PASS + 1))
  else
    echo "[FAIL] Crustdata returned HTTP $RESPONSE — check API key"
    FAIL=$((FAIL + 1))
  fi
else
  echo "[SKIP] CRUSTDATA_API_KEY not set"
  FAIL=$((FAIL + 1))
fi

# Check FullEnrich
echo ""
echo "--- FullEnrich (Contact Enrichment) ---"
if [ -n "$FULLENRICH_API_KEY" ]; then
  echo "[OK] FULLENRICH_API_KEY is set (cannot verify without a test call)"
  PASS=$((PASS + 1))
else
  echo "[SKIP] FULLENRICH_API_KEY not set"
  FAIL=$((FAIL + 1))
fi

# Check Notion (optional)
echo ""
echo "--- Notion (CRM — Optional) ---"
if [ -n "$NOTION_API_KEY" ]; then
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $NOTION_API_KEY" \
    -H "Notion-Version: 2022-06-28" \
    "https://api.notion.com/v1/users/me" 2>/dev/null || echo "000")
  if [ "$RESPONSE" = "200" ]; then
    echo "[OK] Notion connected (HTTP $RESPONSE)"
    PASS=$((PASS + 1))
  else
    echo "[WARN] Notion returned HTTP $RESPONSE — check integration token"
  fi
else
  echo "[SKIP] NOTION_API_KEY not set (optional)"
fi

# Check output directory
echo ""
echo "--- Output Directory ---"
if [ -d "./output" ]; then
  echo "[OK] ./output/ directory exists"
else
  mkdir -p ./output
  echo "[OK] Created ./output/ directory"
fi

# Summary
echo ""
echo "================================"
echo "Results: $PASS passed, $FAIL failed"
echo "================================"

if [ $FAIL -eq 0 ]; then
  echo ""
  echo "All checks passed! Open Claude Code and try:"
  echo '  "Scrape this LinkedIn post: <url>"'
else
  echo ""
  echo "Some checks failed. See SETUP.md for help."
fi
