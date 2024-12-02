require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

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
        console.error(error);
        res.status(500).send('Error retrieving tweets');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});