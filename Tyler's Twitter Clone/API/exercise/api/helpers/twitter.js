const axious = require('axios');
const url = "https://api.twitter.com/1.1/search/tweets.json";

class Twitter{
    get(query, count, maxId){
        return axious.get(url, {
            params: {
                q: query,
                count: count,
                tweet_mode: "extended",
                max_id: maxId
            },
            headers: {
                "Authorization": `Bearer ${process.env.TWITTER_API_TOKEN}`
            }
        })
    }
}

module.exports = Twitter;