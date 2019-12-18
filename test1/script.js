var body = document.querySelector('body');

window.onload = function () {
    loadWeb();
};

function loadWeb() {
    loadItems();
    body.innerHTML += `
    <div id="dropdown">
        <div id="myModal" class="modal">
          <span class="close" onclick="closeModal()">&times;</span>
          <img class="modal-content" id="modalImg">
          <div id="caption"></div>
        </div>
        <select id="mySelect" onchange="changeBreed()">
            <option>Click a breed to see the photos</option>
        </select>
    </div>
    <div id="exhibitor">
    </div>`;
}

function loadItems() {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let dogsJson = xhr.response;
            loadDropDown(dogsJson);
        }
    };
    xhr.open("GET", "https://dog.ceo/api/breeds/list/all");
    xhr.send();
}

function changeBreed() {
    let breedName = document.querySelector("#mySelect").value;
    breedName = breedName.toLowerCase();
    loadBreedPhotos(breedName);
}

function loadDropDown(dogsJson) {
    let jsonKeys = Object.keys(dogsJson.message);
    let selectList = document.querySelector("#mySelect");
    for (let i = 0; i < jsonKeys.length; i++) {
        let currentBreedName = jsonKeys[i].slice(0, 1).toUpperCase() + jsonKeys[i].slice(1, jsonKeys[i].length);
        selectList.innerHTML += `<option onselect="changeBreed()" class="dropDownItem" id="item${i}">${currentBreedName}</option>`
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
    for (let i = 0; i < 100 && i < currentBreedJson.message.length; i++) {
        exhibitor.innerHTML += `<img class="dogPhoto" id="photo${i}" onclick="photoClick('${currentBreedJson.message[i]}')" src="${currentBreedJson.message[i]}">`;
    }
}

function photoClick(imgSrc) {
    let modal = document.getElementById("myModal");
    let modalImg = document.getElementById("modalImg");
    modal.style.display = "block";
    modalImg.src = imgSrc;
}

function closeModal() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
}