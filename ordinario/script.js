let userList = document.querySelector('#userList');

loadUsers();

function loadUsers() {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            userList.innerHTML = '';
            let userJson = xhr.response;
            showUsers(userJson);
        }
    };
    xhr.open("GET", "https://randomuser.me/api/?results=3");
    xhr.send();
}

function showUsers(userJson) {
    for (let i = 0; i < 3; i++) {
        userList.innerHTML += `<li class="userChart">
    <div class="userPhoto">
        <img src="${userJson.results[i].picture.large}">
    </div>
    <div class="userText">
        <div class="userContact">
            <span class="userName">${capitalizeFirstLetter(userJson.results[i].name.title)} ${capitalizeFirstLetter(userJson.results[i].name.first)} ${capitalizeFirstLetter(userJson.results[i].name.last)}</span>
            <div class="iconWithText"><i class="fas fa-envelope"></i><span
                    class="userEmail">${userJson.results[i].email}</span></div>
            <div class="iconWithText"><i class="fab fa-twitter"></i><span class="userTwitter">@${userJson.results[i].login.username}</span></div>
            <button class="likeButton" id="button${i}" onclick="changeLikeButton('button${i}')">Like</button>
        </div>
        <div class="userInfo">

            <div class="iconWithText"><i class="fas fa-birthday-cake"></i><span class="userBirthday">${userJson.results[i].dob.date.slice(0, 10)}</span>
            </div>
            <div class="iconWithText"><i class="fas fa-phone"></i><span class="userPhone">${userJson.results[i].cell}</span></div>
            <div class="iconWithText"><i class="fas fa-map-marker-alt"></i><span class="userLocation"><span>${userJson.results[i].location.street.number} ${userJson.results[i].location.street.name}</span><span>${userJson.results[i].location.city}</span><span>${userJson.results[i].location.postcode} ${userJson.results[i].location.country}</span></span>
            </div>
        </div>
    </div>
</li>`;
    }
}

function changeLikeButton(buttonId) {
    console.log(buttonId);
    let buttonClass = document.querySelector(`#${buttonId}`);
    console.log(buttonClass);
    switch (buttonClass.className) {
        case 'likeButton':
            buttonClass.className = 'dislikeButton';
            buttonClass.innerHTML = 'Dislike';
            break;
        case 'dislikeButton':
            buttonClass.className = 'likeButton';
            buttonClass.innerHTML = 'Like';
            break;
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}