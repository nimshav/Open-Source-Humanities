require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public')); // serve your HTML, CSS, JS

app.get('/tweets', async (req, res) => {
    try {
        const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
            headers: {
                'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
            },
            params: {
                'query': '#Open-Source-Humanities',
                'tweet.fields': 'created_at,author_id,text'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving tweets');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});