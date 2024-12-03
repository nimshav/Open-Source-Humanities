require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

// Use the port provided by Heroku, otherwise default to 3000 if running locally
const PORT = process.env.PORT || 3000;

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint to fetch tweets from Twitter API
app.get('/api/tweets', async (req, res) => {
    try {
        const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
            headers: {
                'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
            },
            params: {
                'query': '#OpenSourceHumanities',
                'tweet.fields': 'created_at,author_id,text'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching tweets:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching tweets', details: error.response ? error.response.data : error.message });
    }
});

// Start the server and bind to the dynamic port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});