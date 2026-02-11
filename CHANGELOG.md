# Changelog - Ghost CMS Skill

## [0.1.8] - 2026-02-11

### 🔒 CRITICAL Security Fixes (Multiple Vulnerabilities)

VirusTotal scan identified multiple critical path traversal and arbitrary file write vulnerabilities. All have been fixed:

- **Issue #33:** Path traversal in ghost-crud.js API endpoints (FIXED)
  - Added `validatePostIdentifier()` to prevent path traversal via slugOrId/postId
  - Applied to readPost(), updatePost(), deletePost()
  - Prevents attackers from accessing unintended API endpoints

- **Issue #35:** Path traversal in theme-manager.js API endpoints (FIXED)
  - Added `validateThemeName()` to prevent path traversal via themeName
  - Applied to downloadTheme(), activate(), delete()
  - Prevents endpoint manipulation attacks

- **Issue #36:** Arbitrary file write/delete in ghost-snippet.js (FIXED)
  - Added `validateSnippetName()` to prevent path traversal
  - Applied to loadSnippet(), saveSnippet(), deleteSnippet()
  - Prevents attackers from targeting system files

- **Issue #34:** snippet-extractor.js security (VERIFIED SAFE)
  - Already has comprehensive `sanitizeSnippetName()` function
  - VirusTotal confirmed: "demonstrates good security practices"
  - No fix needed - false positive

**Before:** Multiple critical vulnerabilities allowing path traversal and arbitrary file operations  
**After:** All user input validated before API endpoint construction and file operations

## [0.1.7] - 2026-02-11

### 📝 Metadata Clarification
- **Added explicit source information** to SKILL.md frontmatter
  - Added `author: Chris Giddings`
  - Added `homepage: https://github.com/chrisagiddings/moltbot-ghost-skill`
  - Added `repository: https://github.com/chrisagiddings/moltbot-ghost-skill`
  - Should resolve "unknown source" warnings from security scanners

**Note:** SKILL.md metadata correctly declares `disable-model-invocation: true` and proper install spec. If registry-level flags still show mismatches after this version, it indicates a ClawdHub platform bug that requires escalation.

## [0.1.6] - 2026-02-11

### 🔒 CRITICAL Security Fix
- **Arbitrary File Write Prevention** (Issue #32) - Fixed critical vulnerability in `theme-manager.js`
  - Added `validateOutputPath()` to prevent attackers from overwriting system files
  - Restricts downloads to current working directory
  - Prevents path traversal in directory and filename
  - Requires .zip extension
  - Blocks writes to system directories (/etc, ~/.ssh, etc.)
  - **Severity:** CRITICAL - prevented arbitrary file overwrite attacks

## [0.1.5] - 2026-02-11

### 🔒 Security Fixes
- **URL Injection Prevention** (Issue #29) - Fixed potential URL injection vulnerability in `ghost-api.js`
  - Added endpoint validation to prevent path traversal and malicious input
  - Validates endpoint format, prevents `..` and `//` sequences
  - Restricts to valid URL path characters only

- **Deprecated Dependencies** (Issue #30) - Made `gscan` optional to eliminate transitive vulnerabilities
  - Moved `gscan` from dependencies to optionalDependencies
  - Core Ghost API functionality now has zero vulnerabilities
  - Theme validation feature still available by installing: `cd scripts && npm install gscan`
  - All 19 npm audit vulnerabilities were from gscan's deprecated dependencies (glob, request, uuid, etc.)

### 📝 Documentation
- Updated SKILL.md to note gscan is optional
- Added installation instructions for theme validation feature

## [0.1.4] - 2026-02-11

### 🔧 Fixes
- **ClawdHub Display Name** - Corrected display name to "Ghost CMS" (was "Ghost Cms Skill")
  - No functional changes

## [0.1.3] - 2026-02-11

### 🔧 Fixes
- **ClawdHub Slug Correction** - Republished to correct slug `ghost-cms-skill`
  - Removed duplicate `ghost-cms` entry (old/incorrect slug)
  - Ensures consistent slug matches directory name
  - No functional changes

## [0.1.2] - 2026-02-11

### 🔧 Fixes
- **ClawdHub Registry Metadata** - Fixed inconsistent metadata extraction (Issue #28)
  - Registry now properly reflects `disable-model-invocation: true` from SKILL.md
  - Registry now properly reflects npm install spec with dependencies
  - Clears "Suspicious" rating caused by metadata mismatch
  - No functional changes to skill behavior

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
