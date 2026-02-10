---
name: ghost-cms-skill
description: Comprehensive Ghost CMS integration for creating, publishing, scheduling, and managing blog content, newsletters, members, and analytics. Use when working with Ghost blogs for content creation (drafts, publishing, scheduling), member/subscriber management (tiers, newsletters), comment moderation, or analytics (popular posts, subscriber growth). Supports all Ghost Admin API operations.
metadata: {"openclaw":{"disable-model-invocation":true}}
---

# Ghost CMS

Manage Ghost blog content, members, analytics, and newsletters through the Ghost Admin API.

## Quick Setup

1. **Get your Ghost Admin API credentials:**
   - Ghost dashboard → Settings → Integrations
   - Create a new "Custom Integration"
   - Copy the **Admin API Key** and **API URL**

2. **Store credentials:**
   ```bash
   mkdir -p ~/.config/ghost
   echo "YOUR_ADMIN_API_KEY" > ~/.config/ghost/api_key
   echo "https://yourblog.ghost.io" > ~/.config/ghost/api_url
   ```

   Or set environment variables:
   ```bash
   export GHOST_ADMIN_KEY="YOUR_ADMIN_API_KEY"
   export GHOST_API_URL="https://yourblog.ghost.io"
   ```

3. **Test connection:**
   See [setup.md](references/setup.md) for detailed authentication and troubleshooting.

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
