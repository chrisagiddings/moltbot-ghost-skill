#!/usr/bin/env node

/**
 * Ghost CMS CRUD Operations
 * All operations use Lexical format for content
 */

import jwt from 'jsonwebtoken';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { textToLexical, structuredToLexical, stringifyLexical } from './lexical-builder.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read credentials
const configDir = path.join(process.env.HOME, '.config', 'ghost');
const apiKey = fs.readFileSync(path.join(configDir, 'api_key'), 'utf8').trim();
const apiUrl = fs.readFileSync(path.join(configDir, 'api_url'), 'utf8').trim();

// Split key into id and secret
const [keyId, keySecret] = apiKey.split(':');

// Generate JWT token
function generateToken() {
  const payload = {
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 300, // 5 minutes
    aud: '/admin/'
  };
  
  return jwt.sign(payload, Buffer.from(keySecret, 'hex'), {
    algorithm: 'HS256',
    keyid: keyId,
    header: {
      kid: keyId
    }
  });
}

// Make API request
function ghostApi(endpoint, method = 'GET', data = null) {
  const token = generateToken();
  const url = new URL(`${apiUrl}/ghost/api/admin${endpoint}`);
  
  const options = {
    method,
    headers: {
      'Authorization': `Ghost ${token}`,
      'Content-Type': 'application/json',
      'Accept-Version': 'v5.0'
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          reject(new Error(`Invalid JSON: ${body}`));
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// CREATE - Create a new post with Lexical content
async function createPost(title, content, options = {}) {
  const {
    status = 'draft',
    tags = [],
    featured = false,
    visibility = 'public'
  } = options;

  // Convert text to Lexical if it's a string
  let lexicalContent;
  if (typeof content === 'string') {
    lexicalContent = textToLexical(content);
  } else if (Array.isArray(content)) {
    lexicalContent = structuredToLexical(content);
  } else {
    lexicalContent = content; // Already Lexical format
  }

  const postData = {
    posts: [{
      title,
      lexical: stringifyLexical(lexicalContent),
      status,
      tags: tags.map(tag => ({ name: tag })),
      featured,
      visibility
    }]
  };

  const result = await ghostApi('/posts/', 'POST', postData);
  return result.data.posts[0];
}

// READ - Get post(s)
async function readPost(slugOrId, asHtml = true) {
  const formats = asHtml ? '?formats=html' : '';
  const result = await ghostApi(`/posts/${slugOrId}/${formats}`);
  return result.data.posts[0];
}

async function listPosts(filter = '', limit = 15) {
  const params = new URLSearchParams({ limit });
  if (filter) params.append('filter', filter);
  
  const result = await ghostApi(`/posts/?${params}`);
  return result.data.posts;
}

// UPDATE - Update post with Lexical content
async function updatePost(postId, updates) {
  // If content is provided, convert to Lexical
  if (updates.content) {
    let lexicalContent;
    if (typeof updates.content === 'string') {
      lexicalContent = textToLexical(updates.content);
    } else if (Array.isArray(updates.content)) {
      lexicalContent = structuredToLexical(updates.content);
    } else {
      lexicalContent = updates.content; // Already Lexical
    }
    updates.lexical = stringifyLexical(lexicalContent);
    delete updates.content;
  }

  const postData = {
    posts: [updates]
  };

  const result = await ghostApi(`/posts/${postId}/`, 'PUT', postData);
  return result.data.posts[0];
}

// DELETE - Delete a post
async function deletePost(postId) {
  const result = await ghostApi(`/posts/${postId}/`, 'DELETE');
  return result;
}

// PUBLISH - Publish a draft
async function publishPost(postId) {
  return updatePost(postId, {
    status: 'published',
    published_at: null
  });
}

// SCHEDULE - Schedule a post
async function schedulePost(postId, publishDate) {
  return updatePost(postId, {
    status: 'scheduled',
    published_at: publishDate.toISOString()
  });
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  (async () => {
    try {
      switch (command) {
        case 'create': {
          const title = process.argv[3];
          const content = process.argv[4];
          if (!title || !content) {
            console.error('Usage: ghost-crud.js create "Title" "Content"');
            process.exit(1);
          }
          const post = await createPost(title, content);
          console.log('Created post:');
          console.log(JSON.stringify(post, null, 2));
          break;
        }
        
        case 'read': {
          const slugOrId = process.argv[3];
          if (!slugOrId) {
            console.error('Usage: ghost-crud.js read <slug-or-id>');
            process.exit(1);
          }
          const post = await readPost(slugOrId);
          console.log(JSON.stringify(post, null, 2));
          break;
        }
        
        case 'list': {
          const filter = process.argv[3] || '';
          const posts = await listPosts(filter);
          console.log(`Found ${posts.length} posts:`);
          posts.forEach(post => {
            console.log(`- [${post.status}] ${post.title} (${post.id})`);
          });
          break;
        }
        
        case 'update': {
          const postId = process.argv[3];
          const content = process.argv[4];
          if (!postId || !content) {
            console.error('Usage: ghost-crud.js update <post-id> "New content"');
            process.exit(1);
          }
          const post = await updatePost(postId, { content });
          console.log('Updated post:');
          console.log(JSON.stringify(post, null, 2));
          break;
        }
        
        case 'delete': {
          const postId = process.argv[3];
          if (!postId) {
            console.error('Usage: ghost-crud.js delete <post-id>');
            process.exit(1);
          }
          await deletePost(postId);
          console.log(`Deleted post ${postId}`);
          break;
        }
        
        case 'publish': {
          const postId = process.argv[3];
          if (!postId) {
            console.error('Usage: ghost-crud.js publish <post-id>');
            process.exit(1);
          }
          const post = await publishPost(postId);
          console.log('Published post:');
          console.log(JSON.stringify(post, null, 2));
          break;
        }
        
        case 'schedule': {
          const postId = process.argv[3];
          const dateStr = process.argv[4];
          if (!postId || !dateStr) {
            console.error('Usage: ghost-crud.js schedule <post-id> "2026-02-10T09:00:00Z"');
            process.exit(1);
          }
          const publishDate = new Date(dateStr);
          const post = await schedulePost(postId, publishDate);
          console.log('Scheduled post:');
          console.log(JSON.stringify(post, null, 2));
          break;
        }
        
        default:
          console.error('Unknown command. Available: create, read, list, update, delete, publish, schedule');
          process.exit(1);
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}

// Export for use as module
export {
  createPost,
  readPost,
  listPosts,
  updatePost,
  deletePost,
  publishPost,
  schedulePost
};
