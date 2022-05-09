const express = require("express");
const app = express();
const body_parser = require("body-parser");
app.use(body_parser.json());
const helmet = require("helmet");
const fetch = require("isomorphic-fetch");

// here we make use of helmet to make our app more secure
// used just like this, Helmet includes it's main security methods.
app.use(helmet());

// this is our get request to the api.
// note that we use parameters to customize the api url and let the user search for specific items.
app.get("/data/:artist/:songName/:resultCount/:mediaType", (req, res) => {
  // these parameters are used on the frontend. We specify them here so that we can identify them when they are requested by the frontend.
  let artist = req.params.artist;
  let songName = req.params.songName;
  let resultCount = req.params.resultCount
  let mediaType = req.params.mediaType;

  // this is the fetch request to the itunes api.
  // notice how we use the parameters in the api url to specify which items we want to search for.
  // we let the user decide how many items to return because the api returns hundreds of thousands of items.
  data = fetch(
    `https://itunes.apple.com/search?artistName=${artist}&term=${songName}&entity=${mediaType}&limit=${resultCount}`
  ).then((result) => result.json().then((json) => res.json(json)));
});

// in terms of refactoring, below console.log will not be removed as it tells the user on which port this app is listening.
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
