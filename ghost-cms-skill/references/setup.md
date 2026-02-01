# Ghost CMS Setup & Authentication

## Getting Your API Credentials

### Step 1: Create Custom Integration

1. Log into your Ghost admin dashboard
2. Navigate to **Settings → Integrations**
3. Scroll to "Custom Integrations"
4. Click **+ Add custom integration**
5. Name it (e.g., "Moltbot" or "Navi")

### Step 2: Copy Credentials

After creating the integration, you'll see:
- **Admin API Key** - Long string starting with hexadecimal characters + a colon + more hex
- **API URL** - Your blog's API endpoint (e.g., `https://yourblog.ghost.io`)

**Important:** The Admin API Key has two parts separated by a colon:
- `{key_id}:{key_secret}`
- You need the entire string

### Step 3: Store Credentials Securely

**Option A: Configuration files** (recommended)

```bash
mkdir -p ~/.config/ghost
echo "YOUR_ADMIN_API_KEY" > ~/.config/ghost/api_key
echo "https://yourblog.ghost.io" > ~/.config/ghost/api_url
chmod 600 ~/.config/ghost/api_key ~/.config/ghost/api_url
```

**Option B: Environment variables**

```bash
export GHOST_ADMIN_KEY="YOUR_ADMIN_API_KEY"
export GHOST_API_URL="https://yourblog.ghost.io"
```

Add these to your `~/.zshrc` or `~/.bashrc` for persistence.

## Finding Your Blog URL

Your Ghost API URL depends on your hosting:

**Ghost(Pro) hosted:**
- Format: `https://yourblog.ghost.io`
- Find it in Settings → General → Publication info

**Self-hosted:**
- Format: `https://yourdomain.com`
- Use your actual domain

**Custom domain on Ghost(Pro):**
- Use your custom domain: `https://blog.yourdomain.com`

## Testing Authentication

Test your credentials with a simple API call:

```bash
GHOST_KEY=$(cat ~/.config/ghost/api_key)
GHOST_URL=$(cat ~/.config/ghost/api_url)

# Split the key into id and secret
KEY_ID=$(echo $GHOST_KEY | cut -d: -f1)
KEY_SECRET=$(echo $GHOST_KEY | cut -d: -f2)

# Create JWT token (requires jwt-cli or python)
# Simple test: just try to fetch site info
curl "${GHOST_URL}/ghost/api/admin/site/" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

If successful, you'll get JSON with your site information.

## Troubleshooting

### "401 Unauthorized"
- Check that you copied the entire Admin API Key (both parts)
- Verify the key hasn't been revoked in Ghost admin
- Ensure you're using the Admin API key, not Content API key

### "404 Not Found"
- Verify your API URL is correct (check for trailing slashes)
- Confirm you're using `/ghost/api/admin/` in the path
- Check if your Ghost version supports Admin API (v2.0+)

### "Invalid token"
- The Admin API Key must be split into ID and Secret
- JWT token generation requires proper encoding
- Check system time is accurate (JWT expiration)

## API Versions

Ghost uses versioned APIs. This skill targets:
- **Admin API v5.0** (current stable)
- Minimum Ghost version: **5.0+**

Check your Ghost version in Settings → About.

## Rate Limits

Ghost Admin API rate limits:
- **500 requests per hour** per integration
- Resets hourly
- Exceeding limit returns 429 status

Best practices:
- Cache frequently-accessed data
- Batch operations when possible
- Use webhooks for real-time updates instead of polling
