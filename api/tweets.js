require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

// Use the port provided by Heroku, otherwise default to 3000 if running locally
const PORT = process.env.PORT || 3000;

// Serve static files from the correct 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// In-memory cache to store tweets
let cachedTweets = null;
let lastFetchedTime = 0;
let rateLimitExceeded = false; // Flag to indicate rate limit status

// Cache duration (in milliseconds) - currently set to 3 hours
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours

// API endpoint to fetch tweets from Twitter API
app.get('/api/tweets', async (req, res) => {
    const currentTime = Date.now();

    // Check if rate limit has been exceeded recently
    if (rateLimitExceeded && (currentTime - lastFetchedTime < CACHE_DURATION)) {
        console.log('Rate limit exceeded. Using cached tweets.');
        return res.status(429).json({
            error: 'Rate limit exceeded. Please try again later.',
            details: 'Using cached tweets due to rate limit.'
        });
    }

    // Check if we have valid cached data
    if (cachedTweets && (currentTime - lastFetchedTime < CACHE_DURATION)) {
        console.log('Serving tweets from cache');
        return res.json(cachedTweets);
    }

    try {
        // Make a request to Twitter API to fetch recent tweets
        const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
            headers: {
                'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
            },
            params: {
                'query': '#OpenSourceHumanities',
                'tweet.fields': 'created_at,author_id,text',
                'max_results': 5
            },
            timeout: 10000 // Set a timeout of 10 seconds
        });

        // Update the cache with new data
        cachedTweets = response.data;
        lastFetchedTime = currentTime;
        rateLimitExceeded = false; // Reset rate limit flag

        // Send the response to the client
        res.json(cachedTweets);
    } catch (error) {
        console.error('Error fetching tweets:', error.response ? error.response.data : error.message);
        const statusCode = error.response && error.response.status ? error.response.status : 500;

        // Handle rate limit errors (HTTP 429)
        if (statusCode === 429) {
            console.log('Rate limit exceeded. Please try again later.');
            rateLimitExceeded = true; // Set rate limit flag
            lastFetchedTime = currentTime; // Update the last fetched time to control retries
            res.status(429).json({
                error: 'Rate limit exceeded. Please try again later.',
                details: error.response ? error.response.data : error.message
            });
        } else if (statusCode === 500) {
            res.status(500).json({
                error: 'Server error while fetching tweets. Please try again later.',
                details: error.response ? error.response.data : error.message
            });
        } else {
            res.status(statusCode).json({
                error: 'Error fetching tweets',
                details: error.response ? error.response.data : error.message
            });
        }
    }
});

// Serve index.html by default for all other routes (useful for single-page applications)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start the server and bind to the dynamic port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});