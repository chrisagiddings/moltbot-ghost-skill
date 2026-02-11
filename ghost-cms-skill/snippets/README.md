# Ghost Snippets Library

**Local snippet storage and management for Ghost CMS skill.**

## Problem

Ghost Admin API restricts snippet access for integration tokens (403 Forbidden). This prevents programmatic insertion of Ghost snippets via API.

## Solution

This directory provides a **local snippet library** that stores reusable content as Lexical JSON fragments.

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
