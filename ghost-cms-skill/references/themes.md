# Ghost Theme Management

Manage Ghost themes via Admin API - upload, activate, list, and delete custom themes.

## Overview

Ghost themes control your site's appearance and functionality. The Admin API allows programmatic theme management, useful for:
- Deploying custom themes
- Switching between themes
- Managing theme versions
- Automating theme updates

## Theme Structure

Ghost themes must be ZIP files containing:
```
theme-name.zip
├── package.json          # Required: theme metadata
├── index.hbs            # Required: main template
├── post.hbs             # Required: post template
├── default.hbs          # Optional: default layout
├── partials/            # Optional: reusable components
├── assets/              # Optional: CSS, JS, images
└── locales/             # Optional: translations
```

**Required package.json fields:**
```json
{
  "name": "theme-name",
  "version": "1.0.0",
  "engines": {
    "ghost": ">=5.0.0"
  }
}
```

## API Operations

### List Installed Themes

**Get all themes (including active theme):**
```bash
curl "${GHOST_API_URL}/ghost/api/admin/themes/" \
  -H "Authorization: Ghost ${TOKEN}"
```

**Response:**
```json
{
  "themes": [
    {
      "name": "casper",
      "package": {
        "name": "casper",
        "version": "5.0.0"
      },
      "active": true
    },
    {
      "name": "custom-theme",
      "package": {
        "name": "custom-theme",
        "version": "1.2.0"
      },
      "active": false
    }
  ]
}
```

### Upload Theme

**Upload a theme ZIP file:**
```bash
curl "${GHOST_API_URL}/ghost/api/admin/themes/upload/" \
  -H "Authorization: Ghost ${TOKEN}" \
  -F "file=@/path/to/theme.zip"
```

**Response:**
```json
{
  "themes": [
    {
      "name": "new-theme",
      "package": {
        "name": "new-theme",
        "version": "1.0.0"
      },
      "active": false,
      "warnings": []
    }
  ]
}
```

**Upload with activation:**
```bash
curl "${GHOST_API_URL}/ghost/api/admin/themes/upload/" \
  -H "Authorization: Ghost ${TOKEN}" \
  -F "file=@/path/to/theme.zip" \
  -F "activate=true"
```

**Validation:**
- ZIP must contain valid Ghost theme
- `package.json` required with name and version
- Ghost version compatibility checked
- Handlebars templates validated

### Activate Theme

**Switch to a different theme:**
```bash
curl -X PUT \
  "${GHOST_API_URL}/ghost/api/admin/themes/${THEME_NAME}/activate/" \
  -H "Authorization: Ghost ${TOKEN}"
```

**Response:**
```json
{
  "themes": [
    {
      "name": "custom-theme",
      "package": {
        "name": "custom-theme",
        "version": "1.2.0"
      },
      "active": true
    }
  ]
}
```

**Important:**
- Theme must already be installed
- Only one theme can be active at a time
- **Change is immediate** - site appearance updates instantly
- Previous theme is deactivated automatically

### Delete Theme

**Remove an installed theme:**
```bash
curl -X DELETE \
  "${GHOST_API_URL}/ghost/api/admin/themes/${THEME_NAME}/" \
  -H "Authorization: Ghost ${TOKEN}"
```

**Response:** `204 No Content`

**Restrictions:**
- Cannot delete the currently active theme
- Must switch to different theme first
- Deletion is permanent (no undo)

### Download Theme

**Export installed theme as ZIP:**
```bash
curl "${GHOST_API_URL}/ghost/api/admin/themes/${THEME_NAME}/download/" \
  -H "Authorization: Ghost ${TOKEN}" \
  -o theme-backup.zip
```

**Use cases:**
- Backup before updates
- Clone theme for customization
- Transfer theme between sites

## Workflows

### Deploy Custom Theme

**1. Prepare theme ZIP file**
```bash
cd my-custom-theme/
zip -r theme.zip . -x "*.git*" -x "node_modules/*"
```

**2. Upload and activate**
```bash
# Upload
curl -F "file=@theme.zip" -F "activate=true" \
  "${GHOST_API_URL}/ghost/api/admin/themes/upload/" \
  -H "Authorization: Ghost ${TOKEN}"
```

**3. Verify activation**
```bash
# Check active theme
curl "${GHOST_API_URL}/ghost/api/admin/themes/" \
  -H "Authorization: Ghost ${TOKEN}" \
  | jq '.themes[] | select(.active==true)'
```

### Switch Between Themes

**Safe theme switching with rollback capability:**

**1. List available themes**
```bash
curl "${GHOST_API_URL}/ghost/api/admin/themes/" \
  -H "Authorization: Ghost ${TOKEN}" \
  | jq '.themes[] | {name, active}'
```

**2. Note current active theme** (for rollback)
```bash
CURRENT_THEME=$(curl "${GHOST_API_URL}/ghost/api/admin/themes/" \
  -H "Authorization: Ghost ${TOKEN}" \
  | jq -r '.themes[] | select(.active==true) | .name')
echo "Current theme: $CURRENT_THEME"
```

**3. Activate new theme**
```bash
curl -X PUT \
  "${GHOST_API_URL}/ghost/api/admin/themes/new-theme/activate/" \
  -H "Authorization: Ghost ${TOKEN}"
```

**4. Test site** - Check frontend in browser

**5. Rollback if needed**
```bash
# If issues, switch back
curl -X PUT \
  "${GHOST_API_URL}/ghost/api/admin/themes/${CURRENT_THEME}/activate/" \
  -H "Authorization: Ghost ${TOKEN}"
```

### Update Existing Theme

**1. Backup current version**
```bash
curl "${GHOST_API_URL}/ghost/api/admin/themes/my-theme/download/" \
  -H "Authorization: Ghost ${TOKEN}" \
  -o my-theme-backup.zip
```

**2. Upload new version**
```bash
# Ghost will overwrite if same name
curl -F "file=@my-theme-v2.zip" \
  "${GHOST_API_URL}/ghost/api/admin/themes/upload/" \
  -H "Authorization: Ghost ${TOKEN}"
```

**3. Activate updated theme**
```bash
curl -X PUT \
  "${GHOST_API_URL}/ghost/api/admin/themes/my-theme/activate/" \
  -H "Authorization: Ghost ${TOKEN}"
```

## Error Handling

### Theme Validation Errors

**Invalid theme structure:**
```json
{
  "errors": [
    {
      "message": "Theme is not compatible with this version of Ghost",
      "context": "package.json engines.ghost: >=4.0.0",
      "type": "ValidationError"
    }
  ]
}
```

**Missing required files:**
```json
{
  "errors": [
    {
      "message": "Theme is missing required files",
      "context": "index.hbs is required",
      "type": "ValidationError"
    }
  ]
}
```

**Handlebars syntax errors:**
```json
{
  "errors": [
    {
      "message": "Template compilation failed",
      "context": "index.hbs line 42",
      "type": "ThemeValidationError"
    }
  ]
}
```

### Common Issues

**"Theme not found"**
- Theme name doesn't match installed themes
- Check theme list first
- Theme names are case-sensitive

**"Cannot delete active theme"**
- Switch to different theme first
- Then delete the theme

**"Theme already exists"**
- Upload overwrites existing theme with same name
- Consider versioning in package.json

**"Invalid ZIP file"**
- Ensure ZIP contains theme files at root (not nested in folder)
- Use `zip -r theme.zip .` from theme directory

## Best Practices

### Development Workflow

**1. Local development**
```bash
# Work on theme locally
cd my-theme/
ghost develop  # Test locally
```

**2. Create release**
```bash
# Update version in package.json
npm version patch

# Create production ZIP
zip -r ../my-theme-v1.2.0.zip . \
  -x "*.git*" \
  -x "node_modules/*" \
  -x ".DS_Store"
```

**3. Deploy to staging**
```bash
# Upload to staging Ghost site
GHOST_API_URL="https://staging.example.com" \
curl -F "file=@my-theme-v1.2.0.zip" -F "activate=true" ...
```

**4. Test thoroughly**
- Check all page types (home, post, page, tags, authors)
- Test responsive layouts
- Verify assets load correctly

**5. Deploy to production**
```bash
# Backup current theme first
curl "${GHOST_API_URL}/ghost/api/admin/themes/current-theme/download/" ...

# Upload and activate
GHOST_API_URL="https://example.com" \
curl -F "file=@my-theme-v1.2.0.zip" -F "activate=true" ...
```

### Version Management

**Use semantic versioning in package.json:**
```json
{
  "name": "my-theme",
  "version": "1.2.0"
}
```

**Keep backups:**
- Download theme before updates
- Store versioned ZIPs externally
- Use git for theme source code

**Test before activation:**
- Upload theme first (don't activate)
- Review warnings/errors
- Activate only if valid

### Security

**Theme code can:**
- Execute Handlebars helpers
- Access Ghost data (posts, tags, authors, etc.)
- Include custom CSS/JS
- Modify site appearance

**Cannot:**
- Access Ghost API directly (no API keys in themes)
- Execute server-side code (only Handlebars)
- Modify Ghost core
- Access other themes

**Best practices:**
- Review third-party themes before installation
- Keep themes updated (security patches)
- Remove unused themes
- Use trusted theme sources only

## Script Usage

**Using the theme-manager.js CLI:**

```bash
cd ghost-cms-skill/scripts

# List all themes
node theme-manager.js list

# Upload theme
node theme-manager.js upload /path/to/theme.zip

# Upload and activate
node theme-manager.js upload /path/to/theme.zip --activate

# Activate existing theme
node theme-manager.js activate theme-name

# Download theme backup
node theme-manager.js download theme-name theme-backup.zip

# Delete theme
node theme-manager.js delete theme-name

# Get current active theme
node theme-manager.js active
```

## Ghost(Pro) vs Self-Hosted

**Ghost(Pro):**
- Theme uploads enabled by default
- Storage managed by Ghost
- Automatic backups

**Self-hosted:**
- Ensure sufficient disk space
- Configure file upload limits in Nginx/Apache
- Manual backups recommended

## Limitations

**File size:**
- Default max: 10MB per theme ZIP
- Configure via Ghost config.json if needed

**Number of themes:**
- No hard limit
- Keep only needed themes (disk space)

**Theme compatibility:**
- Check `engines.ghost` in package.json
- Themes may break with major Ghost updates
- Test themes after Ghost upgrades

## Resources

**Official Ghost theme docs:**
- https://ghost.org/docs/themes/
- https://ghost.org/docs/themes/structure/
- https://ghost.org/docs/themes/helpers/

**Theme development:**
- https://ghost.org/docs/themes/helpers/
- https://ghost.org/docs/themes/handlebars/

**Free Ghost themes:**
- https://ghost.org/marketplace/
- https://github.com/topics/ghost-theme
