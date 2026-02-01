# Changelog - Ghost CMS Skill

## [2.0.2] - 2026-02-01

### 📝 Documentation
- **lexical-cards.md** - New comprehensive Lexical card type reference
  - Documented all confirmed working card types (callout, gallery, image, bookmark, signup, markdown, horizontal rule)
  - Added JSON structure examples for each card type
  - Documented color options, layout options, and parameters
  - Included tips and best practices
  - Listed unverified card types for future testing
  - Reverse-engineered from published content analysis

- **README.md** - Enhanced with content type support information
  - Added "Supported Content Types" section with working/restricted breakdown
  - Documented API restrictions (snippets, user management)
  - Listed unverified card types that need testing
  - Added lexical-cards.md to reference guide links

### 🔍 Analysis
- Examined published wallpaper posts to extract real-world Lexical structures
- Confirmed 8 major card types work via integration token API
- Identified snippets API restriction (403 Forbidden) - see issue #13

## [2.0.1] - 2026-02-01

### 📝 Documentation
- **analytics.md** - Major update with API version and authentication coverage
  - Documented Ghost 6.0 analytics limitations with integration tokens
  - Added version compatibility notes (API v5.0 vs Ghost 6.0)
  - Clarified what analytics ARE available vs NOT available
  - Added authentication type comparison (integration vs user vs Tinybird)
  - Expanded troubleshooting section
  - Added best practices for working within API limitations

## [2.0.0] - 2026-02-01

### 🔧 BREAKING CHANGES
- **Migrated to Lexical format** for all content operations (Ghost 5.0+ requirement)
- Removed HTML and mobiledoc support for create/update operations
- All CRUD operations now use Lexical as the primary content format

### ✨ Added
- **lexical-builder.js** - Helper utilities for building Lexical content
  - `textToLexical()` - Convert plain text to Lexical format
  - `structuredToLexical()` - Convert structured content arrays to Lexical
  - Helper functions: `createParagraph()`, `createHeading()`, `createTextNode()`
  - CLI modes for testing: text, structured, example

- **ghost-crud.js** - Comprehensive CRUD operations tool
  - `create` - Create new posts with Lexical content
  - `read` - Read posts (with HTML output)
  - `list` - List posts with filters
  - `update` - Update post content with Lexical
  - `delete` - Delete posts
  - `publish` - Publish draft posts
  - `schedule` - Schedule posts for future publication
  - Automatic text/array → Lexical conversion

- **LEXICAL-MIGRATION.md** - Complete migration guide
  - Background on Ghost's Lexical migration
  - API behavior documentation
  - Lexical format structure examples
  - Helper tool usage guide
  - Migration checklist
  - Testing results and troubleshooting

### 📝 Changed
- **references/content.md** - Complete rewrite for Lexical format
  - Removed all HTML examples (deprecated for write operations)
  - Removed mobiledoc references (legacy format)
  - Added comprehensive Lexical structure documentation
  - Added text formatting codes (bold, italic, headings)
  - Updated all CRUD examples to use Lexical
  - Added JavaScript helper examples

### 🐛 Fixed
- **Content update bug** - Updates now work correctly with Lexical format
  - Previous issue: HTML updates returned 200 OK but content stayed null
  - Root cause: Ghost requires Lexical format, not HTML/mobiledoc
  - Solution: All create/update operations now use Lexical

### 🔍 Technical Details
- **Ghost version compatibility:** 5.0+ (tested on 6.0)
- **API version:** v5.0
- **Content flow:**
  - Write: Send `lexical` field → Ghost converts to mobiledoc internally
  - Read: Request `?formats=html` → Ghost returns rendered HTML
- **Storage format:** Ghost stores as mobiledoc (internal), accepts Lexical (API)

### 📊 Testing
Tested against Ghost 6.0 (chrisgiddings.net):
- ✅ Create posts with Lexical content
- ✅ Update existing posts with Lexical
- ✅ Read posts as HTML
- ✅ List/filter operations
- ✅ Publish and schedule operations
- ✅ Multiple paragraphs and headings render correctly

### 🚀 Migration Path
For existing code using this skill:

1. Update to Lexical format:
   ```javascript
   // OLD (broken):
   { posts: [{ html: "<p>Content</p>" }] }
   
   // NEW (working):
   { posts: [{ lexical: stringifyLexical(textToLexical("Content")) }] }
   ```

2. Use helper utilities:
   ```javascript
   import { textToLexical, stringifyLexical } from './lexical-builder.js';
   const content = stringifyLexical(textToLexical("Your text"));
   ```

3. Or use the CRUD tool:
   ```bash
   node ghost-crud.js create "Title" "Content"
   ```

### 📚 References
- [Ghost 6.0 Changelog](https://ghost.org/changelog/6/)
- [New Editor Announcement](https://ghost.org/changelog/new-editor/)
- [Lexical Framework](https://lexical.dev/)
- [Ghost Admin API](https://ghost.org/docs/admin-api/)

---

## [1.0.0] - Initial Release
- Basic Ghost CMS integration
- HTML-based content creation (deprecated)
- Authentication setup
- Content, analytics, members, newsletters support
