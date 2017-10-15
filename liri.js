//create filesystem variable
var fs = require('fs');
//created variable for keys from keys file
var keys = require("./keys.js");
//create variables for installs
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");

//add spotify and twitter keys to constructors
var spotify = new Spotify(keys.spotifyKeys);
//console.log(spotify); 

var twitter = new Twitter(keys.twitterKeys);
//console.log(twitter);
//twitter user id for search
var twitscreenName = {user_id:"lspencerliribot"};
//variable for omdb key
var omdbKey= keys.omdb.key;


//variables for arguments
var command = process.argv[2];
var param =process.argv[3];

//function for running the command line items
function runCommand() {
  switch(command) {
    case "my-tweets":
      twitter.get("statuses/user_timeline/", twitscreenName, function(error, tweet, response) {
        if (!error) {
          for(var i = 0; i<tweet.length;i++ ) {
            console.log('\n'+tweet[i].text)
            console.log(tweet[i].created_at+'\n')
            fs.appendFile("log.txt",'\n'+tweet[i].text)
            fs.appendFile("log.txt",tweet[i].created_at+'\n')
          }
        }
        else {
          console.log(error);
        }
      })
    break;

    case "spotify-this-song":
      if(param === undefined) {
        spotifyIt("The Sign")
      }
      else {
        spotifyIt(param)
      }     
    break;

    case "movie-this":
      if(param === undefined) {
        omdbIt("Mr. Nobody")
      }
      else {
        omdbIt(param)
      };
  };
};

//function for running spotify 
function spotifyIt(_param) {
  spotify.search({ type: 'track', query: _param, limit: 2 }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
    }
    else if (!err) {
      fs.appendFile("log.txt", command+": " + param+"\n")
      for (var i =0; i <data.tracks.items[0].album.artists.length; i ++){
        console.log('\n'+"Artists: "+JSON.stringify(data.tracks.items[0].album.artists[i].name)+'\n')
        fs.appendFile("log.txt",'\n'+"Artists: "+JSON.stringify(data.tracks.items[0].album.artists[i].name)+'\n')
      }
      console.log("Track Name: "+JSON.stringify(data.tracks.items[0].name)+'\n')
      console.log("Preview Link: "+JSON.stringify(data.tracks.items[0].preview_url)+'\n')
      console.log("Album Name: "+JSON.stringify(data.tracks.items[0].album.name)+'\n')
      fs.appendFile("log.txt","Track Name: "+JSON.stringify(data.tracks.items[0].name)+'\n')
      fs.appendFile("log.txt","Preview Link: "+JSON.stringify(data.tracks.items[0].preview_url)+'\n')
      fs.appendFile("log.txt","Album Name: "+JSON.stringify(data.tracks.items[0].album.name)+'\n')
    }
  });
};

//function for running omdb search
function omdbIt(_param) {
  request("http://www.omdbapi.com/?t="+_param+"&y=&plot=short&apikey="+omdbKey, function(error, response, body) {
    if(!error && response.statusCode === 200) {
      console.log('\n'+"Title: " + JSON.parse(body).Title+'\n');
      console.log("Year: "+JSON.parse(body).Year+'\n');
      console.log("IMDB Rating: "+JSON.parse(body).imdbRating+'\n');
      console.log("Rotten Tomatos Rating: "+JSON.parse(body).Ratings[1].Value+'\n');
      console.log("Country: "+JSON.parse(body).Country+'\n');
      console.log("Languages: "+JSON.parse(body).Language+'\n');
      console.log("Plot: "+JSON.parse(body).Plot+'\n');
      console.log("Actors: "+JSON.parse(body).Actors+'\n');
      fs.appendFile("log.txt", command+": " + param+"\n")
      fs.appendFile("log.txt",'\n'+"Title: " + JSON.parse(body).Title+'\n' )
      fs.appendFile("log.txt","Year: "+JSON.parse(body).Year+'\n')
      fs.appendFile("log.txt","IMDB Rating: "+JSON.parse(body).imdbRating+'\n')
      fs.appendFile("log.txt","Rotten Tomatos Rating: "+JSON.parse(body).Ratings[1].Value+'\n')
      fs.appendFile("log.txt","Country: "+JSON.parse(body).Country+'\n')
      fs.appendFile("log.txt","Languages: "+JSON.parse(body).Language+'\n')
      fs.appendFile("log.txt","Plot: "+JSON.parse(body).Plot+'\n')
      fs.appendFile("log.txt","Actors: "+JSON.parse(body).Actors+'\n')
    }
    else {
      console.log(err);
    }
  });
};

//function for reading random.txt
function readRandom() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      console.log(error);
    }
    else {
      var dataArr = data.split(",");  
      command = dataArr[0]
      param = dataArr[1]
      //console.log(command, param)
      runCommand();
    }
 });
};

if (process.argv.length === 2){
  readRandom();
}
else if (process.argv.length >=3){
  runCommand()
};



	