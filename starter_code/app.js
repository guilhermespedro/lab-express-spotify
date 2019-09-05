const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');


// require spotify-web-api-node package here:


// Remember to insert your credentials here
const clientId = '5f79f9fa12074743bb190ec0115fb780',
    clientSecret = '21c69ee40d66470f86783a3f1adcf23f';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded( { extended: false}));


// setting the spotify-api goes here:

app.get('/', (req, res, next) => {
  res.render('index');
});

// app.get('/artists', (req, res, next) => {
//   let artists = req.body.artistsname
//   spotifyApi.searchArtists(artists)
//     .then(artistsFromApi => {
//       console.log("The received data from the API: ", artistsFromApi.body);
//       const data = {
//         artists: artistsFromApi,
//       }
//     .catch(err => {
//       console.log("The error while searching artists occurred: ", err);
//     })
//   res.render('artists-page');
// })

app.get('/artists', (req, res, next) => {
  const artists = req.query.artist
  console.log("ARTISTS", artists)
  spotifyApi.searchArtists(artists)
    .then(artistsFromApi => {
      console.log("The received data from the API: ", artistsFromApi.body.artists.items);
      const data = {
        artists: artistsFromApi.body.artists.items,
        firstArtist: artistsFromApi.body.artists.items[0].name,
        artistImage: artistsFromApi.body.artists.items,

      }
      res.render('artists-page', data);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})





// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
