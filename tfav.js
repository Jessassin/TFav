var Twitter = require('twitter');
var authconfig = require("./authconfig.js");
var util = require('util');

require("console-stamp")(console, {
    pattern:"HH:MM:ss",
    label: false
});

var filtertext = "I liked a @YouTube video from @Jessassin"

var client = new Twitter({
  consumer_key: authconfig.consumer_key,
  consumer_secret: authconfig.consumer_secret,
  access_token_key: authconfig.access_token_key,
  access_token_secret: authconfig.access_token_secret
});

var debug = false;

client.stream('statuses/filter', {track: filtertext}, function(stream) {
  stream.on('data', function(tweet) {
    console.log("Tweet text: " + tweet.text);
    console.log("Tweet ID: " + tweet.id_str);
    if(debug) {
      console.log(util.inspect(tweet, {showHidden: false, depth: null}));
    }
    client.post("favorites/create", {id: tweet.id_str}, function(error, tweet1, response){
      if (!error) {
        console.log("Favorited tweet. ID: " + tweet.id_str);
      } else {
        console.log("Error favoriting tweet ID: " + tweet.id_str);
        console.log("Error: " + util.inspect(error, {showHidden: false, depth: null}));
      }
    });
  });
  stream.on('error', function(error) {
    throw error;
  });
});

console.log("Starting");
