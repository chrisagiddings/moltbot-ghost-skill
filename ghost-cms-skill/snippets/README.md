# Ghost Snippets Library

**Local snippet storage and management for Ghost CMS skill.**

## Understanding Ghost Snippets

### What Are Ghost Snippets?

**Ghost's native snippet feature** allows authors to save reusable content blocks in the Ghost editor:

- 📝 **Create once, reuse everywhere** - Save frequently-used content (signatures, CTAs, disclosures)
- 🎨 **Any content type** - Bookmarks, callouts, paragraphs, images, or any Lexical cards
- 📋 **Named and organized** - Give snippets descriptive names ("Signature", "Newsletter CTA", "Affiliate Disclosure")
- 🖱️ **Easy insertion** - Insert via Ghost editor UI (type `/` and select snippet)
- 💾 **Stored in Ghost database** - Part of your Ghost site, accessible to all authors

**Example Ghost snippets:**
- "Signature" - Author bio with social links
- "Book Insert" - Standard book review template
- "Newsletter Footer" - Subscription CTA with button
- "Disclosure" - Affiliate link disclaimer

### How Ghost Snippets Work

**Under the hood:**

1. **You create content** (e.g., a bookmark card for your Twitch profile)
2. **Save as snippet** via Ghost editor → "Save as snippet" → Name it "Signature"
3. **Ghost stores the Lexical cards** as a template in the database
4. **When inserted**, Ghost **copies** the cards into your post
5. **No reference remains** - the cards become independent

**Important:** Ghost snippets are **templates, not live references**. Updating a snippet doesn't update existing posts that used it.

**Lexical structure example:**

When you insert a snippet created from a bookmark, Ghost copies the bookmark card:

```json
{
  "type": "bookmark",
  "url": "https://www.twitch.tv/yourname",
  "metadata": { "title": "...", "description": "..." },
  "caption": "Follow me on Twitch!"
}
```

**No "snippet" card type exists** - snippets are just collections of regular Lexical cards.

---

## The Problem: API Limitation

### Ghost Admin API Restriction

**The Ghost Admin API blocks snippet access for integration tokens:**

```bash
GET /ghost/api/admin/snippets/
→ 403 Forbidden
```

**What this means:**

❌ **Cannot list snippets** - Can't see what snippets exist  
❌ **Cannot fetch snippet content** - Can't get the Lexical cards  
❌ **Cannot insert by reference** - Can't say "insert snippet 'Signature'"  
❌ **Cannot discover author's snippets** - If you have 12 snippets in Ghost, we can't access them programmatically  

**Why this limitation exists:**

- Integration tokens have restricted permissions (security feature)
- Snippets are considered author-specific content
- Only user authentication (logging in) can access snippets
- API integration tokens are meant for automated/programmatic use

**Impact:**

If you have existing snippets in Ghost (e.g., "Signature", "Book Insert", "Newsletter Footer"), you **cannot** programmatically:
- List them via API
- Fetch their content
- Use them when building posts programmatically

---

## The Solution: Local Snippet Library

This directory provides a **local snippet library** that replicates Ghost's snippet functionality for programmatic use:

**How it works:**

1. **Store snippets as JSON files** (same Lexical card format Ghost uses)
2. **Load snippets programmatically** in your code
3. **Inject into posts** when building content via API
4. **Version control** via git (bonus feature Ghost doesn't have!)

**Functionally equivalent to Ghost snippets:**
- ✅ Reusable content blocks
- ✅ Stored as Lexical card arrays
- ✅ Copied into posts (not referenced)
- ✅ Same card types Ghost uses

**Key difference:**
- Ghost snippets: Stored in Ghost database, accessible via editor UI
- Local snippets: Stored as JSON files, accessible via code/CLI

### Migrating Ghost Snippets to Local Library

**If you have existing snippets in Ghost**, you'll need to manually export them:

**Option 1: Via Ghost Editor (Manual)**
1. Create a test post in Ghost
2. Insert each snippet via editor
3. Fetch the post via API (`GET /posts/{id}?formats=lexical`)
4. Extract the snippet cards from the Lexical JSON
5. Save as local JSON file

**Option 2: Database Access (Self-Hosted Only)**
1. Query Ghost database `snippets` table
2. Extract Lexical content for each snippet
3. Convert to local JSON files

**After migration:**
- ✅ Programmatic access to your snippets
- ✅ Use in automated post creation
- ✅ Git version control
- ⚠️ Must manually sync changes (no automatic sync with Ghost)

## Directory Structure

```
snippets/
├── README.md          # This file
├── library/           # Your custom snippets
│   ├── signature.json
│   ├── cta-newsletter.json
│   └── disclosure.json
├── examples/          # Example snippets (reference)
│   ├── signature-example.json
│   ├── callout-tip.json
│   └── button-cta.json
└── ghost-snippet.js   # Snippet management CLI
```

## Usage

### 1. Create a Snippet

**Save a Lexical fragment to library:**

```bash
# Create signature.json in library/
cat > snippets/library/signature.json << 'EOF'
[
  {
    "type": "paragraph",
    "children": [
      {
        "type": "extended-text",
        "text": "— Chris Giddings",
        "format": 2,
        "version": 1
      }
    ],
    "version": 1
  }
]
EOF
```

### 2. List Available Snippets

```bash
node snippets/ghost-snippet.js list
```

Output:
```
Available snippets:
  - signature
  - cta-newsletter
  - disclosure
```

### 3. Preview a Snippet

```bash
node snippets/ghost-snippet.js preview signature
```

### 4. Inject Snippet into Post

**Method A: Via CLI (creates new post with snippet)**
```bash
node snippets/ghost-snippet.js inject signature \
  --title "New Post with Signature" \
  --content "Main content here"
```

**Method B: Programmatically (JavaScript)**
```javascript
import { loadSnippet, injectSnippet } from './snippets/ghost-snippet.js';

// Load snippet
const signature = loadSnippet('signature');

// Build post content with snippet
const lexicalContent = {
  root: {
    children: [
      createParagraph("Main content here"),
      ...signature,  // Inject snippet
      createParagraph("More content")
    ],
    type: "root",
    version: 1
  }
};

// Create post via Ghost API
```

## Snippet Format

Snippets are **Lexical card arrays** - JSON arrays of Lexical card objects.

**Simple snippet (one card):**
```json
[
  {
    "type": "paragraph",
    "children": [{
      "type": "extended-text",
      "text": "Hello world",
      "version": 1
    }],
    "version": 1
  }
]
```

**Complex snippet (multiple cards):**
```json
[
  {
    "type": "callout",
    "version": 1,
    "calloutText": "<p><span>💡 Pro Tip</span></p>",
    "calloutEmoji": "💡",
    "backgroundColor": "blue"
  },
  {
    "type": "horizontalrule",
    "version": 1
  }
]
```

## Creating Snippets from Existing Content

**Extract from a Ghost post:**

1. Fetch post with lexical format:
```bash
curl "${GHOST_API_URL}/ghost/api/admin/posts/${POST_ID}/?formats=lexical" \
  -H "Authorization: Ghost ${GHOST_ADMIN_KEY}" \
  | jq '.posts[0].lexical | fromjson | .root.children[2:4]' \
  > snippets/library/my-snippet.json
```

2. Save the cards you want to reuse

3. Use in future posts!

## Common Snippet Patterns

### Newsletter CTA
```json
[
  {
    "type": "callout",
    "calloutText": "<p><span>📧 Enjoying this content?</span></p>",
    "calloutEmoji": "📧",
    "backgroundColor": "blue"
  },
  {
    "type": "button",
    "buttonText": "Subscribe to Newsletter",
    "buttonUrl": "/subscribe",
    "alignment": "center",
    "version": 1
  }
]
```

### Disclosure
```json
[
  {
    "type": "callout",
    "calloutText": "<p><span>Disclosure: This post may contain affiliate links.</span></p>",
    "calloutEmoji": "ℹ️",
    "backgroundColor": "grey"
  }
]
```

### Author Signature
```json
[
  {
    "type": "horizontalrule",
    "version": 1
  },
  {
    "type": "paragraph",
    "children": [{
      "type": "extended-text",
      "text": "— Your Name",
      "format": 2,
      "version": 1
    }],
    "version": 1
  }
]
```

### Table of Contents Placeholder
```json
[
  {
    "type": "callout",
    "calloutText": "<p><span>📋 Table of Contents</span></p>",
    "calloutEmoji": "📋",
    "backgroundColor": "white"
  }
]
```

## Best Practices

**1. Use Descriptive Names**
- ✅ `disclosure-affiliate.json`
- ✅ `cta-newsletter-footer.json`
- ❌ `snippet1.json`

**2. Include Comments in Lexical**
```json
[
  {
    "type": "paragraph",
    "children": [{
      "type": "extended-text",
      "text": "<!-- SNIPPET: Author signature - last updated 2026-02-10 -->",
      "version": 1
    }]
  }
]
```

**3. Version Your Snippets**
- Use git to track changes
- Date snippets when they change significantly
- `signature-2026.json` vs `signature-2025.json`

**4. Test Before Using**
- Preview snippets with `ghost-snippet.js preview`
- Test in draft posts first
- Verify rendering in Ghost Admin

**5. Keep Snippets Atomic**
- One purpose per snippet
- Combine in code if needed
- Easier to maintain and reuse

## Advanced: Snippet Variables

**Problem:** Snippets are static, but sometimes you need dynamic content.

**Solution:** Use template placeholders + string replacement:

**Template snippet (cta-product.json):**
```json
[
  {
    "type": "product",
    "productTitle": "<span>{{PRODUCT_NAME}}</span>",
    "productDescription": "<p>{{PRODUCT_DESC}}</p>",
    "productUrl": "{{PRODUCT_URL}}",
    "version": 1
  }
]
```

**Replace in code:**
```javascript
let snippet = loadSnippet('cta-product');
let rendered = JSON.stringify(snippet)
  .replace('{{PRODUCT_NAME}}', 'My Product')
  .replace('{{PRODUCT_DESC}}', 'Amazing product description')
  .replace('{{PRODUCT_URL}}', 'https://example.com/buy');
snippet = JSON.parse(rendered);
```

## Limitations

**Not the same as Ghost snippets:**
- Ghost snippets are stored in Ghost database
- Local snippets are just JSON files
- No UI integration (command-line only)
- Must be manually synced across machines

**Workarounds:**
- Store snippets in git (version control + sync)
- Share snippet library across team
- Export/import snippet packs

## Migration Path

**If Ghost adds API snippet support in the future:**

The local snippet format is compatible! You can:
1. Upload snippets to Ghost via API
2. Continue using local snippets as backup
3. Gradually migrate to Ghost-native snippets

---

**See:** `ghost-snippet.js` for CLI commands  
**Examples:** `examples/` directory  
**Issue:** [#13](https://github.com/chrisagiddings/moltbot-ghost-skill/issues/13)
