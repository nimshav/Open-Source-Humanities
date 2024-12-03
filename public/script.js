document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/tweets');
        if (!response.ok) {
            throw new Error('Failed to fetch tweets');
        }
        const data = await response.json();

        const tweetsContainer = document.getElementById('tweets-container');
        if (data.data) {
            data.data.forEach(tweet => {
                const tweetElement = document.createElement('div');
                tweetElement.className = 'tweet';
                tweetElement.innerHTML = `<p>${tweet.text}</p>`;
                tweetsContainer.appendChild(tweetElement);
            });
        } else {
            tweetsContainer.innerHTML = '<p>No tweets found for the hashtag.</p>';
        }
    } catch (error) {
        console.error('Error fetching tweets:', error);
        document.getElementById('tweets-container').innerHTML = '<p>Error loading tweets. Please try again later.</p>';
    }
});