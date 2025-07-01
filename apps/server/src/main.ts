/**
 * My English Dictionary API Server
 * Express.js backend for dictionary features
 */

import express from 'express';
import cors from 'cors';
import * as path from 'path';
import { ExtractionResult } from '@my-english/types';

console.log('Starting My English Dictionary API...');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// API Routes
app.get('/api', (req, res) => {
  res.send({
    message: 'Welcome to My English Dictionary API!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      extract: '/api/extract',
      words: '/api/words',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Dictionary extraction endpoint
app.post('/api/extract', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // TODO: Implement actual URL extraction logic
  const mockResult: ExtractionResult = {
    success: true,
    content: {
      word: 'example',
      partOfSpeech: 'noun' as any,
      definition: 'a thing characteristic of its kind or illustrating a general rule',
      phoneticTranscription: '/ɪɡˈzɑːmpəl/',
    },
    sourceUrl: url,
    sourceType: 'dictionary',
  };

  res.json(mockResult);
});

// Words management endpoint
app.get('/api/words', (req, res) => {
  // TODO: Implement words retrieval from database
  res.json({
    words: [],
    total: 0,
  });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`🚀 My English Dictionary API listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
