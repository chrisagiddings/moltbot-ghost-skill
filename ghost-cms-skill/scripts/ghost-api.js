#!/usr/bin/env node

import jwt from 'jsonwebtoken';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
          resolve(JSON.parse(body));
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

// CLI usage
const endpoint = process.argv[2] || '/site/';

ghostApi(endpoint)
  .then(result => console.log(JSON.stringify(result, null, 2)))
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
