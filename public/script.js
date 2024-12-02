document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/tweets');
        const data = await response.json();
        const tweetsContainer = document.getElementById('tweets-container');
        const hashtag = '#OpenSourceHumanities';

        data.data.forEach(tweet => {
            const tweetElement = document.createElement('div');
            tweetElement.className = 'tweet';
            tweetElement.innerHTML = `<p>${tweet.text}</p>`;
            tweetsContainer.appendChild(tweetElement);
        });
    } catch (error) {
        console.error('Error fetching tweets:', error);
    }
});