document.addEventListener('DOMContentLoaded', () => {
    const tweetsTabButton = document.querySelector('.tab-button[onclick="showTab(\'tweets-tab\')"]');
    const tweetsContainer = document.getElementById('tweets-container');
    let tweetsFetched = false; // Flag to prevent multiple fetches

    // Function to fetch and display tweets
    async function fetchAndDisplayTweets() {
        // If tweets are already fetched, do not fetch again
        if (tweetsFetched) return;

        // Display loading indicator
        tweetsContainer.innerHTML = '<p>Loading tweets...</p>';

        try {
            // Fetch tweets from the server
            const response = await fetch('/api/tweets');

            // Handle response errors
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch tweets');
            }

            // Parse response data
            const data = await response.json();

            // Clear loading indicator
            tweetsContainer.innerHTML = '';

            // Check if there are tweets to display
            if (data.data && data.data.length > 0) {
                data.data.forEach(tweet => {
                    const tweetElement = document.createElement('div');
                    tweetElement.className = 'tweet';

                    // Format the tweet text with links
                    tweetElement.innerHTML = `
                        <p>${formatText(tweet.text)}</p>
                        <span class="tweet-date">Posted on: ${new Date(tweet.created_at).toLocaleString()}</span>
                    `;

                    tweetsContainer.appendChild(tweetElement);
                });
            } else {
                // Display a message if no tweets are found
                tweetsContainer.innerHTML = '<p>No tweets found for the hashtag.</p>';
            }

            tweetsFetched = true; // Set the flag to true after successful fetch
        } catch (error) {
            // Handle errors and display an error message
            console.error('Error fetching tweets:', error);
            tweetsContainer.innerHTML = '<p>Error loading tweets. Please try again later.</p>';
        }
    }

    /**
     * Utility function to format tweet text with clickable links for hashtags and mentions.
     * @param {string} text - The text of the tweet.
     * @returns {string} - Formatted text with links.
     */
    function formatText(text) {
        return text
            .replace(/#(\w+)/g, '<a href="https://twitter.com/hashtag/$1" target="_blank">#$1</a>')
            .replace(/@(\w+)/g, '<a href="https://twitter.com/$1" target="_blank">@$1</a>');
    }

    // Attach an event listener to the "Tweets" tab button
    tweetsTabButton.addEventListener('click', fetchAndDisplayTweets);
});
