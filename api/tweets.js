require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint to get tweets from Twitter API
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

// Start the server, bind to the correct port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});