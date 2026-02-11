# Security Policy

## Reporting Security Vulnerabilities

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please email security concerns to the repository owner.

We will acknowledge your email within 48 hours and provide a detailed response indicating the next steps.

---

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

---

## Security Features

### Credential Management

**This skill NEVER:**
- ❌ Stores credentials in code
- ❌ Logs API keys or secrets
- ❌ Transmits credentials to third parties
- ❌ Includes credentials in error messages

**This skill supports:**
- ✅ Environment variables (process-local, not filesystem)
- ✅ Secure config files (`~/.config/ghost/` with chmod 600)
- ✅ 1Password CLI integration (encrypted at rest)

### Data Privacy

**This skill does NOT:**
- ❌ Collect telemetry or analytics
- ❌ Phone home to external services
- ❌ Log user content to external systems
- ❌ Share data with third parties

**This skill stores locally:**
- User-extracted snippets (`snippets/library/`) - your content only
- Temporary Lexical JSON (`extracted-cards/`) - test data only
- NO credentials (user responsibility to secure)

**This skill transmits:**
- ✅ API requests to YOUR Ghost site only (via HTTPS)
- ✅ No third-party API calls

### API Security

**Ghost Admin API Keys:**
- Provide **FULL ACCESS** to your Ghost site
- Cannot be scoped (all-or-nothing permissions)
- Should be rotated every 90 days
- Should be stored securely (1Password, env vars, secure files)

**This skill:**
- ✅ Generates JWT tokens on-demand (not stored)
- ✅ Uses 5-minute token expiration
- ✅ HTTPS-only communication
- ✅ Proper HMAC-SHA256 signing

### Input Validation

**Snippet Extractor:**
- ✅ Sanitizes filenames (prevents path traversal)
- ✅ Validates file sizes (1MB limit per snippet)
- ✅ Limits card count (warns at 100+ cards)
- ✅ Removes dangerous characters from names

### Operation Classification

All operations are classified for safety:

- **Safe (Read-Only):** GET requests, analytics, listing content
- **Destructive:** POST/PUT operations, content creation/modification
- **Permanent:** DELETE operations (cannot be undone)
- **Public Risk:** Publishing content (immediately visible to internet)

---

## Security Best Practices

### For Users

1. **Protect Your API Keys**
   - Never commit to version control
   - Use environment variables or 1Password CLI
   - Rotate keys every 90 days
   - Use separate keys for development/production

2. **Test on Staging First**
   - Create a test Ghost site
   - Practice operations safely
   - Verify behavior before production use

3. **Review Before Publishing**
   - Always check content before `status: published`
   - Use draft status by default
   - Schedule posts for manual review

4. **Monitor Your Site**
   - Regularly check Ghost Admin dashboard
   - Review recent posts and members
   - Watch for unexpected changes

5. **Keep Snippets Private**
   - User snippets (library/) are in .gitignore
   - Do not commit personal content to git
   - Examples (examples/) are safe to share

### For Developers

1. **Never Commit Credentials**
   - API keys, URLs, tokens
   - `.gitignore` is configured for common patterns
   - Review commits before pushing

2. **Validate All Inputs**
   - Sanitize filenames and paths
   - Limit file sizes
   - Check for path traversal attempts

3. **Handle Errors Safely**
   - Never expose credentials in error messages
   - Log safely (no sensitive data)
   - Fail securely (deny by default)

4. **Follow Principle of Least Privilege**
   - Request minimal permissions needed
   - Document what each operation does
   - Classify operations accurately

---

## Incident Response

**If you suspect your API key has been compromised:**

1. **Immediately revoke the key:**
   - Ghost Admin → Settings → Integrations
   - Delete the compromised integration

2. **Create a new integration:**
   - Generate new Admin API key
   - Update your credentials securely

3. **Review your site:**
   - Check for unauthorized posts/members
   - Review recent changes in Ghost Admin
   - Verify subscription settings

4. **Report the incident:**
   - Email the security team
   - Provide details (when, how discovered)
   - Do not share the compromised key

---

## Security Checklist

**Before first use:**
- [ ] API keys stored securely (NOT in code)
- [ ] Config files have secure permissions (chmod 600)
- [ ] Test on staging site, not production
- [ ] Understand operation classifications

**Regular maintenance:**
- [ ] Rotate API keys every 90 days
- [ ] Review .gitignore before commits
- [ ] Keep user snippets out of version control
- [ ] Monitor Ghost site for unexpected changes

**Before publishing:**
- [ ] Review content carefully
- [ ] Verify post status (draft vs. published)
- [ ] Check member visibility settings
- [ ] Test on staging first

---

## Known Limitations

1. **No API Key Scoping**
   - Ghost Admin API keys have full site access
   - Cannot create read-only keys
   - Cannot limit permissions to specific resources

2. **No Undo for Some Operations**
   - Deleted posts cannot be recovered via API
   - Published content is immediately public
   - Some settings changes are permanent

3. **Rate Limiting**
   - Ghost enforces 200 requests/minute
   - No built-in rate limiting in this skill
   - Users must manage bulk operations carefully

---

## Security Audit Log

| Date | Version | Auditor | Findings | Status |
|------|---------|---------|----------|--------|
| 2026-02-10 | 0.1.0 | Navi (AI) | See audit report | ✅ Addressed |

---

## Contact

For security concerns, please contact the repository owner.

**Do not report security issues via public GitHub issues.**

---

## Acknowledgments

Security best practices informed by:
- Ghost Admin API documentation
- OWASP Secure Coding Practices
- Node.js Security Working Group guidelines
