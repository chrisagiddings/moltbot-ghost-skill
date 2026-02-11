---
name: ghost-cms-skill
description: Comprehensive Ghost CMS integration for creating, publishing, scheduling, and managing blog content, newsletters, members, and analytics. Use when working with Ghost blogs for content creation (drafts, publishing, scheduling), member/subscriber management (tiers, newsletters), comment moderation, or analytics (popular posts, subscriber growth). Supports all Ghost Admin API operations.
metadata: {"openclaw":{"disable-model-invocation":true,"capabilities":["content-management","member-management","subscription-management","comment-management","user-management","media-management","destructive-operations","public-publishing"],"requires":{"env":["GHOST_ADMIN_KEY","GHOST_API_URL"],"bins":["node","npm"]},"primaryEnv":"GHOST_ADMIN_KEY","credentials":{"types":[{"type":"file","locations":["~/.config/ghost/api_key","~/.config/ghost/api_url"],"description":"Ghost Admin API credentials"},{"type":"env","variables":[{"name":"GHOST_ADMIN_KEY","description":"Ghost Admin API key (JWT)","required":true},{"name":"GHOST_API_URL","description":"Ghost site URL (e.g., https://yourblog.ghost.io)","required":true}]}]}}}
---

# Ghost CMS

Manage Ghost blog content, members, analytics, and newsletters through the Ghost Admin API.

## ⚠️ Security Warning

**Ghost Admin API keys provide FULL access to your Ghost site:**

- **Content Management:** Create, update, delete, publish posts and pages
- **Member Management:** Add, modify, delete members and subscriptions
- **Subscription Management:** Create, modify, delete membership tiers
- **Comment Management:** Reply to, approve, delete comments
- **User Management:** Invite, modify, delete users
- **Media Management:** Upload images and files (affects storage)
- **Site Configuration:** Modify newsletters and settings

**Published content is IMMEDIATELY PUBLIC** - be extra careful with publish operations.

**Security Best Practices:**
- **Store API keys securely** - Use 1Password CLI or secure env vars
- **Review before publishing** - Always check content before making it public
- **Never commit keys** - Keep credentials out of version control
- **Rotate keys regularly** - Create new integrations every 90 days
- **Use dedicated integrations** - Separate keys for different use cases
- **Test on staging first** - Use a test Ghost site when possible

**Admin API Key Scope:**
Ghost Admin API keys have **no scoping options** - they provide full access to everything. There are no read-only keys.

**Operation Types:**

**Read-Only Operations** (✅ Safe):
- List posts, pages, tags, members, tiers, newsletters, comments
- Get analytics and member stats
- All GET requests

**Destructive Operations** (⚠️ Modify or delete data, may be public):
- Create/update/delete posts, pages, tags (POST, PUT, DELETE)
- Publish/unpublish/schedule posts (**makes content public**)
- Create/update/delete members, tiers, newsletters
- Create replies, approve/delete comments
- Upload images (uses storage quota)
- All POST, PUT, DELETE requests

For detailed operation documentation, see [api-reference.md](references/api-reference.md).

## Quick Setup

1. **Get your Ghost Admin API credentials:**
   - Ghost dashboard → Settings → Integrations
   - Create a new "Custom Integration"
   - Copy the **Admin API Key** and **API URL**

2. **Store credentials securely:**

   **Option A: Environment Variables (Recommended)**
   ```bash
   # Add to your shell profile (~/.zshrc, ~/.bashrc)
   export GHOST_ADMIN_KEY="YOUR_ADMIN_API_KEY"
   export GHOST_API_URL="https://yourblog.ghost.io"
   ```

   **Option B: Config Files**
   ```bash
   mkdir -p ~/.config/ghost
   echo "YOUR_ADMIN_API_KEY" > ~/.config/ghost/api_key
   echo "https://yourblog.ghost.io" > ~/.config/ghost/api_url
   
   # Secure the files (owner read-only)
   chmod 600 ~/.config/ghost/api_key
   chmod 600 ~/.config/ghost/api_url
   ```

   **Option C: 1Password CLI (Most Secure)**
   ```bash
   # Store key in 1Password
   op item create --category=API_CREDENTIAL \
     --title="Ghost Admin API" \
     admin_key[password]="YOUR_ADMIN_API_KEY" \
     api_url[text]="https://yourblog.ghost.io"

   # Use in commands
   export GHOST_ADMIN_KEY=$(op read "op://Private/Ghost Admin API/admin_key")
   export GHOST_API_URL=$(op read "op://Private/Ghost Admin API/api_url")
   ```

   **Security Notes:**
   - Keys provide **full site access** - protect them like passwords
   - Rotate keys every 90 days (create new integration, revoke old)
   - Never commit to git or share keys publicly
   - Consider separate keys for production vs. staging

3. **Test connection:**
   See [setup.md](references/setup.md) for detailed authentication and troubleshooting.

## Tools & Utilities

### Snippet Extractor

**Purpose:** Migrate existing Ghost snippets to local library for programmatic use.

**Why needed:** Ghost Admin API blocks snippet access (403 Forbidden) for integration tokens. This tool works around that limitation.

**Usage:**
```bash
# Extract snippets from a specially-formatted draft post
node scripts/snippet-extractor.js my-snippets-post

# Validate format before extracting
node scripts/snippet-extractor.js my-snippets-post --validate

# Preview without saving
node scripts/snippet-extractor.js my-snippets-post --dry-run

# Custom marker prefix
node scripts/snippet-extractor.js my-snippets-post --marker "This is:"

# Full help
node scripts/snippet-extractor.js --help
```

**Workflow:**
1. Create draft post in Ghost
2. For each snippet: add paragraph marker (e.g., "SNIPPET: name" or "This is: name")
3. Insert the snippet content below each marker
4. Run extractor → all snippets saved to `snippets/library/`

**Features:**
- ✅ Extracts all card types (bookmarks, callouts, images, markdown, HTML, etc.)
- ✅ Preserves exact Lexical structure
- ✅ Auto-detects credentials from `~/.config/ghost/` or env vars
- ✅ Supports custom marker formats
- ✅ Dry-run and validation modes
- ✅ Verbose output for debugging

**Example:**
```bash
# User has 12 snippets in Ghost
# Creates "My Snippets" draft with markers
# Runs: node scripts/snippet-extractor.js my-snippets --marker "This is:"
# Result: All 12 snippets in library/ ready for use
```

See `snippets/README.md` for complete documentation.

---

## Core Operations

This skill covers all major Ghost operations. Navigate to the relevant reference for detailed guidance:

### Content Management
**When to use:** Creating drafts, publishing posts, scheduling content, managing pages

See **[content.md](references/content.md)** for:
- Creating new posts (drafts)
- Publishing and scheduling posts
- Updating existing content
- Managing tags, featured images, metadata
- Working with pages vs posts

See **[lexical-cards.md](references/lexical-cards.md)** for:
- **Complete Lexical card type reference** (23 documented types)
- Most comprehensive Ghost Lexical documentation available
- Full JSON structures with field references
- Video, audio, file uploads, buttons, toggles, embeds
- Product cards, headers, call-to-action, paywall
- Member visibility and content personalization

**⚠️ Ghost Snippets Limitation:**

Ghost's native snippet feature (reusable content blocks saved in the editor) **cannot be accessed via the Admin API** with integration tokens (403 Forbidden). This means:

- ❌ Cannot list available snippets
- ❌ Cannot fetch snippet content
- ❌ Cannot programmatically use author's existing snippets

**Solution: Automated Snippet Extraction**

The skill includes a **snippet extractor tool** that migrates Ghost snippets to local files:

1. **Create extraction post** in Ghost with all snippets (one-time setup)
2. **Run extractor:** `node scripts/snippet-extractor.js post-slug`
3. **Done!** All snippets saved to `snippets/library/` for programmatic use

**Commands:**
```bash
# Extract snippets (auto-detects credentials from ~/.config/ghost/)
node scripts/snippet-extractor.js my-snippets-post

# Validate format before extracting
node scripts/snippet-extractor.js my-snippets-post --validate

# Preview without saving
node scripts/snippet-extractor.js my-snippets-post --dry-run

# Custom marker format
node scripts/snippet-extractor.js my-snippets-post --marker "This is:"

# Full help
node scripts/snippet-extractor.js --help
```

**Benefits:**
- ✅ Migrate all existing Ghost snippets in seconds
- ✅ Preserves exact Lexical structure (bookmarks, callouts, images, etc.)
- ✅ Git version control
- ✅ Use programmatically in automated posts
- ✅ Works with any card types

See `snippets/README.md` for complete documentation on extraction workflow and local snippet usage.

### Analytics & Insights
**When to use:** Checking subscriber counts, popular content, traffic trends

See **[analytics.md](references/analytics.md)** for:
- Subscriber growth and counts
- Most popular posts (views, engagement)
- Tag/topic performance over time
- Member tier distribution

### Comments & Engagement
**When to use:** Responding to comments, moderating discussions

See **[comments.md](references/comments.md)** for:
- Listing pending/unanswered comments
- Responding to comments
- Comment moderation

### Members & Subscribers
**When to use:** Managing subscriber tiers, member access, premium content

See **[members.md](references/members.md)** for:
- Subscriber tier management
- Member-only content settings
- Recent subscriber activity
- Subscription status

### Newsletters
**When to use:** Managing newsletter settings, email campaigns

See **[newsletters.md](references/newsletters.md)** for:
- Newsletter configuration
- Sending newsletters
- Subscriber email settings

## API Reference

For advanced operations or endpoint details, see **[api-reference.md](references/api-reference.md)**.

## Common Workflows

**Draft → Notion → Ghost:**
1. Draft content collaboratively in Notion
2. Finalize content
3. Use this skill to copy to Ghost as draft
4. Review in Ghost admin
5. Schedule or publish

**Weekly content series:**
1. "Navi, write and publish a unique weekly post about [topic from our discussions this week]"
2. Skill creates post, sets author to "Navi", publishes automatically

**Comment management:**
1. "Are there any pending comments?"
2. Review list of comments with post titles
3. "Respond to comment #123 with [response]"

**Analytics check:**
1. "What tags have been most popular in the past 6 months?"
2. "How many new subscribers this month?"
3. "When was my last subscriber-exclusive post?"
