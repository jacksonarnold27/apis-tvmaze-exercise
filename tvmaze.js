

const SHOWS_API = "http://api.tvmaze.com/search/shows/?q=";
const DEFAULT_IMG = "https://tinyurl.com/tv-missing";




/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */
/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  let shows = [];
  const api_url = SHOWS_API + query;
  const response = await axios.get(api_url);
  const data = response.data;

  shows = data.map((value) => {
    let show = value.show;
    if (!!show.image) { show.image = show.image.original; }
    else { show.image = DEFAULT_IMG; };
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image
    };
  });

  return shows;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Populate episodes list */
function populateEpisodes(episodes) {
  const $episodesList = $('#episodes-list');
  $episodesList.empty();

  for (let episode of episodes) {
    let newLi = $(`<li>"${episode.name}" (Season ${episode.season}, Episode ${episode.number})</li>`);
    $episodesList.append(newLi);
  };
  $('#episodes-area').show();
};


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const api_url = `http://api.tvmaze.com/shows/${id}/episodes`;

  const response = await axios.get(api_url);
  const data = response.data;


  let episodes = data.map((episode) => {
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    };
  });
  return episodes;
}
