# Ghost Admin API Reference

Condensed API endpoint reference for quick lookups.

## Authentication

All requests require:
```bash
Authorization: Ghost ${ADMIN_API_KEY}
Content-Type: application/json
```

Base URL: `${GHOST_URL}/ghost/api/admin/`

## API Version

Current: **v5.0**

Include in request:
```bash
Accept-Version: v5.0
```

(Optional, defaults to latest)

## Posts

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/posts/` | GET | List all posts |
| `/posts/${id}/` | GET | Get single post |
| `/posts/` | POST | Create post |
| `/posts/${id}/` | PUT | Update post |
| `/posts/${id}/` | DELETE | Delete post |

**Query params:**
- `limit` - Number of posts (default 15, max 100, 'all' for unlimited)
- `page` - Page number for pagination
- `filter` - NQL filter string
- `order` - Sort order (e.g., `published_at desc`)
- `include` - Related data (tags, authors, count.comments)

**Common filters:**
- `status:draft` - Draft posts only
- `status:published` - Published only
- `status:scheduled` - Scheduled only
- `tag:slug` - Posts with specific tag
- `title:~'keyword'` - Title contains keyword
- `published_at:>'2026-01-01'` - Published after date

## Pages

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/pages/` | GET | List all pages |
| `/pages/${id}/` | GET | Get single page |
| `/pages/` | POST | Create page |
| `/pages/${id}/` | PUT | Update page |
| `/pages/${id}/` | DELETE | Delete page |

Same query params as posts.

## Tags

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tags/` | GET | List all tags |
| `/tags/${id}/` | GET | Get single tag |
| `/tags/` | POST | Create tag |
| `/tags/${id}/` | PUT | Update tag |
| `/tags/${id}/` | DELETE | Delete tag |

**Include options:**
- `count.posts` - Number of posts with tag

## Authors/Users

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users/` | GET | List users |
| `/users/${id}/` | GET | Get user |
| `/users/` | POST | Create user (invite) |
| `/users/${id}/` | PUT | Update user |
| `/users/${id}/` | DELETE | Delete user |

**Include options:**
- `count.posts` - Number of posts by author

## Members

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/members/` | GET | List members |
| `/members/${id}/` | GET | Get member |
| `/members/` | POST | Create member |
| `/members/${id}/` | PUT | Update member |
| `/members/${id}/` | DELETE | Delete member |

**Query params:**
- `search` - Search name/email
- `filter` - NQL filter (e.g., `status:paid`)
- `include` - Related data (newsletters, subscriptions)

**Common filters:**
- `status:free` - Free members
- `status:paid` - Paid members
- `status:comped` - Comped members
- `created_at:>'2026-01-01'` - Joined after date
- `label:vip` - Members with label

## Member Stats

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/members/stats/count/` | GET | Total member counts |
| `/members/stats/mrr/` | GET | Monthly recurring revenue |

## Tiers

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tiers/` | GET | List subscription tiers |
| `/tiers/${id}/` | GET | Get tier |
| `/tiers/` | POST | Create tier |
| `/tiers/${id}/` | PUT | Update tier |
| `/tiers/${id}/` | DELETE | Delete tier (archive) |

## Newsletters

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/newsletters/` | GET | List newsletters |
| `/newsletters/${id}/` | GET | Get newsletter |
| `/newsletters/` | POST | Create newsletter |
| `/newsletters/${id}/` | PUT | Update newsletter |
| `/newsletters/${id}/` | DELETE | Delete newsletter |

## Comments (if enabled)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/comments/` | GET | List comments |
| `/comments/${id}/` | GET | Get comment |
| `/comments/` | POST | Create comment (reply) |
| `/comments/${id}/` | PUT | Update comment status |
| `/comments/${id}/` | DELETE | Delete comment |

**Query params:**
- `filter` - NQL filter (e.g., `post_id:'${post_id}'`)
- `include` - Related data (post, member)

**Common filters:**
- `status:published` - Approved comments
- `status:pending` - Awaiting moderation
- `post_id:'${id}'` - Comments on specific post

## Images

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/images/upload/` | POST | Upload image |

**Request:**
```bash
curl -X POST "${GHOST_URL}/ghost/api/admin/images/upload/" \
  -H "Authorization: Ghost ${GHOST_KEY}" \
  -F "file=@image.jpg" \
  -F "purpose=image" \
  -F "ref=post_id_here"
```

Returns image URL.

## Site

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/site/` | GET | Get site configuration |

Returns:
- Title, description
- URL, timezone
- Version info
- Feature flags

## Settings

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/settings/` | GET | Get all settings |
| `/settings/` | PUT | Update settings |

**Note:** Most settings managed via Ghost Admin UI, not API.

## Webhooks

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/webhooks/` | GET | List webhooks |
| `/webhooks/` | POST | Create webhook |
| `/webhooks/${id}/` | PUT | Update webhook |
| `/webhooks/${id}/` | DELETE | Delete webhook |

**Webhook events:**
- `site.changed`
- `post.added`, `post.deleted`, `post.edited`, `post.published`, `post.unpublished`, `post.scheduled`
- `page.added`, `page.deleted`, `page.edited`, `page.published`, `page.unpublished`, `page.scheduled`
- `tag.added`, `tag.deleted`, `tag.edited`
- `member.added`, `member.deleted`, `member.edited`
- `member.subscription.added`, `member.subscription.deleted`, `member.subscription.updated`

## Response Format

All responses follow this structure:

**Success:**
```json
{
  "posts": [...],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 15,
      "pages": 5,
      "total": 67,
      "next": 2,
      "prev": null
    }
  }
}
```

**Error:**
```json
{
  "errors": [{
    "message": "Error message",
    "context": "Additional context",
    "type": "ValidationError",
    "details": null,
    "property": null,
    "help": "Help text",
    "code": "VALIDATION_ERROR",
    "id": "error_id"
  }]
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 204 | No Content - Deleted successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing API key |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Ghost error |

## Rate Limits

- **500 requests per hour** per integration
- Headers returned:
  - `X-RateLimit-Limit: 500`
  - `X-RateLimit-Remaining: 498`
  - `X-RateLimit-Reset: 1643673600`

When rate limited (429), response includes:
```json
{
  "errors": [{
    "message": "Too many requests.",
    "type": "RateLimitError"
  }]
}
```

## NQL (Ghost Query Language)

Ghost uses NQL for filtering. Common patterns:

**Comparisons:**
- `field:value` - Equals
- `field:~'value'` - Contains (case-insensitive)
- `field:>'value'` - Greater than
- `field:<'value'` - Less than
- `field:>='value'` - Greater than or equal
- `field:<='value'` - Less than or equal

**Logical:**
- `+` - AND (e.g., `status:published+tag:news`)
- `,` - OR (e.g., `status:draft,status:scheduled`)
- `-` - NOT (e.g., `-tag:archived`)

**Grouping:**
- `(...)` - Parentheses for precedence

**Examples:**
- `status:published+tag:tutorial` - Published posts tagged "tutorial"
- `status:[draft,scheduled]` - Drafts OR scheduled
- `published_at:>'2026-01-01'+tag:~'tech'` - Published after date, tech-related
- `-status:archived+created_at:>'2025-01-01'` - Not archived, created this year

## Pagination

Large result sets are paginated:

**Request:**
```bash
curl "${GHOST_URL}/ghost/api/admin/posts/?page=2&limit=15"
```

**Response meta:**
```json
{
  "meta": {
    "pagination": {
      "page": 2,
      "limit": 15,
      "pages": 5,
      "total": 67,
      "next": 3,
      "prev": 1
    }
  }
}
```

**Get all results:**
Use `limit=all` to bypass pagination (use carefully, can be slow for large datasets).

## Content Formats

Ghost accepts HTML for post/page content:

**Field:** `html`

**Format:** Valid HTML string

**Common elements:**
- `<p>` - Paragraphs
- `<h2>`, `<h3>`, etc. - Headings
- `<ul>`, `<ol>`, `<li>` - Lists
- `<a href="">` - Links
- `<img src="" alt="">` - Images
- `<pre><code>` - Code blocks
- `<blockquote>` - Quotes

**Ghost-specific cards:**
- `<figure class="kg-card kg-image-card">` - Image cards
- `<figure class="kg-card kg-gallery-card">` - Gallery
- `<figure class="kg-card kg-bookmark-card">` - Bookmark
- `<div class="kg-card kg-button-card">` - Button

**Alternative:** Ghost also supports `mobiledoc` and `lexical` formats (advanced).

## Common Patterns

### Paginated List

```bash
page=1
while true; do
  response=$(curl -s "${GHOST_URL}/ghost/api/admin/posts/?page=${page}" \
    -H "Authorization: Ghost ${GHOST_KEY}")
  
  # Process posts
  echo "$response" | jq '.posts[]'
  
  # Check if there's a next page
  next=$(echo "$response" | jq '.meta.pagination.next')
  if [ "$next" = "null" ]; then break; fi
  
  page=$next
done
```

### Batch Update

```bash
# Get all posts with old tag
posts=$(curl -s "${GHOST_URL}/ghost/api/admin/posts/?filter=tag:old-tag&limit=all" \
  -H "Authorization: Ghost ${GHOST_KEY}" | \
  jq -r '.posts[].id')

# Update each post
for id in $posts; do
  curl -X PUT "${GHOST_URL}/ghost/api/admin/posts/${id}/" \
    -H "Authorization: Ghost ${GHOST_KEY}" \
    -H "Content-Type: application/json" \
    -d '{
      "posts": [{
        "tags": [{"name": "new-tag"}]
      }]
    }'
done
```

### Error Handling

```bash
response=$(curl -s -w "\n%{http_code}" "${GHOST_URL}/ghost/api/admin/posts/" \
  -H "Authorization: Ghost ${GHOST_KEY}")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
  echo "$body" | jq '.posts'
else
  echo "Error $http_code:"
  echo "$body" | jq '.errors'
fi
```

## Additional Resources

- **Official docs:** https://ghost.org/docs/admin-api/
- **API explorer:** https://ghost.org/docs/admin-api/#explorer
- **JavaScript library:** @tryghost/admin-api
- **Community:** Ghost Forum (forum.ghost.org)
