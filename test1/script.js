var body = document.querySelector('body');

window.onload = function() {
    loadWeb();
};

function loadWeb() {
    loadItems();
    body.innerHTML += `
    <div id="dropdown">
        <select id="mySelect" onchange="changeBreed()">
            <option>Click a breed to see the photos</option>
        </select>
    </div>
    <div id="exhibitor">
    </div>`;
    document.querySelector("#webLoaderButton").innerHTML = ``;
}

function loadItems() {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var dogsJson = xhr.response;
            loadDropDown(dogsJson);
        }
    };
    xhr.open("GET", "https://dog.ceo/api/breeds/list/all");
    xhr.send();
}

function changeBreed() {
    let breedName = document.querySelector("#mySelect").value;
    console.log(document.querySelector("#mySelect").value);
    breedName = breedName.toLowerCase();
    loadBreedPhotos(breedName);
}

function loadDropDown(dogsJson) {
    let jsonKeys = Object.keys(dogsJson.message);
    console.log(jsonKeys[0]);
    let selectList = document.querySelector("#mySelect");
    for (let i = 0; i < jsonKeys.length; i++) {
        let currentBreedName = jsonKeys[i].slice(0, 1).toUpperCase() + jsonKeys[i].slice(1, jsonKeys[i].length);
        selectList.innerHTML += `<option onselect="changeBreed('${currentBreedName}','${jsonKeys[i]}')" class="dropDownItem" id="item${i}">${currentBreedName}</option>`
    }
}

function loadBreedPhotos(breedName) {
    const xhr2 = new XMLHttpRequest();
    xhr2.responseType = 'json';
    xhr2.onreadystatechange = function () {
        if (xhr2.readyState === 4 && xhr2.status === 200) {
            let currentBreedJson = xhr2.response;
            showBreedPhotos(currentBreedJson);
        }
    };
    xhr2.open("GET", `https://dog.ceo/api/breed/${breedName}/images`);
    xhr2.send();
}

function showBreedPhotos(currentBreedJson) {
    let exhibitor = document.querySelector("#exhibitor");
    exhibitor.innerHTML = '';
    console.log(currentBreedJson.message[1]);
    for (let i = 0; i < 100 && i < currentBreedJson.message.length; i++) {
        exhibitor.innerHTML += `<img src="${currentBreedJson.message[i]}">`;
    }
}