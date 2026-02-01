# Lexical Card Types Reference

Comprehensive documentation of Ghost's Lexical card types based on analysis of published content.

## Text Content

### Paragraph
```json
{
  "children": [
    {
      "detail": 0,
      "format": 0,
      "mode": "normal",
      "style": "",
      "text": "Paragraph text here",
      "type": "extended-text",
      "version": 1
    }
  ],
  "direction": "ltr",
  "format": "",
  "indent": 0,
  "type": "paragraph",
  "version": 1
}
```

### Heading
```json
{
  "children": [
    {
      "detail": 0,
      "format": 1,
      "mode": "normal",
      "style": "",
      "text": "Heading Text",
      "type": "extended-text",
      "version": 1
    }
  ],
  "direction": "ltr",
  "format": "",
  "indent": 0,
  "type": "extended-heading",
  "version": 1,
  "tag": "h2"
}
```

**Tag options:** `h1`, `h2`, `h3`, `h4`, `h5`, `h6`

**Format codes:**
- `0` - Normal
- `1` - Bold
- `2` - Italic
- `3` - Bold + Italic

## Media Cards

### Image Card
```json
{
  "type": "image",
  "version": 1,
  "src": "https://example.com/image.jpg",
  "width": 1024,
  "height": 768,
  "title": "",
  "alt": "Alt text",
  "caption": "Image caption",
  "cardWidth": "regular",
  "href": ""
}
```

**Card width options:**
- `"regular"` - Standard width
- `"wide"` - Wide layout
- `"full"` - Full width

### Gallery Card
```json
{
  "type": "gallery",
  "version": 1,
  "images": [
    {
      "row": 0,
      "src": "https://example.com/image1.jpg",
      "width": 1024,
      "height": 768,
      "fileName": "image1.jpg"
    },
    {
      "row": 0,
      "src": "https://example.com/image2.jpg",
      "width": 1024,
      "height": 768,
      "fileName": "image2.jpg"
    },
    {
      "row": 1,
      "src": "https://example.com/image3.jpg",
      "width": 1024,
      "height": 768,
      "fileName": "image3.jpg"
    }
  ],
  "caption": ""
}
```

**Layout:**
- Images with the same `row` value appear on the same row
- Ghost automatically handles responsive layout
- Typically 3 images per row on desktop

### Bookmark Card
```json
{
  "type": "bookmark",
  "version": 1,
  "url": "https://example.com",
  "metadata": {
    "icon": "",
    "title": "Link Title",
    "description": "Link description",
    "author": "",
    "publisher": "",
    "thumbnail": ""
  },
  "caption": ""
}
```

**Note:** Ghost fetches metadata automatically when the bookmark is created. For API creation, metadata fields can be empty strings.

## Layout Cards

### Callout/Info Box
```json
{
  "type": "callout",
  "version": 1,
  "calloutText": "<p><span style=\"white-space: pre-wrap;\">Your callout text here.</span><br><br><span style=\"white-space: pre-wrap;\">Multiple paragraphs supported.</span></p>",
  "calloutEmoji": "💡",
  "backgroundColor": "blue"
}
```

**Background color options:**
- `"blue"`
- `"green"`
- `"yellow"`
- `"red"`
- `"pink"`
- `"purple"`
- `"white"` (grey border)
- `"grey"` or `"gray"` (grey background)
- `"accent"` (uses theme accent color)

**Common emoji:**
- 💡 (info)
- ⚠️ (warning)
- ❌ (error)
- ✅ (success)
- 🧠 (knowledge)
- ❣️ (love/support)

### Horizontal Rule (Divider)
```json
{
  "type": "horizontalrule",
  "version": 1
}
```

Simple divider line between content sections.

## Code & Technical

### Markdown Card
```json
{
  "type": "markdown",
  "version": 1,
  "markdown": "`inline code` or **formatted text**"
}
```

Supports inline markdown syntax for technical content.

## Newsletter/Email Cards

### Signup Card
```json
{
  "type": "signup",
  "version": 1,
  "alignment": "left",
  "backgroundColor": "#F0F0F0",
  "backgroundImageSrc": "",
  "backgroundSize": "cover",
  "textColor": "#000000",
  "buttonColor": "accent",
  "buttonTextColor": "#FFFFFF",
  "buttonText": "Subscribe",
  "disclaimer": "<span style=\"white-space: pre-wrap;\">No spam. Unsubscribe anytime.</span>",
  "header": "<span style=\"white-space: pre-wrap;\">Sign up for Newsletter</span>",
  "labels": [],
  "layout": "wide",
  "subheader": "<span style=\"white-space: pre-wrap;\">Get updates delivered to your inbox.</span>",
  "successMessage": "Email sent! Check your inbox to complete your signup.",
  "swapped": false
}
```

**Alignment options:** `"left"`, `"center"`

**Layout options:** `"wide"`, `"full"`, `"split"`

**Button color options:**
- `"accent"` - Uses theme accent color
- Any hex color code (e.g., `"#FF5733"`)

**Labels:** Array of newsletter label strings (for segmentation)

## Example: Complete Post Structure

```json
{
  "root": {
    "children": [
      {
        "type": "callout",
        "version": 1,
        "calloutText": "<p><span style=\"white-space: pre-wrap;\">Introduction callout</span></p>",
        "calloutEmoji": "💡",
        "backgroundColor": "blue"
      },
      {
        "children": [
          {
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "Main content paragraph",
            "type": "extended-text",
            "version": 1
          }
        ],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "type": "paragraph",
        "version": 1
      },
      {
        "type": "gallery",
        "version": 1,
        "images": [
          {
            "row": 0,
            "src": "https://example.com/image1.jpg",
            "width": 1024,
            "height": 768,
            "fileName": "image1.jpg"
          }
        ],
        "caption": ""
      },
      {
        "type": "horizontalrule",
        "version": 1
      },
      {
        "type": "signup",
        "version": 1,
        "alignment": "left",
        "backgroundColor": "#F0F0F0",
        "backgroundImageSrc": "",
        "backgroundSize": "cover",
        "textColor": "#000000",
        "buttonColor": "accent",
        "buttonTextColor": "#FFFFFF",
        "buttonText": "Subscribe",
        "disclaimer": "<span style=\"white-space: pre-wrap;\">No spam.</span>",
        "header": "<span style=\"white-space: pre-wrap;\">Newsletter</span>",
        "labels": [],
        "layout": "wide",
        "subheader": "<span style=\"white-space: pre-wrap;\">Stay updated</span>",
        "successMessage": "Email sent!",
        "swapped": false
      }
    ],
    "direction": "ltr",
    "format": "",
    "indent": 0,
    "type": "root",
    "version": 1
  }
}
```

## Known Limitations

### Snippets
Snippets cannot be accessed or inserted via the Admin API with integration tokens (403 Forbidden). Snippets must be:
- Manually inserted via Ghost Admin UI, or
- Stored locally and programmatically inserted as card content

See issue #13 for planned snippet support.

## Additional Card Types (Unverified)

These card types are known to exist in Ghost's editor but haven't been confirmed to work via API:

- **Button card** - Call-to-action buttons
- **Toggle/Accordion** - Collapsible content
- **Audio card** - Audio embeds
- **Video card** - Video embeds  
- **File card** - Downloadable files
- **Product card** - E-commerce products
- **Email CTA** - Member-only call-to-action
- **Embed card** - Third-party embeds (YouTube, Twitter, etc.)

If you encounter or test these card types, please document their Lexical structure and submit a PR.

## Tips & Best Practices

1. **Callouts for key information** - Use callouts to highlight important notes, warnings, or tips
2. **Galleries for multiple images** - More efficient than multiple image cards
3. **Horizontal rules for sections** - Visual separation between content sections
4. **Signup cards strategically** - Place at the end or after valuable content
5. **Markdown for code snippets** - Better formatting than plain paragraphs
6. **Alt text for accessibility** - Always provide meaningful alt text for images
7. **Captions add context** - Use image/gallery captions to provide additional information

## Converting HTML to Lexical

When migrating content from HTML or other formats, map HTML elements to Lexical cards:

| HTML | Lexical Card Type |
|------|-------------------|
| `<p>` | paragraph |
| `<h1>-<h6>` | extended-heading |
| `<img>` | image |
| `<blockquote>` | quote (not documented) |
| `<hr>` | horizontalrule |
| `<pre><code>` | markdown or code (not documented) |
| `<div class="callout">` | callout |

## Further Reading

- Ghost Editor documentation: https://ghost.org/help/using-the-editor/
- Ghost Admin API: https://ghost.org/docs/admin-api/
- Lexical framework: https://lexical.dev/
