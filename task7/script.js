//var json = new XMLHttpRequest();
var body = document.querySelector('body');
var filmList = document.createElement('ul');
filmList.className = "list";

function loadItems() {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var moviesJson = xhr.response;
            loadCredits(moviesJson);
        }
    };
    xhr.open("GET", "https://api.themoviedb.org/3/movie/popular?api_key=ce9d34d5c7e327334331ff240e4ff642&language=en-US&page=1");
    xhr.send();
}

//https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=ce9d34d5c7e327334331ff240e4ff642

function loadCredits(moviesJson) {
    for (let i = 0; i < moviesJson.results.length; i++) {
        showData(moviesJson, i);
        const cast = new XMLHttpRequest();
        cast.responseType = 'json';
        cast.onreadystatechange = function () {
            if (cast.readyState === 4 && cast.status === 200) {
                var creditsJson = cast.response;
                showCreditData(creditsJson, i);
            }
        };
        let url = 'https://api.themoviedb.org/3/movie/' + moviesJson.results[i].id + '/credits?api_key=ce9d34d5c7e327334331ff240e4ff642';
        cast.open("GET", url);
        cast.send();
    }
}

function showData(moviesJson, i) {
    let film = document.createElement("div");
    film.className = "card";
    {
        let numberDiv = document.createElement("div");
        numberDiv.className = "number";
        numberDiv.innerText = i + 1;
        film.appendChild(numberDiv);

        let photoContainerDiv = document.createElement("div");
        photoContainerDiv.className = "photoContainer";
        photoContainerDiv.innerHTML += `<img src=" https://image.tmdb.org/t/p/w500/${moviesJson.results[i].poster_path}">`;
        film.appendChild(photoContainerDiv);

        let textDiv = document.createElement("div");
        textDiv.className = "text";
        {
            let mainTextDiv = document.createElement("div");
            mainTextDiv.className = "mainText";
            mainTextDiv.id = "mainText"+i;
            {
                let filmTitleDiv = document.createElement("div");
                filmTitleDiv.className = "filmTitle";
                filmTitleDiv.innerHTML = `<strong><a href="https://www.google.com/search?q=${moviesJson.results[i].title}">${moviesJson.results[i].title}</a></strong>`;
                filmTitleDiv.innerHTML += `(${moviesJson.results[i].release_date})`;
                filmTitleDiv.innerHTML += `<img src="https://i.ebayimg.com/images/g/0~gAAMXQ9qpRTk04/s-l300.jpg">`;
                mainTextDiv.appendChild(filmTitleDiv);
            }
            textDiv.appendChild(mainTextDiv);

            let reviewsDiv = document.createElement("div");
            reviewsDiv.className = "reviews";
            {
                let scoreDiv = document.createElement("div");
                scoreDiv.className = "score";
                scoreDiv.innerHTML = `${moviesJson.results[i].vote_average}`;
                reviewsDiv.appendChild(scoreDiv);

                let usersDiv = document.createElement("div");
                usersDiv.className = "users";
                usersDiv.innerHTML = `${moviesJson.results[i].vote_count} `;
                usersDiv.innerHTML += `<img src="https://www.library.caltech.edu/sites/default/files/styles/headshot/public/default_images/user.png?itok=1HlTtL2d.png">`;
                reviewsDiv.appendChild(usersDiv);
            }
            textDiv.appendChild(reviewsDiv);
        }
        film.appendChild(textDiv);
    }
    filmList.appendChild(film);
    //filmList.innerHTML += `<li>${moviesJson.results[i].title}</li>`;
    body.appendChild(filmList);
}

function showCreditData(creditsJson, i) {
    let mainTextDiv = document.getElementById('mainText'+i);
    let directorDiv = document.createElement("div");
    directorDiv.className = "director";
    let exitFlag = 0;
    for (let j = 0; j < creditsJson.crew.length && exitFlag === 0; j++)
        if (creditsJson.crew[j].department === 'Directing' || creditsJson.crew[j].job === 'Director') {
            directorDiv.innerHTML = `<a href="https://www.google.com/search?q=${creditsJson.crew[j].name}">${creditsJson.crew[j].name}</a>`;
            exitFlag = 1;
        }
    exitFlag = 0;
    mainTextDiv.appendChild(directorDiv);
    let castDiv = document.createElement("div");
    castDiv.className = "cast";
    for (let j = 1; exitFlag === 0; j++) {
        castDiv.innerHTML += `<a href="https://www.google.com/search?q=${creditsJson.cast[j].name}">${creditsJson.cast[j].name}</a>`;
        if (j < 10 && j < creditsJson.cast.length-1)
            castDiv.innerHTML += `, `;
        else
            exitFlag = 1;
    }
    mainTextDiv.appendChild(castDiv);
}