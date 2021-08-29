// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


const AUTHORIZE = "http://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
var redirect_uri = "https://8080-cs-509384085718-default.cs-us-central1-pits.cloudshell.dev/spotify_AN.html"
var client_id = "";
var client_secret = "";
var _baseUri = "https://api.spotify.com/v1";
function getReccomendation() {
    callApi( "GET", _baseUri + "/recommendations?limit=1&market=US&seed_artists=7Ln80lUS6He07XvHI8qqHH&seed_genres=alternative&seed_tracks=5ruzrDWcT0vuJIOMW7gMnW", null, handleGetReccomendationResponse);
    //limit = # of reccomendations, seed artist = url digits+letters if open artist on spotify website, same with seed tracks, seed genres is just a name
    //can include several restrictions such as valence which = happiness-ish, range is 0-1, 1 = happy
    //used a song from the strokes as seed track and arctic monkeys as seed artist
    ///recommendations?limit=1&market=US&seed_artists=7Ln80lUS6He07XvHI8qqHH&seed_genres=alternative&seed_tracks=5ruzrDWcT0vuJIOMW7gMnW&min_valence=0.9
}
function handleGetReccomendationResponse(){
     if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        if ( data.tracks != null ){
            document.getElementById("recAlbumImage").src = data.tracks[0].album.images[0].url;
            document.getElementById("recTrackTitle").innerHTML = data.tracks[0].name;
            document.getElementById("recTrackArtist").innerHTML = data.tracks[0].artists[0].name;
            document.getElementById("recLink").setAttribute("href",data.tracks[0].external_urls.spotify);
        }

    }
    else if ( this.status == 204 ){

    }
    else if ( this.status == 401 ){
        refreshAccessToken();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}
function onPageLoad(){
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");
    if(window.location.search.length > 0){       
        handleRedirect();
    }
}
function handleRedirect(){
    let code = getCode();
    fetchAccessToken(code);
    window.history.pushState("","",redirect_uri);
}
function getCode(){
    let code = null;
    const queryString = window.location.search;
    if(queryString.length > 0)
    {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
    }
    return code;
}

function fetchAccessToken( code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function refreshAccessToken(){
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}
function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function requestAuthorization()
{
    client_id = document.getElementById("clientId").value;
    client_secret = document.getElementById("clientSecret").value;
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret);
    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen

}

function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}

function handleApiResponse(){
    if ( this.status == 200){
        console.log(this.responseText);
        setTimeout(currentlyPlaying, 2000);
    }
    else if ( this.status == 204 ){
        setTimeout(currentlyPlaying, 2000);
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }    
}

function currentlyPlaying(){
    callApi( "GET", _baseUri + "/me/player?market=US", null, handleCurrentlyPlayingResponse );
}

function handleCurrentlyPlayingResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        if ( data.item != null ){
            document.getElementById("albumImage").src = data.item.album.images[0].url;
            document.getElementById("trackTitle").innerHTML = data.item.name;
            document.getElementById("trackArtist").innerHTML = data.item.artists[0].name;
        }

    }
    else if ( this.status == 204 ){

    }
    else if ( this.status == 401 ){
        refreshAccessToken();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}
function getSongFromSpotify(){
    callApi( "GET", _baseUri + "/search?q=tick+tock+artist:joji&type=track", null, handleGetSongResponse );

}
function handleGetSongResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        if ( data.tracks.items != null ){
            document.getElementById("fetchedAlbumImage").src = data.tracks.items[0].album.images[0].url;
            document.getElementById("fetchedTrackTitle").innerHTML = data.tracks.items[0].name;
            document.getElementById("fetchedTrackArtist").innerHTML = data.tracks.items[0].artists[0].name;
            document.getElementById("fetchedLink").setAttribute("href",data.tracks.items[0].external_urls.spotify);
        }

    }
    else if ( this.status == 204 ){

    }
    else if ( this.status == 401 ){
        refreshAccessToken();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

