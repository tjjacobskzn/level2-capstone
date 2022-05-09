import React, { Component } from "react";
import axios from "axios";
import "./api.css";

class ApiFrontend extends Component {
  constructor(props) {
    super(props);

    // state will be used to set the api parameters.
    this.state = {
      songName: "",
      artist: "",
      resultCount: "",
      mediaType: "song",
      items: [],
      favs: [],
      mediaVis: "hidden",
      favVis: "hidden",
    };

    // binding the "this" keyword.
    this.get = this.get.bind(this);
    this.setMedia = this.setMedia.bind(this);
    this.addAsFav = this.addAsFav.bind(this);
    this.removeFav = this.removeFav.bind(this);
  }

  // this will set state values (artist, mediaType and the  name of the media (songName)) to the value of user-input.
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // this sets the value of state.mediaType to the user selected value.
  // this will be used to determine which media type the user wants to search for.
  setMedia = (e) => {
    this.setState({
      mediaType: e.target.value,
    });
  };

  // this is our GET request to the api.
  get = (e) => {
    // this reveals the div holding our returned songs.
    if (this.state.mediaVis === "hidden") {
      this.setState({
        mediaVis: "visible",
      });
    }

    if (e) {
      // we use e.preventDefault to not reveal data in the url.
      e.preventDefault();
    }

    // this indicates that the app is loading.
    this.setState({
      items: [
        {
          trackName: "loading...",
          artistName: "please wait",
          collectionViewUrl: "loading",
        },
      ],
    });

    // axios will be used to handle our get statement.
    // as you can see our URL has parameters that determine what the api returns.
    axios
      .get(
        `/data/${this.state.artist}/${this.state.songName}/${this.state.resultCount}/${this.state.mediaType}`
      )
      .then((response) => {
        // error handling. in the case of error we tell the user that they chose an invalid media type.
        // the actual media selection gives the user specific types because the api terms are unnatural to
        // people who do not know how an api works. this way we avoid possible errors.
        if (response.data.errorMessage) {
          this.setState({
            items: [],
            isloaded: true,
          });
          alert("Invalid media type. Try: song, musicVideo etc...");
        } else {
          // we get the result from the api and use it as state.items array data.
          const data = response.data.results;
          this.setState({
            items: data,
          });
        }
      });
  };

  // this lets a user add an item to their list of favourites.
  addAsFav(e) {
    let newFavs = this.state.favs;

    // we push the values of our custom attributes into state.favs (newFavs).
    // this will be the users favourite songs/items
    newFavs.push(
      e.target.getAttribute("songname") +
        " : " +
        e.target.getAttribute("artist")
    );
    // we then update state.favs with the data in newFavs.
    this.setState({
      favs: newFavs,
    });

    // this reveals the users favourite items.
    if (this.state.favVis === "hidden") {
      this.setState({
        favVis: "visible",
      });
    }
  }

  // this removes items from the user's favourites list.
  removeFav(e) {
    let newFavs = this.state.favs;
    // we splice the specific item the user clicks on by targeting it's id and splicing only the one item.
    newFavs.splice(e.target.id, 1);
    this.setState({
      favs: newFavs,
    });

    // if the user has no more favourite items we hide the favourites list.
    if (this.state.favs.length === 0) {
      this.setState({
        favVis: "hidden",
      });
    }
  }

  // here we render our data to the frontend.
  render() {
    const { items, favs } = this.state;

    return (
      <div className="mainBody">
        <div>
          {/* when this form is submitted it triggers this.get to get data from the api */}
          <form onSubmit={this.get}>
            <div className="formName">
              <label className="nameLabel">Name : </label>
              {/* this is the song/item name input which will give state values their user input values when this.handleChange is triggered */}
              <input
                onChange={this.handleChange}
                name="songName"
                required
              ></input>
            </div>

            <div className="formArtist">
              <label className="artistLabel">Artist : </label>
              {/* this is the artist name input which will give state values their user input values when this.handleChange is triggered */}
              <input
                className="artistInput"
                onChange={this.handleChange}
                name="artist"
                required
              ></input>
            </div>
            <div className="formArtist">
              <label className="nameLabel">Count : </label>
              {/* this is the result amount input which will give state values their user input values when this.handleChange is triggered */}
              <input
                placeholder="5"
                onChange={this.handleChange}
                name="resultCount"
                required
              ></input>
            </div>

            <div className="formMediaType">
              <label>Media type : </label>
              {/* this is the media type dropdown menu which will give state values their user input values when this.setMedia is triggered */}
              <select onChange={this.setMedia}>
                <option value="song">Music</option>
                <option value="podcast">Podcast</option>
              </select>
            </div>

            <div className="searchBtnDiv">
              {/* this input element is used to search for the song/item that the user has specified */}
              <input type="submit" value="Search"></input>
            </div>
          </form>
        </div>
        <hr></hr>

        <div>
          <div
            className="searchResults"
            style={{ visibility: this.state.mediaVis }}
          >
            <div>
              <h3 className="searchResultsHeading">Available data</h3>
              <p className="mediaInfo">
                Click on items to add them to favourites!
              </p>
            </div>
            <hr></hr>
            {/* this will display the data returned from the api. note that each item created has a unique key */}
            <div className="media">
              {items.map((item) => (
                <h4
                  className="mediaItem"
                  artist={item.artistName}
                  songname={item.trackName}
                  onClick={this.addAsFav}
                  key={item.collectionViewUrl}
                >
                  {item.trackName} : {item.artistName}
                  {item.description}
                </h4>
              ))}
              <hr></hr>
            </div>
          </div>

          <div>
            <div
              className="favourites"
              style={{ visibility: this.state.favVis }}
            >
              <hr></hr>
              <div>
                <h3 className="favouritesHeading">My favourites</h3>
                <p className="mediaInfo">Click on items to delete them!</p>
              </div>
              <hr></hr>
              {/* this will display the user's favourite songs/items. note that each item created has a unique key */}
              <div className="favMedia">
                {favs.map((item, index) => (
                  <h4
                    className="mediaItem"
                    key={index}
                    id={index}
                    onClick={this.removeFav}
                  >
                    {item}
                  </h4>
                ))}
              </div>
              <hr></hr>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ApiFrontend;
