#!/usr/bin/env node

/**
 * Unipile CLI — Self-contained REST wrapper for LinkedIn automation
 *
 * Requires two environment variables:
 *   UNIPILE_API_KEY  — Your Unipile Access Token
 *   UNIPILE_DSN      — Your Unipile base URL (e.g., https://api4.unipile.com:13443)
 *
 * Usage:
 *   node scripts/unipile-cli.mjs status
 *   node scripts/unipile-cli.mjs accounts
 *   node scripts/unipile-cli.mjs profile <account_id> <linkedin_slug>
 *   node scripts/unipile-cli.mjs send-connection <account_id> --provider-id <id> [--note "..."] [--dry-run]
 *   node scripts/unipile-cli.mjs send-message <account_id> --attendee-id <id> --text "..." [--dry-run]
 *   node scripts/unipile-cli.mjs list-post-comments <account_id> <social_id> [--max-pages 10]
 *   node scripts/unipile-cli.mjs list-post-reactions <account_id> <social_id> [--max-pages 10]
 *   node scripts/unipile-cli.mjs get-post <account_id> <post_id>
 *   node scripts/unipile-cli.mjs search <account_id> <query> [--limit 25]
 */

const API_KEY = process.env.UNIPILE_API_KEY;
const DSN = process.env.UNIPILE_DSN;

if (!API_KEY || !DSN) {
  console.error('Error: UNIPILE_API_KEY and UNIPILE_DSN must be set.');
  console.error('Get your keys at: https://dashboard.unipile.com (REFERRAL_LINK_HERE)');
  process.exit(1);
}

const headers = {
  'X-API-KEY': API_KEY,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// --- Helpers ---

async function apiGet(path) {
  const url = `${DSN}${path}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function apiPost(path, body) {
  const url = `${DSN}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

function parseArgs(args) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        flags[key] = args[++i];
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(args[i]);
    }
  }
  return { flags, positional };
}

// --- Commands ---

async function status() {
  try {
    const data = await apiGet('/api/v1/accounts');
    const count = data.items?.length ?? 0;
    console.log(`Connected. ${count} account(s) found.`);
  } catch (err) {
    console.error(`Connection failed: ${err.message}`);
    process.exit(1);
  }
}

async function accounts() {
  const data = await apiGet('/api/v1/accounts');
  const items = data.items ?? [];
  if (items.length === 0) {
    console.log('No accounts found. Connect a LinkedIn account in Unipile dashboard.');
    return;
  }
  for (const acct of items) {
    console.log(`  ID: ${acct.id}  |  Type: ${acct.type}  |  Name: ${acct.name ?? 'N/A'}  |  Status: ${acct.status ?? 'unknown'}`);
  }
}

async function profile(accountId, slug) {
  const data = await apiGet(`/api/v1/users/${encodeURIComponent(slug)}?account_id=${accountId}`);
  console.log(JSON.stringify(data, null, 2));
}

async function getPost(accountId, postId) {
  const data = await apiGet(`/api/v1/posts/${encodeURIComponent(postId)}?account_id=${accountId}`);
  console.log(JSON.stringify(data, null, 2));
}

async function sendConnection(accountId, flags) {
  const providerId = flags['provider-id'];
  if (!providerId) {
    console.error('Error: --provider-id is required');
    process.exit(1);
  }

  const body = {
    account_id: accountId,
    provider_id: providerId,
  };
  if (flags.note) body.message = flags.note;

  if (flags['dry-run']) {
    console.log('[DRY RUN] Would send connection request:');
    console.log(JSON.stringify(body, null, 2));
    return;
  }

  const data = await apiPost('/api/v1/users/invite', body);
  console.log('Connection request sent:', JSON.stringify(data, null, 2));
}

async function sendMessage(accountId, flags) {
  const attendeeId = flags['attendee-id'];
  const text = flags.text;
  if (!attendeeId || !text) {
    console.error('Error: --attendee-id and --text are required');
    process.exit(1);
  }

  const body = {
    account_id: accountId,
    attendees_ids: [attendeeId],
    text,
  };

  if (flags['dry-run']) {
    console.log('[DRY RUN] Would send message:');
    console.log(JSON.stringify(body, null, 2));
    return;
  }

  const data = await apiPost('/api/v1/chats', body);
  console.log('Message sent:', JSON.stringify(data, null, 2));
}

async function listPostReactions(accountId, socialId, maxPages = 10) {
  const limit = 100;
  let allItems = [];
  let cursor = null;
  let pages = 0;

  do {
    const params = cursor
      ? new URLSearchParams({ cursor })
      : new URLSearchParams({ account_id: accountId, limit: String(limit) });

    const url = `/api/v1/posts/${encodeURIComponent(socialId)}/reactions?${params}`;
    const data = await apiGet(url);

    if (data.items) allItems = allItems.concat(data.items);

    const rawCursor = data.paging?.cursor ?? data.cursor ?? null;
    if (rawCursor && typeof rawCursor === 'string') {
      cursor = rawCursor;
    } else if (rawCursor && typeof rawCursor === 'object' && Object.keys(rawCursor).length > 0) {
      cursor = JSON.stringify(rawCursor);
    } else {
      cursor = null;
    }
    pages++;
  } while (cursor && pages < maxPages);

  console.log(JSON.stringify({ total: allItems.length, items: allItems }, null, 2));
}

async function listPostComments(accountId, socialId, maxPages = 10) {
  const limit = 100;
  let allItems = [];
  let cursor = null;
  let pages = 0;

  do {
    const params = cursor
      ? new URLSearchParams({ cursor, account_id: accountId, limit: String(limit) })
      : new URLSearchParams({ account_id: accountId, limit: String(limit) });

    const url = `/api/v1/posts/${encodeURIComponent(socialId)}/comments?${params}`;
    const data = await apiGet(url);

    if (data.items) allItems = allItems.concat(data.items);
    cursor = data.cursor || data.paging?.cursor || null;
    pages++;
  } while (cursor && pages < maxPages);

  console.log(JSON.stringify({ total: allItems.length, items: allItems }, null, 2));
}

async function search(accountId, query, limit = 25) {
  const data = await apiPost('/api/v1/linkedin/search', {
    account_id: accountId,
    api: 'classic',
    category: 'people',
    keyword: query,
    limit,
  });
  console.log(JSON.stringify(data, null, 2));
}

// --- Router ---

const [,, command, ...rest] = process.argv;
const { flags, positional } = parseArgs(rest);

(async () => {
  try {
    switch (command) {
      case 'status':
        await status();
        break;
      case 'accounts':
        await accounts();
        break;
      case 'profile':
        if (positional.length < 2) { console.error('Usage: profile <account_id> <slug>'); process.exit(1); }
        await profile(positional[0], positional[1]);
        break;
      case 'get-post':
        if (positional.length < 2) { console.error('Usage: get-post <account_id> <post_id>'); process.exit(1); }
        await getPost(positional[0], positional[1]);
        break;
      case 'send-connection':
        if (positional.length < 1) { console.error('Usage: send-connection <account_id> --provider-id <id>'); process.exit(1); }
        await sendConnection(positional[0], flags);
        break;
      case 'send-message':
        if (positional.length < 1) { console.error('Usage: send-message <account_id> --attendee-id <id> --text "..."'); process.exit(1); }
        await sendMessage(positional[0], flags);
        break;
      case 'list-post-reactions':
        if (positional.length < 2) { console.error('Usage: list-post-reactions <account_id> <social_id>'); process.exit(1); }
        await listPostReactions(positional[0], positional[1], parseInt(flags['max-pages'] ?? '10'));
        break;
      case 'list-post-comments':
        if (positional.length < 2) { console.error('Usage: list-post-comments <account_id> <social_id>'); process.exit(1); }
        await listPostComments(positional[0], positional[1], parseInt(flags['max-pages'] ?? '10'));
        break;
      case 'search':
        if (positional.length < 2) { console.error('Usage: search <account_id> <query>'); process.exit(1); }
        await search(positional[0], positional[1], parseInt(flags.limit ?? '25'));
        break;
      default:
        console.log(`
Unipile CLI — LinkedIn automation via REST API

Commands:
  status                                          Test API connectivity
  accounts                                        List connected LinkedIn accounts
  profile <acct> <slug>                           Get LinkedIn profile
  get-post <acct> <post_id>                       Get post details + social_id
  send-connection <acct> --provider-id <id>       Send connection request
    [--note "..."] [--dry-run]
  send-message <acct> --attendee-id <id>          Send LinkedIn DM
    --text "..." [--dry-run]
  list-post-reactions <acct> <social_id>          Scrape post reactions
    [--max-pages 10]
  list-post-comments <acct> <social_id>           Scrape post comments
    [--max-pages 10]
  search <acct> <query> [--limit 25]              Search LinkedIn people

Environment:
  UNIPILE_API_KEY   Your Unipile Access Token
  UNIPILE_DSN       Your Unipile base URL
        `);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
})();
