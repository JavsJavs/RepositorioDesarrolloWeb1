let body = document.querySelector('body');
let filmList = document.createElement('ul');
let searchBar = document.querySelector('#searchBar');
let iconSwap = document.querySelector('#icon');
filmList.className = "list";

function loadFilmDetails(id) {
    window.open(`details.html?movieId=${id}`);
}

loadItems();

function loadItems() {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            filmList.innerHTML = '';
            let moviesJson = xhr.response;
            loadCredits(moviesJson);
        }
    };
    xhr.open("GET", "https://api.themoviedb.org/3/movie/popular?api_key=ce9d34d5c7e327334331ff240e4ff642&language=en-US&page=1");
    xhr.send();
}

//https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=ce9d34d5c7e327334331ff240e4ff642

function loadCredits(moviesJson) {
    for (let i = 0; i < moviesJson.results.length && i < 20; i++) {
        showData(moviesJson, i);
        const cast = new XMLHttpRequest();
        cast.responseType = 'json';
        cast.onreadystatechange = function () {
            if (cast.readyState === 4 && cast.status === 200) {
                let creditsJson = cast.response;
                showCreditData(creditsJson, i);
            }
        };
        let url = 'https://api.themoviedb.org/3/movie/' + moviesJson.results[i].id + '/credits?api_key=ce9d34d5c7e327334331ff240e4ff642';
        cast.open("GET", url);
        cast.send();
    }
}

function loadSearchData() {
    if (searchBar.value !== "") {
        const searchData = new XMLHttpRequest();
        searchData.responseType = 'json';
        searchData.onreadystatechange = function () {
            if (searchData.readyState === 4 && searchData.status === 200) {
                filmList.innerHTML = '';
                let moviesSearchData = searchData.response;
                loadCredits(moviesSearchData);
            }
        };
        let searchBarValue = searchBar.value;
        searchBarValue = searchBarValue.replace(/ /, "+");
        searchData.open("GET", `https://api.themoviedb.org/3/search/movie?api_key=ce9d34d5c7e327334331ff240e4ff642&query=${searchBarValue}`);
        searchData.send();
        iconSwap.innerHTML = `<svg onclick="reloadWeb()" id="searchIcon" xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 24 24" width="24px" height="24px"><path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"/></svg>`;
    }
}

function reloadWeb() {
    iconSwap.innerHTML = `<svg id="searchIcon" onclick="loadSearchData()" aria-hidden="true" focusable="false" data-prefix="fas"
         data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
         class="svg-inline--fa fa-search fa-w-16">
        <path fill="currentColor"
              d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
              class=""></path>
    </svg>`;
    searchBar.value = "";
    filmList.innerHTML = '';
    loadItems();
}

function showData(moviesJson, i) {
    filmList.innerHTML += `
        <li class="card" onclick="loadFilmDetails(${moviesJson.results[i].id})">
            <div class="number">${i + 1}</div>
            <div class="photoContainer"><img id="photo${i}" src="https://image.tmdb.org/t/p/w500/${moviesJson.results[i].poster_path}"></div>
            <div class="text"> 
                <div class="mainText" id="mainText${i}">
                    <div class="filmTitle">
                        <strong>${moviesJson.results[i].title}</strong>(${moviesJson.results[i].release_date.slice(0, 4)})
                    </div>
                </div>
                <div class="reviews">
                    <div class="score">${moviesJson.results[i].vote_average}</div>
                    <div class="users">${moviesJson.results[i].vote_count}<img src="https://www.library.caltech.edu/sites/default/files/styles/headshot/public/default_images/user.png?itok=1HlTtL2d.png"></div>
                </div>
            </div>
        </li>
        `;
    body.appendChild(filmList);
    photoCheck(i, moviesJson.results[i].title);
}

function photoCheck(i, title) {
    let photoToCheck = document.querySelector(`#photo${i}`);
    let photoSource = photoToCheck.src;
    if (photoSource === 'https://image.tmdb.org/t/p/w500/null') {
        photoToCheck.src = "https://i.imgflip.com/1tme00.jpg";
    }
}

function showCreditData(creditsJson, i) {
    let mainTextDiv = document.getElementById('mainText' + i);
    let directorDiv = document.createElement("div");
    directorDiv.className = "director";
    let exitFlag = 0;
    for (let j = 0; j < creditsJson.crew.length && exitFlag === 0; j++)
        if (creditsJson.crew[j].department === 'Directing' || creditsJson.crew[j].job === 'Director') {
            directorDiv.innerHTML = `${creditsJson.crew[j].name}`;
            exitFlag = 1;
        }
    exitFlag = 0;
    mainTextDiv.appendChild(directorDiv);
    let castDiv = document.createElement("div");
    castDiv.className = "cast";
    for (let j = 1; exitFlag === 0 && creditsJson.cast.length > 0; j++) {
        castDiv.innerHTML += `${creditsJson.cast[j].name}`;
        if (j < 10 && j < creditsJson.cast.length - 1)
            castDiv.innerHTML += `, `;
        else
            exitFlag = 1;
    }
    mainTextDiv.appendChild(castDiv);
}

searchBar.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        loadSearchData();
    }
});

searchBar.addEventListener("keyup", function (event) {
    if (event.keyCode === 27) {
        event.preventDefault();
        reloadWeb();
    }
});