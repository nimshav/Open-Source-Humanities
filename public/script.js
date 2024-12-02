document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/tweets');
        console.log('Response status:', response.status);
        const data = await response.json();

        if (data.error) {
            console.error('Backend error:', data.details);
            return;
        }

        console.log('Tweets Data:', data);
        const tweetsContainer = document.getElementById('tweets-container');

        if (data.statuses) {
            // For twit library response (v1.1)
            data.statuses.forEach(tweet => {
                const tweetElement = document.createElement('div');
                tweetElement.className = 'tweet';
                tweetElement.innerHTML = `<p>${tweet.text}</p>`;
                tweetsContainer.appendChild(tweetElement);
            });
        } else if (data.data) {
            // For axios response (v2)
            data.data.forEach(tweet => {
                const tweetElement = document.createElement('div');
                tweetElement.className = 'tweet';
                tweetElement.innerHTML = `<p>${tweet.text}</p>`;
                tweetsContainer.appendChild(tweetElement);
            });
        }
    } catch (error) {
        console.error('Error fetching tweets:', error);
    }
});