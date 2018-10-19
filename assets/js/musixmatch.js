let input = '';

let getTrack = () =>{
  let page = window.location.href;
  let redirectLink = new URL(page);
  let searchParams = new URLSearchParams(redirectLink.search);
  input = searchParams.get('search');
}
getTrack();

const proxy = 'https://cors.io/?'
const link = 'https://api.musixmatch.com/ws/1.1/track.search';
const url = `${proxy}${link}`;

let getLyrics = (track_id) =>{
    let lyrics = document.getElementById('lyrics');
    const lyricsURL = `${proxy}https://api.musixmatch.com/ws/1.1/track.lyrics.get`;
    axios.get(lyricsURL, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        apikey: 'd175c41a09dfcb1098e2f6fcce494ad7',
        track_id,
      }
    })
    .then(response =>{
      let results = response.data.message.body.lyrics;
      if (typeof results === 'undefined') {
        lyrics.innerHTML = 'Loading...';
      }
      lyrics.innerHTML = results.lyrics_body;
    })
}

// Check if axios is connected to the internet since am using a CDN
if(typeof axios === 'undefined'){
  let main = document.getElementById('main');
  main.innerHTML = '<h3>Oops! there seems to be something wrong with your internet connection</h3>';
}

axios.get(url, {
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    apikey: 'd175c41a09dfcb1098e2f6fcce494ad7',
    q_track: input,
    f_has_lyrics: 1,
    s_track_rating: 'desc'
  }
})
.then(response => {
  let template = document.getElementById('results');
  let searchCriteria = document.getElementById('search_criteria');
  let lists = response.data.message.body.track_list;
  if (Array.isArray(lists) && lists.length === 0) {
    template.innerHTML = ('Loading...');
  }
  let compose = '<p><div class="card col-md-6 offset-md-3">';
  lists.forEach(function(list) {
    for (x in list){
      compose += `
        <div class="card-header">
          <b>Artist:</b> ${list[x].artist_name}
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><b>Album name:</b> ${list[x].album_name} </li>
          <li class="list-group-item"><b>Release date:</b> ${list[x].first_release_date} </li>
          <li class="list-group-item"><b>Track ID:</b> ${list[x].track_id} </li>
          <li class="list-group-item"><b>Song Title:</b> ${list[x].track_name}
            <button data-toggle="modal" data-target="#myModal" class="btn btn-primary" onclick="getLyrics(${list[x].track_id})">Get Lyrics</button>
          </li>
        </ul><br>
      `;
    }
  });
  compose += "</div></p>";
  template.innerHTML = (compose);
  searchCriteria.innerHTML = (`"${input}"`);
})
.catch((err) => {console.log(err)})
