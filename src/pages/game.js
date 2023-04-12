const playButton = document.getElementById('playButton');
const optionsButton = document.getElementById('optionsButton');
const quitButton = document.getElementById('quitButton');

playButton.addEventListener('mouseover', () => {
    playButton.style.backgroundColor = '#006600';
});

optionsButton.addEventListener('mouseover', () => {
    optionsButton.style.backgroundColor = '#004080';
});

quitButton.addEventListener('mouseover', () => {
    quitButton.style.backgroundColor = '#800000';
});

playButton.addEventListener('mouseout', () => {
    playButton.style.backgroundColor = '#00b300';
});

optionsButton.addEventListener('mouseout', () => {
    optionsButton.style.backgroundColor = '#004080';
});

quitButton.addEventListener('mouseout', () => {
    quitButton.style.backgroundColor = '#800000';
});