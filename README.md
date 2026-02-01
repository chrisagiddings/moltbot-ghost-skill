# Ghost CMS Skill for Moltbot

Comprehensive Ghost CMS integration skill for [Moltbot](https://github.com/openclaw/openclaw) (formerly Clawdbot).

## ✨ Version 2.0 - Lexical Support

**Major Update:** Full Ghost 5.0+ and 6.0 compatibility with Lexical content format.

- ✅ **Lexical format support** - All content operations use Ghost's modern editor format
- ✅ **Ghost 6.0 compatible** - Works with latest Ghost releases
- ✅ **Helper utilities** - Built-in tools for content creation and CRUD operations
- ✅ **Bug fixes** - Resolved silent content update failures ([#12](https://github.com/chrisagiddings/moltbot-ghost-skill/issues/12))

See [CHANGELOG.md](CHANGELOG.md) and [LEXICAL-MIGRATION.md](ghost-cms-skill/LEXICAL-MIGRATION.md) for details.

## Features

- ✍️ **Content Management** - Create drafts, publish, schedule posts (Lexical format)
- 📊 **Analytics** - Email engagement metrics, subscriber growth, tag performance
- 💬 **Comments** - Read and respond to comments
- 👥 **Members** - Manage subscriber tiers and access
- 📧 **Newsletters** - Configure and send email campaigns
- 🔗 **API Coverage** - Ghost Admin API v5.0 (compatible with Ghost 5.x and 6.x)
- 🛠️ **Helper Scripts** - Lexical content builder and CRUD operations

## Installation

### Via Moltbot

```bash
# Once packaged and published to ClawdHub
moltbot skills install ghost-cms-skill
```

### Manual Installation

1. Clone this repo or download the `.skill` file
2. Copy `ghost-cms-skill/` to your Moltbot skills directory
3. Restart Moltbot

## Setup

1. **Get Ghost API credentials:**
   - Ghost dashboard → Settings → Integrations
   - Create "Custom Integration"
   - Copy Admin API Key and API URL

2. **Store credentials:**
   ```bash
   mkdir -p ~/.config/ghost
   echo "YOUR_ADMIN_API_KEY" > ~/.config/ghost/api_key
   echo "https://yourblog.ghost.io" > ~/.config/ghost/api_url
   ```

3. **Install dependencies (for helper scripts):**
   ```bash
   cd ghost-cms-skill/scripts
   npm install
   ```

See [setup.md](ghost-cms-skill/references/setup.md) for detailed instructions.

## Usage Examples

**Create a draft:**
> "Draft a blog post about [topic] and save it to Ghost"

**Publish content:**
> "Publish my latest draft post"

**Check analytics:**
> "How many members does my blog have?"
> "What was my most popular post by email opens?"

**Check comments:**
> "Are there any comments I need to respond to?"

**Tag performance:**
> "What tags have been most popular in the past 6 months?"

**Scheduled content:**
> "Schedule a post for next Monday at 9am"

**Newsletter:**
> "When was my most recent newsletter sent out?"

## Helper Scripts

### ghost-crud.js - Complete CRUD Operations

Simplified content management with automatic Lexical conversion:

```bash
cd ghost-cms-skill/scripts

# Create a post
node ghost-crud.js create "Post Title" "Content here"

# Read a post
node ghost-crud.js read <post-id-or-slug>

# List posts
node ghost-crud.js list "status:draft"

# Update content
node ghost-crud.js update <post-id> "New content"

# Publish a draft
node ghost-crud.js publish <post-id>

# Schedule for future
node ghost-crud.js schedule <post-id> "2026-02-10T09:00:00Z"

# Delete a post
node ghost-crud.js delete <post-id>
```

### lexical-builder.js - Content Format Helper

Build Lexical-formatted content:

```bash
# Simple text to Lexical
node lexical-builder.js text "Your content here"

# Structured content
node lexical-builder.js structured '[{"type":"h2","text":"Title"},{"type":"p","text":"Content"}]'

# See examples
node lexical-builder.js example
```

### ghost-api.js - Low-Level API Access

Direct API calls with JWT authentication:

```bash
# Get site info
node ghost-api.js /site/

# List posts with filters
node ghost-api.js '/posts/?limit=5&filter=status:draft'

# Get post with HTML output
node ghost-api.js '/posts/<id>/?formats=html'
```

## Documentation

### Core Documentation
- **[SKILL.md](ghost-cms-skill/SKILL.md)** - Main skill file with overview and navigation
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes
- **[LEXICAL-MIGRATION.md](ghost-cms-skill/LEXICAL-MIGRATION.md)** - Lexical format migration guide

### Reference Guides
- **[setup.md](ghost-cms-skill/references/setup.md)** - Authentication and configuration
- **[content.md](ghost-cms-skill/references/content.md)** - Creating and managing posts (Lexical format)
- **[lexical-cards.md](ghost-cms-skill/references/lexical-cards.md)** - Complete Lexical card type reference
- **[analytics.md](ghost-cms-skill/references/analytics.md)** - Analytics capabilities and limitations
- **[comments.md](ghost-cms-skill/references/comments.md)** - Comment management and responses
- **[members.md](ghost-cms-skill/references/members.md)** - Subscriber tier management
- **[newsletters.md](ghost-cms-skill/references/newsletters.md)** - Newsletter configuration
- **[api-reference.md](ghost-cms-skill/references/api-reference.md)** - Quick API endpoint lookup

## Ghost 6.0 Compatibility

**Fully compatible** with Ghost 6.0, but note some limitations:

### ✅ What Works
- **Content operations** - Create, read, update, delete (Lexical format)
- **Email metrics** - Opens, clicks, delivery status
- **Member management** - Counts, growth, tier distribution
- **Newsletter operations** - Configuration and sending
- **Tag/author statistics** - Usage and popularity

### ❌ API Limitations
- **Web traffic analytics** - Not available via integration tokens
- **Real-time visitor data** - Requires Ghost Admin UI
- **Advanced Ghost Analytics** - Dashboard-only features

**Why:** Integration API tokens don't have permission for Ghost 6.0's full analytics suite (`/stats/*` endpoints).

**Alternatives:**
- Use Ghost Admin web interface for traffic analytics
- Email engagement metrics ARE available (and very useful!)
- Configure Tinybird integration (self-hosted Ghost only)
- Use third-party analytics (Google Analytics, Plausible, etc.)

See [analytics.md](ghost-cms-skill/references/analytics.md) for complete details.

## Content Format: Lexical

**Important:** Ghost 5.0+ uses Lexical format for content. HTML is deprecated for write operations.

**What this means:**
- All content creation/updates use Lexical JSON format
- Helper scripts handle conversion automatically
- Ghost stores as mobiledoc internally (backwards compatibility)
- Read content as HTML using `?formats=html`

**Examples:**

```javascript
// Simple text
const content = textToLexical("Your content here");

// Structured content
const content = structuredToLexical([
  { type: 'h2', text: 'Heading' },
  { type: 'p', text: 'Paragraph', bold: true }
]);
```

See [LEXICAL-MIGRATION.md](ghost-cms-skill/LEXICAL-MIGRATION.md) for migration guide and format details.

## Supported Content Types

### ✅ Confirmed Working via API

All of these Lexical card types work with integration token authentication:

**Text & Structure:**
- ✅ Paragraphs
- ✅ Headings (H1-H6)
- ✅ Horizontal rules (dividers)
- ✅ Markdown cards (inline code/formatting)

**Media:**
- ✅ Image cards (single images with captions, alt text)
- ✅ Gallery cards (multi-image responsive layouts)
- ✅ Bookmark cards (link previews)

**Layout:**
- ✅ Callout/info boxes (with emoji and colored backgrounds)
- ✅ Signup cards (newsletter subscription forms)

See [lexical-cards.md](ghost-cms-skill/references/lexical-cards.md) for complete documentation with JSON examples.

### ❌ Known Restrictions

**Snippets:**
- ❌ Cannot be accessed via integration token API (403 Forbidden)
- Must be manually inserted via Ghost Admin UI
- See [issue #13](https://github.com/chrisagiddings/moltbot-ghost-skill/issues/13) for planned workaround

**Limited User Operations:**
- ❌ Cannot create, edit, or delete users via integration tokens
- ✅ Can browse and read user information
- Requires staff access token or user authentication for full access

### ⚠️ Unverified Card Types

These card types exist in Ghost's editor but haven't been tested via API:

- Button cards
- Toggle/accordion cards
- Audio cards
- Video cards
- File cards
- Product cards (e-commerce)
- Email CTA cards
- Third-party embeds (YouTube, Twitter, etc.)

If you test any of these, please document and contribute! See [lexical-cards.md](ghost-cms-skill/references/lexical-cards.md) for contribution guidelines.

## Requirements

- **Moltbot** v2026.1+
- **Ghost** v5.0+ (Admin API v5.0)
  - Fully compatible with Ghost 6.0
  - API v5.0 works with both Ghost 5.x and 6.x
- **Node.js** 22+ (for helper scripts)
- Valid Ghost Admin API credentials (integration token)

## Known Issues & Limitations

### Analytics Access
Integration tokens cannot access Ghost 6.0's full analytics suite. See [analytics.md](ghost-cms-skill/references/analytics.md) for workarounds.

### Content Format
HTML write operations are deprecated. Use Lexical format for all create/update operations.

See [Issues](https://github.com/chrisagiddings/moltbot-ghost-skill/issues) for current bugs and feature requests.

## Contributing

This skill follows [Moltbot skill standards](https://github.com/openclaw/openclaw/blob/main/skills/skill-creator/SKILL.md).

**To contribute:**
1. Fork this repo
2. Create a feature branch
3. Make your changes (follow existing structure and style)
4. Test with real Ghost instances (5.x and 6.x)
5. Submit a pull request

**Areas for contribution:**
- User authentication support (for full analytics access)
- Tinybird integration examples
- Webhook automation workflows
- Multi-blog support
- Additional Lexical content helpers
- Theme management operations
- Page creation and management

## Version History

### v2.0.2 (2026-02-01)
- **Documentation:** Added comprehensive Lexical card type reference (lexical-cards.md)
- **Documentation:** Updated README with supported content types and API restrictions
- **Analysis:** Documented all working card types from published content

### v2.0.1 (2026-02-01)
- **Documentation:** Updated analytics.md with Ghost 6.0 API limitations and version coverage

### v2.0.0 (2026-02-01)
- **BREAKING:** Migrated to Lexical format for all content operations
- **Added:** lexical-builder.js helper utility
- **Added:** ghost-crud.js comprehensive CRUD tool
- **Added:** LEXICAL-MIGRATION.md guide
- **Fixed:** Silent content update failures ([#12](https://github.com/chrisagiddings/moltbot-ghost-skill/issues/12))
- **Updated:** content.md completely rewritten for Lexical
- **Removed:** HTML and mobiledoc write support (deprecated)

See [CHANGELOG.md](CHANGELOG.md) for complete history.

## License

MIT License - See [LICENSE](LICENSE) for details

## Acknowledgments

Created for the Moltbot community by Chris Giddings with Navi.

Special thanks to:
- Ghost team for building an incredible publishing platform
- Moltbot/Clawdbot team for the extensible agent framework
- Meta for the Lexical editor framework

## Links

- **Ghost CMS:** https://ghost.org
- **Ghost 6.0 Release:** https://ghost.org/changelog/6/
- **Moltbot:** https://github.com/openclaw/openclaw
- **Ghost Admin API Docs:** https://ghost.org/docs/admin-api/
- **Lexical Framework:** https://lexical.dev/
- **Report Issues:** https://github.com/chrisagiddings/moltbot-ghost-skill/issues

---

**Note:** This skill is community-created and not officially maintained by Ghost or Moltbot. Use at your own discretion.

## Technical Details

### JWT Authentication

Ghost Admin API requires JWT token generation with admin API keys.

All helper scripts automatically:
- Read credentials from `~/.config/ghost/`
- Generate JWT tokens (5min expiry, HS256 algorithm)
- Handle API requests with proper authentication headers
- Use API version `v5.0` (compatible with Ghost 5.x and 6.x)

**Token format:**
```javascript
// Header
{
  "alg": "HS256",
  "kid": "<key-id>",
  "typ": "JWT"
}

// Payload
{
  "iat": <current-timestamp>,
  "exp": <current-timestamp + 300>,
  "aud": "/admin/"
}
```

For manual JWT generation in other languages, see Ghost's [token authentication docs](https://ghost.org/docs/admin-api/#token-authentication).

### Lexical Format

Ghost's Lexical format is JSON-based with a specific structure:

```json
{
  "root": {
    "children": [
      {
        "type": "paragraph",
        "children": [
          {
            "type": "extended-text",
            "text": "Content here",
            "format": 0
          }
        ]
      }
    ],
    "type": "root",
    "version": 1
  }
}
```

**Text formatting:**
- `format: 0` - Normal
- `format: 1` - Bold
- `format: 2` - Italic
- `format: 3` - Bold + Italic

**Node types:**
- `paragraph` - Standard paragraph
- `heading` - H1-H6 (with `tag` property)
- `extended-text` - Text node with formatting

See [LEXICAL-MIGRATION.md](ghost-cms-skill/LEXICAL-MIGRATION.md) for complete format documentation.
