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

## Interactive Content Cards

### Button Card
```json
{
  "type": "button",
  "version": 1,
  "buttonText": "Click Here",
  "alignment": "center",
  "buttonUrl": "https://example.com"
}
```

**Fields:**
- `buttonText` (string, required) - Button label
- `buttonUrl` (string, required) - Link destination
- `alignment` (string, optional) - "left" or "center" (default: "center")

**Usage:**
```javascript
// Simple button
{
  type: "button",
  version: 1,
  buttonText: "Subscribe Now",
  buttonUrl: "/subscribe",
  alignment: "center"
}
```

### Toggle Card
```json
{
  "type": "toggle",
  "version": 1,
  "heading": "<span style=\"white-space: pre-wrap;\">Click to expand</span>",
  "content": "<p dir=\"ltr\"><span style=\"white-space: pre-wrap;\">Hidden content here</span></p>"
}
```

**Fields:**
- `heading` (HTML string, required) - Toggle header/title
- `content` (HTML string, required) - Collapsible content

**Usage:**
```javascript
// FAQ toggle
{
  type: "toggle",
  version: 1,
  heading: "<span style=\"white-space: pre-wrap;\">How do I cancel?</span>",
  content: "<p dir=\"ltr\"><span style=\"white-space: pre-wrap;\">Visit your account settings...</span></p>"
}
```

## Media Upload Cards

### Video Card
```json
{
  "type": "video",
  "version": 1,
  "src": "https://example.com/video.mp4",
  "caption": "<p dir=\"ltr\"><span style=\"white-space: pre-wrap;\">Video caption</span></p>",
  "fileName": "video.mp4",
  "mimeType": "video/mp4",
  "width": 1920,
  "height": 1080,
  "duration": 120.5,
  "thumbnailSrc": "https://example.com/thumb.jpg",
  "customThumbnailSrc": "",
  "thumbnailWidth": 1920,
  "thumbnailHeight": 1080,
  "cardWidth": "regular",
  "loop": false
}
```

**Fields:**
- `src` (string, required) - Video file URL
- `caption` (HTML string, optional) - Video caption
- `fileName` (string, optional) - Original filename
- `mimeType` (string, optional) - video/mp4, video/webm, video/ogg
- `width`/`height` (number, optional) - Video dimensions
- `duration` (number, optional) - Duration in seconds
- `thumbnailSrc` (string, optional) - Auto-generated thumbnail
- `customThumbnailSrc` (string, optional) - Custom thumbnail URL
- `cardWidth` (string, optional) - "regular", "wide", or "full"
- `loop` (boolean, optional) - Loop video playback

**Supported Formats:** .mp4, .webm, .ogg  
**Max File Size:** 1GB (Ghost Pro plan-dependent)

### Audio Card
```json
{
  "type": "audio",
  "version": 1,
  "duration": 180.5,
  "mimeType": "audio/mpeg",
  "src": "https://example.com/audio.mp3",
  "title": "Podcast Episode 1",
  "thumbnailSrc": "https://example.com/cover.jpg"
}
```

**Fields:**
- `src` (string, required) - Audio file URL
- `title` (string, optional) - Audio title/name
- `duration` (number, optional) - Duration in seconds
- `mimeType` (string, optional) - audio/mpeg, audio/wav, audio/ogg
- `thumbnailSrc` (string, optional) - Cover art/thumbnail

**Supported Formats:** .mp3, .wav, .ogg  
**Max File Size:** 1GB (Ghost Pro plan-dependent)

### File Card
```json
{
  "type": "file",
  "src": "https://example.com/document.pdf",
  "fileTitle": "Download Guide",
  "fileCaption": "User manual and setup instructions",
  "fileName": "guide.pdf",
  "fileSize": 1024000
}
```

**Fields:**
- `src` (string, required) - File URL
- `fileTitle` (string, optional) - Display title
- `fileCaption` (string, optional) - File description
- `fileName` (string, optional) - Original filename
- `fileSize` (number, optional) - Size in bytes

**Supported Formats:** Any file type  
**Max File Size:** 1GB (Ghost Pro plan-dependent)

**Usage Examples:**
- Downloadable PDFs, ebooks
- Templates and swipe files
- Bonus content for paid members

## Advanced Content Cards

### Product Card
```json
{
  "type": "product",
  "version": 1,
  "productImageSrc": "https://example.com/product.jpg",
  "productImageWidth": 400,
  "productImageHeight": 400,
  "productTitle": "<span style=\"white-space: pre-wrap;\">Product Name</span>",
  "productDescription": "<p dir=\"ltr\"><span style=\"white-space: pre-wrap;\">Product description here</span></p>",
  "productRatingEnabled": true,
  "productStarRating": 4,
  "productButtonEnabled": true,
  "productButton": "Buy Now",
  "productUrl": "https://example.com/buy"
}
```

**Fields:**
- `productImageSrc` (string, optional) - Product image URL
- `productImageWidth`/`Height` (number, optional) - Image dimensions
- `productTitle` (HTML string, required) - Product name
- `productDescription` (HTML string, optional) - Product details
- `productRatingEnabled` (boolean, optional) - Show star rating
- `productStarRating` (number, optional) - 1-5 stars
- `productButtonEnabled` (boolean, optional) - Show buy button
- `productButton` (string, optional) - Button text
- `productUrl` (string, optional) - Purchase link

### Header Card
```json
{
  "type": "header",
  "version": 2,
  "size": "small",
  "style": "dark",
  "buttonEnabled": true,
  "buttonUrl": "https://example.com",
  "buttonText": "Learn More",
  "header": "<span style=\"white-space: pre-wrap;\">Section Title</span>",
  "subheader": "<span style=\"white-space: pre-wrap;\">Subtitle text</span>",
  "backgroundImageSrc": "https://example.com/bg.jpg",
  "accentColor": "#15171A",
  "alignment": "center",
  "backgroundColor": "#000000",
  "backgroundImageWidth": 1920,
  "backgroundImageHeight": 1080,
  "backgroundSize": "cover",
  "textColor": "#FFFFFF",
  "buttonColor": "#ffffff",
  "buttonTextColor": "#000000",
  "layout": "full",
  "swapped": false
}
```

**Fields:**
- `size` (string, optional) - "small", "medium", "large"
- `style` (string, optional) - "dark", "light", "accent"
- `buttonEnabled` (boolean, optional) - Show button
- `buttonUrl`/`buttonText` (string, optional) - Button config
- `header` (HTML string, required) - Main heading
- `subheader` (HTML string, optional) - Subtitle
- `backgroundImageSrc` (string, optional) - Background image
- `backgroundColor` (hex, optional) - Background color
- `textColor` (hex, optional) - Text color
- `buttonColor`/`buttonTextColor` (hex, optional) - Button colors
- `layout` (string, optional) - "wide", "full", "split"
- `alignment` (string, optional) - "left", "center"
- `swapped` (boolean, optional) - Reverse layout

**Use Cases:**
- Section dividers
- Landing page headers
- Feature highlights

### Call-to-Action Card
```json
{
  "type": "call-to-action",
  "version": 1,
  "layout": "minimal",
  "alignment": "left",
  "textValue": null,
  "showButton": true,
  "showDividers": true,
  "buttonText": "Learn more",
  "buttonUrl": "https://example.com",
  "buttonColor": "#000000",
  "buttonTextColor": "#ffffff",
  "hasSponsorLabel": true,
  "sponsorLabel": "<p><span style=\"white-space: pre-wrap;\">SPONSORED</span></p>",
  "backgroundColor": "grey",
  "linkColor": "text",
  "imageUrl": "https://example.com/image.jpg",
  "imageWidth": 600,
  "imageHeight": 400,
  "visibility": {
    "web": {
      "nonMember": true,
      "memberSegment": "status:free,status:-free"
    },
    "email": {
      "memberSegment": "status:free,status:-free"
    }
  }
}
```

**Fields:**
- `layout` (string, optional) - "minimal", "default"
- `alignment` (string, optional) - "left", "center"
- `showButton` (boolean, optional) - Display button
- `showDividers` (boolean, optional) - Show divider lines
- `buttonText`/`buttonUrl` (string, optional) - Button config
- `buttonColor`/`buttonTextColor` (hex, optional) - Button styling
- `hasSponsorLabel` (boolean, optional) - Show sponsor tag
- `sponsorLabel` (HTML string, optional) - Sponsor text
- `backgroundColor` (string, optional) - "grey", "white", or hex
- `linkColor` (string, optional) - "text", "accent", or hex
- `imageUrl` (string, optional) - CTA image
- `visibility` (object, optional) - Member visibility rules

**Member Visibility:**
- Target by membership status (free, paid)
- Show/hide in web vs. email
- Segment filtering capabilities

## Developer Content Cards

### HTML Card
```json
{
  "type": "html",
  "version": 1,
  "html": "<div class=\"custom-widget\">Custom HTML here</div>",
  "visibility": {
    "web": {
      "nonMember": true,
      "memberSegment": "status:free,status:-free"
    },
    "email": {
      "memberSegment": "status:free,status:-free"
    }
  }
}
```

**Fields:**
- `html` (string, required) - Custom HTML content
- `visibility` (object, optional) - Member visibility settings

**Use Cases:**
- Custom forms and widgets
- Third-party integrations
- Custom styling and layouts
- Embedded tools

**Note:** Already documented as "HTML" card in original documentation, confirmed structure.

### Paywall Card
```json
{
  "type": "paywall",
  "version": 1
}
```

**Purpose:** Public preview divider  
**Fields:** None - just marks the paywall position

**Behavior:**
- Content above is visible to all
- Content below requires paid membership
- Only one paywall per post

## Third-Party Embeds

### Embed Card (General Structure)
```json
{
  "type": "embed",
  "version": 1,
  "url": "https://example.com/embed",
  "embedType": "video",
  "html": "<iframe>...</iframe>",
  "metadata": {
    "title": "Embed Title",
    "type": "video",
    "provider_name": "Provider",
    ...
  },
  "caption": ""
}
```

**Fields:**
- `url` (string, required) - Original URL
- `embedType` (string, auto) - "video", "rich", "twitter", etc.
- `html` (string, auto) - oEmbed HTML
- `metadata` (object, auto) - oEmbed metadata
- `caption` (string, optional) - Caption text

**Supported Embed Types:**

#### YouTube Embed
```json
{
  "type": "embed",
  "version": 1,
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "embedType": "video",
  "html": "<iframe ...></iframe>",
  "metadata": {
    "title": "Video Title",
    "author_name": "Channel Name",
    "author_url": "https://www.youtube.com/@channel",
    "type": "video",
    "provider_name": "YouTube",
    "thumbnail_url": "https://i.ytimg.com/...",
    "thumbnail_width": 480,
    "thumbnail_height": 360
  },
  "caption": ""
}
```

#### Spotify Embed
```json
{
  "type": "embed",
  "version": 1,
  "url": "https://open.spotify.com/playlist/PLAYLIST_ID",
  "embedType": "rich",
  "html": "<iframe ...></iframe>",
  "metadata": {
    "html": "<iframe ...></iframe>",
    "iframe_url": "https://open.spotify.com/embed/...",
    "type": "rich",
    "provider_name": "Spotify",
    "title": "Playlist Name",
    "thumbnail_url": "https://image-cdn-ak.spotifycdn.com/...",
    "width": 456,
    "height": 352
  },
  "caption": ""
}
```

#### Twitter/X Embed
```json
{
  "type": "embed",
  "version": 1,
  "url": "https://twitter.com/username/status/STATUS_ID",
  "embedType": "twitter",
  "html": "<blockquote class=\"twitter-tweet\">...</blockquote>\n<script ...></script>",
  "metadata": {
    "url": "https://twitter.com/...",
    "author_name": "Author Name",
    "author_url": "https://twitter.com/username",
    "type": "twitter",
    "provider_name": "Twitter",
    "cache_age": "3153600000"
  },
  "caption": ""
}
```

**How Embeds Work:**
1. User pastes URL in Ghost editor
2. Ghost fetches oEmbed data from provider
3. Metadata and HTML stored in embed card
4. Rendered via metadata HTML

**Supported Providers:**
- YouTube
- Spotify
- Twitter/X
- Instagram
- TikTok
- Vimeo
- SoundCloud
- CodePen
- Many more via oEmbed

**Note:** Embed HTML is automatically generated by Ghost from the URL. When creating via API, you can provide minimal structure and Ghost will fetch metadata, or provide complete oEmbed data.

## Updated Card Type Index

### Verified & Documented (23 Card Types)

**Text Content:**
- Paragraph
- Heading (h1-h6)
- Markdown

**Media:**
- Image
- Gallery
- Bookmark
- Video ✨ NEW
- Audio ✨ NEW
- File ✨ NEW

**Layout:**
- Callout
- Horizontal Rule
- Header ✨ NEW

**Interactive:**
- Button ✨ NEW
- Toggle ✨ NEW
- Signup

**Marketing:**
- Call-to-Action ✨ NEW
- Product ✨ NEW

**Member Content:**
- Paywall ✨ NEW
- HTML (with visibility)

**Embeds:**
- Embed (YouTube, Spotify, Twitter, and many more) ✨ NEW

**Total:** 23 documented card types (10 newly added!)


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
