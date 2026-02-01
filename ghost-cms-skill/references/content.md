# Content Management

Creating, publishing, scheduling, and managing Ghost posts and pages.

## Creating Posts

### Basic Post Creation

```bash
curl -X POST "${GHOST_URL}/ghost/api/admin/posts/" \
  -H "Authorization: Ghost ${GHOST_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "posts": [{
      "title": "Your Post Title",
      "html": "<p>Your content here</p>",
      "status": "draft"
    }]
  }'
```

### Post with Full Metadata

```bash
curl -X POST "${GHOST_URL}/ghost/api/admin/posts/" \
  -H "Authorization: Ghost ${GHOST_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "posts": [{
      "title": "Complete Post Example",
      "html": "<p>Full post content with formatting</p>",
      "status": "draft",
      "tags": [
        {"name": "Technology"},
        {"name": "Tutorial"}
      ],
      "authors": [
        {"email": "navi@chrisgiddings.net"}
      ],
      "feature_image": "https://example.com/image.jpg",
      "featured": false,
      "meta_title": "SEO Title",
      "meta_description": "SEO description",
      "og_title": "Social Media Title",
      "og_description": "Social media description"
    }]
  }'
```

## Publishing & Scheduling

### Publish Immediately

```bash
curl -X PUT "${GHOST_URL}/ghost/api/admin/posts/${POST_ID}/" \
  -H "Authorization: Ghost ${GHOST_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "posts": [{
      "status": "published",
      "published_at": null
    }]
  }'
```

`published_at: null` means "publish now"

### Schedule for Future

```bash
curl -X PUT "${GHOST_URL}/ghost/api/admin/posts/${POST_ID}/" \
  -H "Authorization: Ghost ${GHOST_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "posts": [{
      "status": "scheduled",
      "published_at": "2026-02-10T09:00:00.000Z"
    }]
  }'
```

**Date format:** ISO 8601 with timezone (UTC)

## Updating Posts

### Update Content

```bash
curl -X PUT "${GHOST_URL}/ghost/api/admin/posts/${POST_ID}/" \
  -H "Authorization: Ghost ${GHOST_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "posts": [{
      "html": "<p>Updated content</p>",
      "updated_at": "2026-01-31T12:00:00.000Z"
    }]
  }'
```

**Important:** Include `updated_at` from the original post to prevent conflicts.

### Update Tags

```bash
curl -X PUT "${GHOST_URL}/ghost/api/admin/posts/${POST_ID}/" \
  -H "Authorization: Ghost ${GHOST_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "posts": [{
      "tags": [
        {"name": "New Tag"},
        {"name": "Another Tag"}
      ]
    }]
  }'
```

Tags are **replaced**, not appended. Include existing tags to keep them.

## Listing Posts

### Get All Posts

```bash
curl "${GHOST_URL}/ghost/api/admin/posts/?limit=15&include=authors,tags" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

### Filter by Status

**Drafts only:**
```bash
curl "${GHOST_URL}/ghost/api/admin/posts/?filter=status:draft" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

**Published only:**
```bash
curl "${GHOST_URL}/ghost/api/admin/posts/?filter=status:published" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

**Scheduled only:**
```bash
curl "${GHOST_URL}/ghost/api/admin/posts/?filter=status:scheduled" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

### Search Posts

```bash
curl "${GHOST_URL}/ghost/api/admin/posts/?filter=title:~'keyword'" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

The `~` operator means "contains"

### Recent Posts

```bash
curl "${GHOST_URL}/ghost/api/admin/posts/?order=published_at%20desc&limit=5" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

## Member-Exclusive Content

### Set Visibility Tier

```bash
curl -X POST "${GHOST_URL}/ghost/api/admin/posts/" \
  -H "Authorization: Ghost ${GHOST_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "posts": [{
      "title": "Premium Content",
      "html": "<p>Exclusive content</p>",
      "visibility": "paid",
      "tiers": [
        {"id": "tier_id_here"}
      ]
    }]
  }'
```

**Visibility options:**
- `public` - Everyone (default)
- `members` - All logged-in members
- `paid` - Paid members only
- `tiers` - Specific tiers (requires `tiers` array)

### Find Tier IDs

```bash
curl "${GHOST_URL}/ghost/api/admin/tiers/" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

## Tags

### Create New Tag

```bash
curl -X POST "${GHOST_URL}/ghost/api/admin/tags/" \
  -H "Authorization: Ghost ${GHOST_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "tags": [{
      "name": "New Tag",
      "slug": "new-tag",
      "description": "Tag description"
    }]
  }'
```

### List All Tags

```bash
curl "${GHOST_URL}/ghost/api/admin/tags/?limit=all" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

## Pages vs Posts

**Posts** appear in RSS feed, blog index, are dated.
**Pages** are standalone (About, Contact, etc.)

Create pages the same way as posts, but use `/pages/` endpoint:

```bash
curl -X POST "${GHOST_URL}/ghost/api/admin/pages/" \
  -H "Authorization: Ghost ${GHOST_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "pages": [{
      "title": "About Page",
      "html": "<p>About content</p>",
      "status": "published"
    }]
  }'
```

## Content Formatting

Ghost accepts **HTML** in the `html` field. Common patterns:

**Paragraphs:**
```html
<p>This is a paragraph.</p>
```

**Headings:**
```html
<h2>Heading 2</h2>
<h3>Heading 3</h3>
```

**Lists:**
```html
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

**Code blocks:**
```html
<pre><code class="language-python">
def hello():
    print("Hello!")
</code></pre>
```

**Images:**
```html
<figure class="kg-card kg-image-card">
  <img src="https://example.com/image.jpg" alt="Description">
  <figcaption>Image caption</figcaption>
</figure>
```

**Markdown alternative:** Ghost also supports `mobiledoc` format, but HTML is simpler for programmatic generation.

## Common Workflows

### Draft from Notion → Ghost

1. Content drafted collaboratively in Notion
2. Export Notion page as HTML or Markdown
3. Convert to Ghost HTML format if needed
4. POST to Ghost as draft
5. Review in Ghost admin
6. Publish or schedule

### Weekly Series (Automated)

1. Generate content based on weekly topics/discussions
2. Set author to "Navi" (find author by email)
3. Apply consistent tags (e.g., "Weekly Series")
4. Schedule for consistent day/time (e.g., Monday 9am)
5. POST with `status: scheduled`

### Bulk Tag Update

1. List posts with filter
2. For each post, GET current tags
3. Append new tag to existing list
4. PUT updated tags back

## Best Practices

- **Always include `updated_at`** when updating posts (prevents conflicts)
- **Use slugs for URLs** - Auto-generated from title, but can override
- **Feature images** - Use HTTPS URLs, ideally on your domain or CDN
- **SEO metadata** - Set `meta_title`, `meta_description`, `og_title`, `og_description`
- **Tags are lowercase** - Ghost auto-lowercases tag names
- **Test in draft first** - Create as draft, review in admin, then publish
