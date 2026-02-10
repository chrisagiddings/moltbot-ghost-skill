# Ghost CMS Skill for OpenClaw

> Comprehensive Ghost CMS integration for creating, publishing, scheduling, and managing blog content, newsletters, members, and analytics.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

This skill enables OpenClaw agents to interact with [Ghost CMS](https://ghost.org), the open-source publishing platform. Manage content, members, subscriptions, comments, and analytics—all via the Ghost Admin API.

**Status:** ✅ **Production Ready** (Security hardened Feb 10, 2026)  
**API Version:** Ghost Admin API v5.0

## Features

✅ **Content Management** - Create, update, publish, schedule posts and pages  
✅ **Member Management** - Manage subscribers, free and paid memberships  
✅ **Subscription Management** - Create and manage pricing tiers  
✅ **Comment Management** - Reply to, approve, and moderate comments  
✅ **Newsletter Management** - Configure newsletters and email campaigns  
✅ **Analytics** - Access subscriber stats, popular content, MRR  
✅ **Media Management** - Upload images and featured images  
✅ **User Management** - Invite and manage site users

## Security

**This skill includes comprehensive security controls:**

- **🔒 Autonomous invocation disabled** - Requires explicit user commands
- **📋 Capability declarations** - 8 capabilities clearly documented
- **🔑 Credential documentation** - Multiple secure storage options
- **📚 Operation classification** - ~45 operations (15 read-only, 30 destructive)
- **⚠️ Security warnings** - Prominent warnings about public publishing
- **📖 Comprehensive docs** - Complete API reference with safety guide
- **🛡️ Recovery procedures** - Undo guide for all operations

**Admin API Key Access:**
- Ghost Admin API keys provide **full site access**
- **No read-only scopes available** - keys have complete permissions
- **Published content is immediately public** - extra caution required
- Store securely (1Password CLI, environment variables)
- Rotate regularly (every 90 days recommended)
- Never commit keys to version control

See [SKILL.md](SKILL.md) for detailed security information and [references/api-reference.md](references/api-reference.md) for operation-by-operation safety classifications.

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm
- Ghost site (self-hosted or Ghost Pro)
- Ghost Admin API credentials

### Setup

1. **Get your Ghost Admin API credentials:**
   - Ghost dashboard → Settings → Integrations
   - Create a new "Custom Integration"
   - Copy the **Admin API Key** and **API URL**

2. **Install dependencies:**
   ```bash
   cd ghost-cms-skill/scripts
   npm install
   ```

3. **Store credentials securely:**

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
   chmod 600 ~/.config/ghost/api_key ~/.config/ghost/api_url
   ```

   **Option C: 1Password CLI (Most Secure)**
   ```bash
   # Store in 1Password
   op item create --category=API_CREDENTIAL \
     --title="Ghost Admin API" \
     admin_key[password]="YOUR_ADMIN_API_KEY" \
     api_url[text]="https://yourblog.ghost.io"

   # Use in commands
   export GHOST_ADMIN_KEY=$(op read "op://Private/Ghost Admin API/admin_key")
   export GHOST_API_URL=$(op read "op://Private/Ghost Admin API/api_url")
   ```

4. **Test connection:**
   ```bash
   cd ghost-cms-skill/scripts
   node ghost-crud.js list posts
   ```

## Quick Start

### List Recent Posts

```bash
cd scripts
node ghost-crud.js list posts --limit 5
```

### Create Draft Post

```bash
node ghost-crud.js create post \
  --title "New Blog Post" \
  --content "<p>Content goes here</p>" \
  --tags "tutorial,ghost"
```

### Publish a Draft

```bash
# Get post ID first
POST_ID=$(node ghost-crud.js list posts --filter "status:draft" | jq -r '.[0].id')

# Publish it
node ghost-crud.js update post "$POST_ID" \
  --status published
```

### Get Member Stats

```bash
node ghost-crud.js stats members
```

See [SKILL.md](SKILL.md) for complete usage guide and [references/](references/) for detailed documentation.

## Documentation

**Primary Documentation:**
- [SKILL.md](SKILL.md) - Complete skill reference and security guide
- [references/setup.md](references/setup.md) - Detailed setup and troubleshooting
- [references/api-reference.md](references/api-reference.md) - API endpoints with safety classifications

**Operation Guides:**
- [references/content.md](references/content.md) - Posts, pages, drafts, publishing, scheduling
- [references/members.md](references/members.md) - Member management, subscriptions, tiers
- [references/newsletters.md](references/newsletters.md) - Newsletter configuration, campaigns
- [references/comments.md](references/comments.md) - Comment replies, moderation
- [references/analytics.md](references/analytics.md) - Subscriber stats, popular content, MRR
- [references/lexical-cards.md](references/lexical-cards.md) - Lexical content format cards

## API Coverage

**~45 Ghost Admin API operations supported:**

| Category | Read-Only | Destructive | Total |
|----------|-----------|-------------|-------|
| Posts | 2 | 3 | 5 |
| Pages | 2 | 3 | 5 |
| Tags | 2 | 3 | 5 |
| Members | 3 (incl stats) | 3 | 6 |
| Tiers | 2 | 3 | 5 |
| Newsletters | 2 | 3 | 5 |
| Comments | 2 | 3 | 5 |
| Users | 2 | 3 | 5 |
| Images | 0 | 1 (upload) | 1 |
| Site/Settings | 2 | 1 | 3 |
| Webhooks | 1 | 3 | 4 |

**Total:** 15 read-only, 30 destructive operations

All operations documented with safety classifications, side effects, and recovery procedures.

## Security Features

### Operation Classification

Every API operation is classified:
- **✅ Safe (Read-Only)** - No data modification (all GET requests)
- **⚠️ Destructive** - Modifies or creates data (POST, PUT)
- **🚨 Permanent** - Cannot be undone (DELETE operations)
- **🚨 PUBLIC RISK** - Publishes content to the internet

### Metadata Security Controls

```json
{
  "openclaw": {
    "disable-model-invocation": true,
    "capabilities": [
      "content-management",
      "member-management",
      "subscription-management",
      "comment-management",
      "user-management",
      "media-management",
      "destructive-operations",
      "public-publishing"
    ],
    "requires": {"bins": ["node", "npm"]},
    "credentials": {
      "types": [
        {
          "type": "file",
          "locations": ["~/.config/ghost/api_key", "~/.config/ghost/api_url"]
        },
        {
          "type": "env",
          "variables": [
            {"name": "GHOST_ADMIN_KEY", "required": true},
            {"name": "GHOST_API_URL", "required": true}
          ]
        }
      ]
    }
  }
}
```

### Recovery & Undo Guide

Complete undo procedures documented for all operations:
- Create operations → Can delete
- Update operations → Update again with old values (no version history!)
- Delete operations → **Permanent, cannot undo**
- Publish operations → Can unpublish, but content was temporarily public

**⚠️ Important:** Ghost does not keep version history. Always save important data before modifying.

## Scripts

**Main Scripts:**
- `ghost-crud.js` - CRUD operations for all resources
- `ghost-api.js` - Low-level API wrapper
- `lexical-builder.js` - Build Lexical content format
- `update-teapot.js` - Example workflow (update specific post)

All scripts support:
- Environment variables or config files
- JSON output for piping
- Error handling with detailed messages
- Rate limit awareness

## Common Workflows

### Draft → Review → Publish

```bash
# 1. Create draft
POST_ID=$(node ghost-crud.js create post \
  --title "My Post" \
  --content "<p>Content here</p>" \
  --status draft | jq -r '.id')

# 2. Review in Ghost Admin UI
echo "Review at: ${GHOST_API_URL}/ghost/#/editor/post/${POST_ID}"

# 3. Publish when ready
node ghost-crud.js update post "$POST_ID" --status published
```

### Weekly Newsletter from Notes

```bash
# Collect week's notes, generate post with AI, publish
# (Example integration with Notion/other note systems)
```

### Comment Moderation

```bash
# List pending comments
node ghost-crud.js list comments --filter "status:pending"

# Approve a comment
node ghost-crud.js update comment "$COMMENT_ID" --status published
```

### Member Stats Dashboard

```bash
# Get counts
node ghost-crud.js stats members

# Get MRR
node ghost-crud.js stats mrr

# Recent paid members
node ghost-crud.js list members \
  --filter "status:paid" \
  --limit 10 \
  --order "created_at desc"
```

## Rate Limits

- **500 requests per hour** per integration
- Monitor `X-RateLimit-Remaining` header
- Scripts implement automatic retry with backoff
- Use batch operations where possible

## Troubleshooting

**Authentication Errors:**
```bash
# Verify credentials are set
echo $GHOST_ADMIN_KEY
echo $GHOST_API_URL

# Test connection
node ghost-crud.js list posts --limit 1
```

**Permission Errors:**
- Ghost Admin API keys have full permissions
- If you see 403 errors, regenerate integration key

**Rate Limit Errors:**
- Wait for rate limit reset (check `X-RateLimit-Reset` header)
- Reduce request frequency
- Use pagination to limit batch sizes

See [references/setup.md](references/setup.md) for complete troubleshooting guide.

## Resources

- **Ghost Admin API Docs:** https://ghost.org/docs/admin-api/
- **Ghost Content API Docs:** https://ghost.org/docs/content-api/ (read-only public API)
- **Ghost Community:** https://forum.ghost.org
- **Issue Tracker:** https://github.com/chrisagiddings/moltbot-ghost-skill/issues

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions welcome! Please:
1. Review security guidelines in SKILL.md
2. Test changes on a staging Ghost site
3. Document new operations with safety classifications
4. Update api-reference.md with any new endpoints

---

**⚠️ Security Notice:** This skill can publish content to the public internet. Always review content before publishing. Test on staging sites when possible. Store API keys securely.
