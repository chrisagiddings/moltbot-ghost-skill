# Analytics & Insights

Subscriber counts, popular content, and performance metrics.

## Subscriber Metrics

### Total Subscriber Count

```bash
curl "${GHOST_URL}/ghost/api/admin/members/stats/count/" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

Returns:
```json
{
  "data": {
    "total": 1234,
    "paid": 56,
    "free": 1178,
    "comped": 0
  }
}
```

### New Subscribers (Time Period)

```bash
# Subscribers added in last 30 days
THIRTY_DAYS_AGO=$(date -u -v-30d '+%Y-%m-%dT%H:%M:%S.000Z')

curl "${GHOST_URL}/ghost/api/admin/members/?filter=created_at:>'${THIRTY_DAYS_AGO}'&limit=all" \
  -H "Authorization: Ghost ${GHOST_KEY}" | \
  jq '.members | length'
```

### Subscriber Growth Trend

```bash
# Get member stats over time
curl "${GHOST_URL}/ghost/api/admin/members/stats/mrr/" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

Returns monthly recurring revenue (MRR) and subscriber trends.

### Recent Subscribers

```bash
curl "${GHOST_URL}/ghost/api/admin/members/?order=created_at%20desc&limit=10" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

## Content Performance

### Most Viewed Posts

Ghost doesn't track views natively in API. For view counts, you need:
- Google Analytics integration
- Ghost Analytics (Pro feature)
- Custom tracking solution

**With Ghost Analytics (Pro):**
```bash
curl "${GHOST_URL}/ghost/api/admin/stats/post/${POST_ID}/" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

**Alternative approach:** Use engagement proxies:
- Member count per post
- Comment count per post
- Newsletter open rates

### Posts by Comment Count

```bash
# Get all posts with comment counts
curl "${GHOST_URL}/ghost/api/admin/posts/?limit=all&include=count.comments" \
  -H "Authorization: Ghost ${GHOST_KEY}" | \
  jq '.posts | sort_by(.count.comments) | reverse | .[0:10]'
```

Returns top 10 posts by comment count.

### Tag/Topic Performance

```bash
# Get tag usage counts
curl "${GHOST_URL}/ghost/api/admin/tags/?limit=all&include=count.posts" \
  -H "Authorization: Ghost ${GHOST_KEY}" | \
  jq '.tags | sort_by(.count.posts) | reverse'
```

Returns tags sorted by number of posts.

### Popular Tags (Last 6 Months)

```bash
# Get posts from last 6 months
SIX_MONTHS_AGO=$(date -u -v-6m '+%Y-%m-%dT%H:%M:%S.000Z')

curl "${GHOST_URL}/ghost/api/admin/posts/?filter=published_at:>'${SIX_MONTHS_AGO}'&include=tags&limit=all" \
  -H "Authorization: Ghost ${GHOST_KEY}" | \
  jq '[.posts[].tags[].name] | group_by(.) | map({tag: .[0], count: length}) | sort_by(.count) | reverse'
```

Returns tag frequency in recent posts.

## Member Activity

### Active Members (Recent Logins)

```bash
# Members who logged in recently
LAST_WEEK=$(date -u -v-7d '+%Y-%m-%dT%H:%M:%S.000Z')

curl "${GHOST_URL}/ghost/api/admin/members/?filter=last_seen_at:>'${LAST_WEEK}'&limit=all" \
  -H "Authorization: Ghost ${GHOST_KEY}" | \
  jq '.members | length'
```

### Paid vs Free Distribution

```bash
curl "${GHOST_URL}/ghost/api/admin/members/stats/count/" \
  -H "Authorization: Ghost ${GHOST_KEY}" | \
  jq '.data | {
    total: .total,
    paid_percent: ((.paid / .total) * 100 | round),
    free_percent: ((.free / .total) * 100 | round)
  }'
```

## Newsletter Performance

### Newsletter Stats

```bash
# Get newsletter info including subscriber counts
curl "${GHOST_URL}/ghost/api/admin/newsletters/" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

Returns:
```json
{
  "newsletters": [{
    "name": "Newsletter Name",
    "slug": "newsletter-slug",
    "sender_email": "sender@example.com",
    "status": "active",
    "subscribe_on_signup": true,
    "count": {
      "members": 1234,
      "posts": 56
    }
  }]
}
```

### Email Open Rates (Pro)

If using Ghost Analytics Pro:

```bash
curl "${GHOST_URL}/ghost/api/admin/stats/newsletter/${POST_ID}/" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

## Content Insights

### Publishing Frequency

```bash
# Posts per month (last 6 months)
for i in {0..5}; do
  START=$(date -u -v-${i}m -v1d '+%Y-%m-01T00:00:00.000Z')
  END=$(date -u -v-${i}m -v+1m -v1d '+%Y-%m-01T00:00:00.000Z')
  
  COUNT=$(curl -s "${GHOST_URL}/ghost/api/admin/posts/?filter=published_at:>'${START}'+published_at:<'${END}'" \
    -H "Authorization: Ghost ${GHOST_KEY}" | \
    jq '.posts | length')
  
  MONTH=$(date -v-${i}m '+%B %Y')
  echo "${MONTH}: ${COUNT} posts"
done
```

### Member-Only Content Check

```bash
# Last subscriber-exclusive post
curl "${GHOST_URL}/ghost/api/admin/posts/?filter=visibility:paid&order=published_at%20desc&limit=1" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

Returns most recent paid-members-only post.

### Content by Author

```bash
# Posts by author in last month
LAST_MONTH=$(date -u -v-30d '+%Y-%m-%dT%H:%M:%S.000Z')

curl "${GHOST_URL}/ghost/api/admin/posts/?filter=published_at:>'${LAST_MONTH}'&include=authors&limit=all" \
  -H "Authorization: Ghost ${GHOST_KEY}" | \
  jq '[.posts[].authors[0].name] | group_by(.) | map({author: .[0], posts: length}) | sort_by(.posts) | reverse'
```

## Time-Based Queries

### Posts This Week

```bash
WEEK_START=$(date -u -v-mon '+%Y-%m-%dT00:00:00.000Z')

curl "${GHOST_URL}/ghost/api/admin/posts/?filter=published_at:>'${WEEK_START}'&limit=all" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

### Posts Today

```bash
TODAY=$(date -u '+%Y-%m-%dT00:00:00.000Z')

curl "${GHOST_URL}/ghost/api/admin/posts/?filter=published_at:>'${TODAY}'&limit=all" \
  -H "Authorization: Ghost ${GHOST_KEY}"
```

## Common Analytics Queries

### "How many new subscribers this month?"

```bash
MONTH_START=$(date -u -v1d '+%Y-%m-01T00:00:00.000Z')

curl "${GHOST_URL}/ghost/api/admin/members/?filter=created_at:>'${MONTH_START}'&limit=all" \
  -H "Authorization: Ghost ${GHOST_KEY}" | \
  jq '.members | length'
```

### "What tags have been most popular in the past 6 months?"

See "Popular Tags (Last 6 Months)" above.

### "When was my last subscriber-exclusive post?"

```bash
curl "${GHOST_URL}/ghost/api/admin/posts/?filter=visibility:paid&order=published_at%20desc&limit=1" \
  -H "Authorization: Ghost ${GHOST_KEY}" | \
  jq '.posts[0] | {
    title: .title,
    published_at: .published_at,
    days_ago: ((now - (.published_at | fromdateiso8601)) / 86400 | floor)
  }'
```

### "Which posts got the most comments?"

```bash
curl "${GHOST_URL}/ghost/api/admin/posts/?limit=all&include=count.comments" \
  -H "Authorization: Ghost ${GHOST_KEY}" | \
  jq '.posts | sort_by(.count.comments) | reverse | .[0:10] | .[] | {
    title: .title,
    comments: .count.comments,
    published_at: .published_at
  }'
```

## Data Export

### Export All Subscribers

```bash
curl "${GHOST_URL}/ghost/api/admin/members/?limit=all" \
  -H "Authorization: Ghost ${GHOST_KEY}" | \
  jq -r '.members[] | [.email, .name, .created_at, .status] | @csv' > members.csv
```

### Export Post Metrics

```bash
curl "${GHOST_URL}/ghost/api/admin/posts/?limit=all&include=tags,authors,count.comments" \
  -H "Authorization: Ghost ${GHOST_KEY}" | \
  jq -r '.posts[] | [.title, .published_at, (.tags | map(.name) | join(";")), .count.comments] | @csv' > posts.csv
```

## Limitations

**View/traffic data:** Not available in Admin API unless using Ghost Analytics Pro

**Alternatives for view tracking:**
- Google Analytics integration
- Custom analytics with Ghost webhooks
- Third-party tools (Plausible, Fathom, etc.)

**Engagement proxies:**
- Comment counts (good indicator of engagement)
- Newsletter subscriber counts
- Member growth rates
- Social shares (if tracked externally)

## Best Practices

- **Cache results** - Analytics queries can be resource-intensive
- **Batch requests** - Get all data in one call when possible
- **Use time filters** - Narrow queries to relevant time periods
- **Export periodically** - Keep historical data for trend analysis
- **Combine metrics** - Look at multiple signals for full picture
