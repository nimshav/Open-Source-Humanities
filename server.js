require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;
const Twit = require('twit');
const T = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET_KEY,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET

// Serve static files from the 'public' folder (HTML, CSS, JS)
app.use(express.static('public'));

// Serve index.html when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/tweets', async (req, res) => {
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
};

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});