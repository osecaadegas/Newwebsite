const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Environment variables
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const PORT = process.env.PORT || 3001;

// Validate required environment variables
if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  console.error('Missing required environment variables');
  console.error('Please check your .env file contains:');
  console.error('- SPOTIFY_CLIENT_ID');
  console.error('- SPOTIFY_CLIENT_SECRET');
  console.error('- REDIRECT_URI');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://osecaadegas.github.io'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Spotify Auth Server'
  });
});

// Exchange authorization code for access token
app.post('/spotify/token', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        error: 'Missing authorization code',
        message: 'Authorization code is required'
      });
    }

    console.log('Exchanging authorization code for tokens...');

    // Prepare form data for Spotify API
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);

    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('Successfully obtained tokens');
    res.json(response.data);
    
  } catch (error) {
    console.error('Token exchange error:', error.response?.data || error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: 'Spotify API Error',
        message: error.response.data?.error_description || error.response.data?.error || 'Unknown error',
        details: error.response.data
      });
    } else {
      res.status(500).json({ 
        error: 'Server Error',
        message: error.message 
      });
    }
  }
});

// Refresh access token
app.post('/spotify/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({ 
        error: 'Missing refresh token',
        message: 'Refresh token is required'
      });
    }

    console.log('Refreshing access token...');

    // Prepare form data for Spotify API
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refresh_token);
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);

    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('Successfully refreshed token');
    res.json(response.data);
    
  } catch (error) {
    console.error('Token refresh error:', error.response?.data || error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: 'Spotify API Error',
        message: error.response.data?.error_description || error.response.data?.error || 'Unknown error',
        details: error.response.data
      });
    } else {
      res.status(500).json({ 
        error: 'Server Error',
        message: error.message 
      });
    }
  }
});

// Get current playing track
app.get('/spotify/current-track/:access_token', async (req, res) => {
  try {
    const { access_token } = req.params;
    
    if (!access_token) {
      return res.status(400).json({ 
        error: 'Missing access token',
        message: 'Access token is required'
      });
    }

    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    if (response.status === 204) {
      return res.json({ 
        is_playing: false,
        message: 'No track currently playing'
      });
    }
    
    res.json(response.data);
    
  } catch (error) {
    console.error('Current track error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token expired or invalid'
      });
    } else if (error.response) {
      res.status(error.response.status).json({
        error: 'Spotify API Error',
        message: error.response.data?.error?.message || 'Unknown error',
        details: error.response.data
      });
    } else {
      res.status(500).json({ 
        error: 'Server Error',
        message: error.message 
      });
    }
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🎵 Spotify Auth Server Started');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log('✅ Server ready to handle requests');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});