const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');

yesButton.addEventListener('mouseover', () => {
    yesButton.style.backgroundColor = '#800000';
});

noButton.addEventListener('mouseover', () => {
    noButton.style.backgroundColor = '#004080';
});

yesButton.addEventListener('mouseout', () => {
    yesButton.style.backgroundColor = '#800000';
});

noButton.addEventListener('mouseout', () => {
    noButton.style.backgroundColor = '#004080';
});