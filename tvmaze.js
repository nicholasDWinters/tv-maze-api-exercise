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
  try {
    const res = await axios.get(`http://api.tvmaze.com/search/shows`, { params: { q: query } });
    const defaultImg = 'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300';
    let showArray = [];

    for (let i = 0; i < res.data.length; i++) {

      let id = res.data[i].show.id;
      let name = res.data[i].show.name;
      let summary = res.data[i].show.summary;
      let image;

      if (res.data[i].show.image !== null) {
        image = res.data[i].show.image.medium;
      } else {
        image = defaultImg;
      }

      let newObj = { id, name, summary, image };
      showArray.push(newObj);
    }
    return showArray;
  } catch (e) {
    alert("Error finding that for you! Please try again!")
    console.log(e);
  }
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class='col-lg-1 mb-3'></div>
      <div class="col-lg-4 mb-3 Show" data-show-id="${show.id}">
         <div class="card h-100" data-show-id="${show.id}">
           <div class="card-body">
           <img class="card-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class='btn btn-info' data-toggle='modal' data-target='#episodesModal'>Show Episodes</button>
           </div>
         </div>
       </div>
       <div class='col-lg-1 mb-3'></div>
      `);

    $showsList.append($item);
  }
}

function populateEpisodes(episodes) {
  // const $modalHeading = $('#showName')
  console.log(episodes);
  const $modalList = $('#modalList');
  for (let episode of episodes) {
    let $item = $(
      `<li> ${episode.name} - (Season ${episode.season}, Episode ${episode.number})</li> `
    );
    $modalList.append($item);
  }

}

$('#shows-list').on('click', async function (evt) {
  if (evt.target.tagName === 'BUTTON') {
    let showId = evt.target.parentElement.parentElement.dataset.showId;
    let episodesArr = await getEpisodes(showId);
    let showName = evt.target.parentElement.querySelector('h5').innerText;

    $('#showNameHeading').text(`${showName} Episodes`);
    populateEpisodes(episodesArr);

  };
})


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
  // / TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above/
  try {

    const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
    let episodesArr = [];
    for (let i = 0; i < res.data.length; i++) {
      let id = res.data[i].id;
      let name = res.data[i].name;
      let season = res.data[i].season;
      let number = res.data[i].number;
      let newObj = { id, name, season, number };
      episodesArr.push(newObj);
    }

    return episodesArr;

  } catch (e) {
    alert('Unable to get episodes! Sorry about that, please try again.');
    console.log(e);
  }
}
