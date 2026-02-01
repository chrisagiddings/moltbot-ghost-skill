# Ghost CMS Skill for Moltbot

Comprehensive Ghost CMS integration skill for [Moltbot](https://github.com/openclaw/openclaw) (formerly Clawdbot).

## Features

- ✍️ **Content Management** - Create drafts, publish, schedule posts
- 📊 **Analytics** - Track subscribers, popular posts, tag performance
- 💬 **Comments** - Read and respond to comments
- 👥 **Members** - Manage subscriber tiers and access
- 📧 **Newsletters** - Configure and send email campaigns
- 🔗 **Full API Coverage** - Complete Ghost Admin API v5.0 support

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

See [setup.md](ghost-cms-skill/references/setup.md) for detailed instructions.

## Usage Examples

**Create a draft:**
> "Draft a blog post about [topic] and save it to Ghost"

**Publish content:**
> "Publish my latest draft post"

**Check comments:**
> "Are there any comments I need to respond to?"

**Analytics:**
> "What tags have been most popular in the past 6 months?"

**Scheduled content:**
> "Schedule a post for next Monday at 9am"

**Newsletter:**
> "Navi, write and publish a unique weekly post about [topic]"

## Documentation

- **[SKILL.md](ghost-cms-skill/SKILL.md)** - Main skill file with overview and navigation
- **[references/](ghost-cms-skill/references/)** - Domain-specific guides:
  - [setup.md](ghost-cms-skill/references/setup.md) - Authentication and configuration
  - [content.md](ghost-cms-skill/references/content.md) - Creating and managing posts
  - [analytics.md](ghost-cms-skill/references/analytics.md) - Subscriber and performance metrics
  - [comments.md](ghost-cms-skill/references/comments.md) - Comment management and responses
  - [members.md](ghost-cms-skill/references/members.md) - Subscriber tier management
  - [newsletters.md](ghost-cms-skill/references/newsletters.md) - Newsletter configuration
  - [api-reference.md](ghost-cms-skill/references/api-reference.md) - Quick API endpoint lookup

## Contributing

This skill follows [Moltbot skill standards](https://github.com/openclaw/openclaw/blob/main/skills/skill-creator/SKILL.md).

**To contribute:**
1. Fork this repo
2. Create a feature branch
3. Make your changes (follow the structure and style)
4. Test with real Ghost instances
5. Submit a pull request

**Areas for contribution:**
- Additional use cases and examples
- Ghost Analytics Pro integration
- Webhook automation workflows
- Error handling improvements
- Multi-blog support

## Requirements

- **Moltbot** v2026.1+
- **Ghost** v5.0+ (Admin API v5.0)
- Valid Ghost Admin API credentials

## License

MIT License - See [LICENSE](LICENSE) for details

## Acknowledgments

Created for the Moltbot community by Chris Giddings with Navi.

Special thanks to the Ghost and Moltbot teams for building incredible platforms.

## Links

- **Ghost CMS:** https://ghost.org
- **Moltbot:** https://github.com/openclaw/openclaw
- **Ghost Admin API Docs:** https://ghost.org/docs/admin-api/
- **Report Issues:** https://github.com/chrisagiddings/moltbot-ghost-skill/issues

---

**Note:** This skill is community-created and not officially maintained by Ghost or Moltbot. Use at your own discretion.

## Technical Details

### JWT Authentication

Ghost Admin API requires JWT token generation (see [#1](https://github.com/chrisagiddings/moltbot-ghost-skill/issues/1)).

The skill includes `scripts/ghost-api.js` helper for authenticated API calls:

```bash
# Example: Get site info
node scripts/ghost-api.js /site/

# Example: List posts
node scripts/ghost-api.js '/posts/?limit=5'
```

The helper automatically:
- Reads credentials from `~/.config/ghost/`
- Generates JWT tokens (5min expiry)
- Handles API requests with proper authentication

For direct curl usage, see the reference files for JWT generation patterns.
