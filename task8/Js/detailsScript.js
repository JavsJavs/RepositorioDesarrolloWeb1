//let body = document.querySelector('body');
let detailsPhotoContainer = document.querySelector(".detailsPhotoContainer");
let detailsFilmTitle = document.querySelector(".detailsFilmTitle");
let detailsDirector = document.querySelector(".detailsDirector");
let detailsCast = document.querySelector(".detailsCast");
let detailsOverview = document.querySelector(".detailsOverview");
let detailsBackgroundImage = document.querySelector(".detailsBackgroundImage");
let detailsBody = document.querySelector(".Details");
let movie_id = new URL(location).searchParams.get('movieId');

loadDetailItems();

function loadDetailItems() {
    const xhrd = new XMLHttpRequest();
    xhrd.responseType = 'json';
    xhrd.onreadystatechange = function () {
        if (xhrd.readyState === 4 && xhrd.status === 200) {
            let detailsJson = xhrd.response;
            loadDetailCrew(detailsJson);
        }
    };
    let detailsUrl = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=ce9d34d5c7e327334331ff240e4ff642&language=en-US`;
    console.log(detailsUrl);
    xhrd.open("GET", detailsUrl);
    xhrd.send();
}

function loadDetailCrew(detailsJson) {
    const xhrd = new XMLHttpRequest();
    xhrd.responseType = 'json';
    xhrd.onreadystatechange = function () {
        if (xhrd.readyState === 4 && xhrd.status === 200) {
            let detailsCrewJson = xhrd.response;
            showDetailsData(detailsCrewJson, detailsJson);
        }
    };
    let detailsUrl = `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=ce9d34d5c7e327334331ff240e4ff642`;
    console.log(detailsUrl);
    xhrd.open("GET", detailsUrl);
    xhrd.send();
}

function showDetailsData(detailsCrewJson, detailsJson) {
    let nullFlag = '"' + detailsJson.backdrop_path + '"';
    if (nullFlag === '"null"')
        detailsBackgroundImage.innerHTML = `<img src="https://i.imgflip.com/1tme00.jpg">`;
    else
        detailsBackgroundImage.innerHTML = `<img src="https://image.tmdb.org/t/p/w500/${detailsJson.backdrop_path}">`;
    nullFlag = '"' + detailsJson.poster_path + '"';
    if (nullFlag === '"null"')
        detailsPhotoContainer.innerHTML = `<img src="https://i.imgflip.com/1tme00.jpg">`;
    else
        detailsPhotoContainer.innerHTML = `<img src="https://image.tmdb.org/t/p/w500/${detailsJson.poster_path}">`;
    detailsFilmTitle.innerHTML += `<strong><a href="https://www.google.com/search?q=${detailsJson.original_title}">${detailsJson.original_title}</a></strong>`;
    detailsFilmTitle.innerHTML += `${'(' + detailsJson.release_date.slice(0, 4) + ')'}`;
    let productionCountry;
    nullFlag = 1;
    for (let i = 0; i < detailsJson.production_companies.length; i++)
        if (detailsJson.production_companies[i].origin_country !== "") {
            productionCountry = detailsJson.production_companies[i].origin_country;
            nullFlag = 0;
            break;
        }
    if (nullFlag)
        detailsFilmTitle.innerHTML += `<img src="https://i.imgflip.com/1tme00.jpg">`;
    else
        detailsFilmTitle.innerHTML += `<img src="https://www.countryflags.io/${productionCountry}/flat/64.png">`;
    let exitFlag = 0;
    for (let j = 0; j < detailsCrewJson.crew.length && exitFlag === 0; j++)
        if (detailsCrewJson.crew[j].department === 'Directing' || detailsCrewJson.crew[j].job === 'Director') {
            detailsDirector.innerHTML += `<a href="https://www.google.com/search?q=${detailsCrewJson.crew[j].name}">${detailsCrewJson.crew[j].name}</a>`;
            exitFlag = 1;
        }
    exitFlag = 0;
    for (let i = 1; exitFlag === 0; i++) {
        detailsCast.innerHTML += `<a href="https://www.google.com/search?q=${detailsCrewJson.cast[i].name}">${detailsCrewJson.cast[i].name}</a>`;
        if (i < 10 && i < detailsCrewJson.cast.length - 1)
            detailsCast.innerHTML += `, `;
        else
            exitFlag = 1;
    }
    detailsOverview.innerHTML += `${detailsJson.overview}`;
}

/*
<div class="detailsPhotoContainer">

    </div>
    <div class="detailsText">
    <div class="detailsFilmTitle">

    </div>
    <div class="detailsDirector">

    </div>
    <div class="detailsCast">

    </div>
    <div class="detailsOverview">

    </div>
    </div>

 */