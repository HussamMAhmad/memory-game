let yourName;
document.querySelector('.control-buttons span').onclick = function () {
    yourName = prompt('Whats your name');
    if (yourName === null || yourName === "") {
        document.querySelector('.name span').innerHTML = "Unkonwn";
    } else {
        document.querySelector('.name span').innerHTML = yourName;
    }
    document.querySelector('.control-buttons').remove();
    document.getElementById('background').play();
    document.getElementById('background').loop = true;
    countdown();
};
let finalTime;
let results = document.querySelector('.results');
let timer = document.querySelector('.timer');
let blocksContainer = document.querySelector('.memory-game-block');
let tries = document.querySelector('.tries span');
let duration = 1000;
let blocks = Array.from(blocksContainer.children);
let rangeOrder = Array.from(blocks.keys());
let randomArr = shufle(rangeOrder);
blocks.forEach((block, index) => {
    block.style.order = randomArr[index];
    block.addEventListener('click', function () {
        fliped(block);
    })
});
function fliped(el) {
    el.classList.add('is-flip');
    let allFilpedBlocks = blocks.filter(block => block.classList.contains('is-flip'));
    if (allFilpedBlocks.length === 2) {
        stopClicking();
        checkMatchBlocks(allFilpedBlocks[0], allFilpedBlocks[1]);
    }
}
function stopClicking() {
    blocksContainer.classList.add('no-click');
    setTimeout(() => {
        blocksContainer.classList.remove('no-click');
    }, duration);
}
function checkMatchBlocks(firstBlock, secondBlock) {
    if (firstBlock.dataset.games === secondBlock.dataset.games) {
        firstBlock.classList.remove('is-flip');
        secondBlock.classList.remove('is-flip');
        firstBlock.classList.add('has-match');
        secondBlock.classList.add('has-match');
        document.getElementById('success').play();
    } else {
        tries.innerHTML = parseInt(tries.innerHTML) + 1;
        document.getElementById('fail').play();
        setTimeout(() => {
            firstBlock.classList.remove('is-flip');
            secondBlock.classList.remove('is-flip');
        }, duration);
    }
}
function shufle(array) {
    let current = array.length, random, temp;
    while (current > 0) {
        random = Math.floor(Math.random() * current);
        current--;
        temp = array[current];
        array[current] = array[random];
        array[random] = temp;
    }
    return array;
};
function countdown() {
    let time = 120;
    let counter = setInterval(() => {
        let minutes = parseInt(time / 60);
        let seconds = parseInt(time % 60);
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        timer.innerHTML = `${minutes} : ${seconds}`;
        if (--time < 0) {
            clearInterval(counter);
            popupFaild();
            document.getElementById('background').pause();
            document.getElementById('game-over').play();
            blocksContainer.classList.add('no-click');
        }
        let allHasMatch = blocks.filter(block => block.classList.contains('has-match'));
        if (allHasMatch.length === blocks.length) {
            clearInterval(counter);
            document.getElementById('background').pause();
            document.getElementById('game-win').play();
            popUpWin();
            finalTime = getThetime(120 - time);
            getResult();
        }
    }, 1000)
};
function popupFaild() {
    let maindiv = document.createElement('div');
    maindiv.className = 'pop-fail';

    let div = document.createElement('div');
    div.className = 'pop';
    maindiv.appendChild(div);

    let p = document.createElement('p');
    let pText = document.createTextNode('Game Over fool');
    p.appendChild(pText);

    let span = document.createElement('span');
    let spanText = document.createTextNode('Restart');
    span.appendChild(spanText);

    div.appendChild(p);
    div.appendChild(span);
    document.body.appendChild(maindiv);
}
document.addEventListener('click', (e) => {
    if (e.target === document.querySelector('.pop-fail span') || e.target === document.querySelector('.pop-win span')) {
        location.reload();
    }
    if(e.target === document.querySelector('.delete')){
        let user = JSON.parse(window.localStorage.getItem('users'));
        for(let i = 0 ; i < user.length ; i++){
            if(user[i].id === parseInt(e.target.parentElement.id)){
                user.splice(i , 1); 
                document.getElementById(`${i}`).remove();
                window.localStorage.setItem('users',JSON.stringify(user)); 
            }
        }
    }
});
function popUpWin() {
    let maindiv = document.createElement('div');
    maindiv.className = 'pop-win';

    let div = document.createElement('div');
    div.className = 'pop';
    maindiv.appendChild(div);

    let p = document.createElement('p');
    let pText = document.createTextNode('You Win but you Still fool');
    p.appendChild(pText);

    let span = document.createElement('span');
    let spanText = document.createTextNode('Restart');
    span.appendChild(spanText);

    div.appendChild(p);
    div.appendChild(span);
    document.body.appendChild(maindiv);
}
function showResults() {
    if(window.localStorage.getItem('users')){
        let usersLenght = JSON.parse(window.localStorage.getItem('users')).length;
        let user =  JSON.parse(window.localStorage.getItem('users'));
        for(let i = 0 ; i < usersLenght ; i++){
            let div = document.createElement('div'); // create the result in body
            div.className = 'name';
            div.setAttribute('id' , i); 
            let spanName = document.createElement('span'); // for name 
            let spanTime = document.createElement('span');
            let spanTries = document.createElement('span');
            let del = document.createElement('span');
            del.className = 'delete';
            let spanNameT = document.createTextNode(user[i].name);
            let spanTimeT = document.createTextNode(user[i].time);
            let spanTriesT = document.createTextNode(user[i].tries);
            let delT = document.createTextNode('Delete');
            spanName.appendChild(spanNameT);
            spanTime.appendChild(spanTimeT);
            spanTries.appendChild(spanTriesT);
            del.appendChild(delT);
            div.appendChild(spanName);
            div.appendChild(spanTime);
            div.appendChild(spanTries);
            div.appendChild(del);
            results.appendChild(div);
        }
    }
}
function getThetime(time) {
    let minutes = parseInt(time / 60);
    let seconds = parseInt(time % 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    time = `${minutes} : ${seconds}`;
    return time;
};
function getResult() {
    let id = 0 ; 
    let data = window.localStorage.getItem('users');
    let users = data ? JSON.parse(data) : [];
    users.length === 0 ? id = 0 : id = (users[users.length - 1].id) + 1 ; 
    let user = {
        name: yourName == "" ? yourName = "Unknown" : yourName,
        time: finalTime,
        tries: tries.innerHTML,
        id : id , 
    };
    users.push(user);
    window.localStorage.setItem('users', JSON.stringify(users));
};
showResults(); 
