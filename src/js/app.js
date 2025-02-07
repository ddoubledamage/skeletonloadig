import boo from '../assets/boo.png';
const cardContainer = document.querySelector('.container');
const cardData = [
    { description: 'Описание котика номер один'},
    { description: 'Описание котика номер два'},
    { description: 'Описание котика номер три'}
];

const renderCards = () => {
    cardData.forEach(data => {
        const card = document.createElement('div');
        card.classList.add('card');

        const cardImage = document.createElement('figcaption');
        cardImage.classList.add('card-image', 'loading');

        const cardDescription = document.createElement('p');
        cardDescription.classList.add('card-description', 'loading');

        card.appendChild(cardImage);
        card.appendChild(cardDescription);
        cardContainer.appendChild(card);

        setTimeout(() => {
            createImage(cardImage);
            cardDescription.textContent = data.description;

            [card, cardImage, cardDescription].forEach(el => el.classList.remove('loading'));
        }, 3000);

    })
}

    function createImage(cardImage) {
    const image = new Image();
    image.classList.add('image');
    image.setAttribute('alt', 'Тут картинка котика');
    image.setAttribute('src', boo);
    cardImage.appendChild(image);
    }

    renderCards();

    document.getElementById('refresh').addEventListener('click', () => {
        cardContainer.innerHTML = '';
        renderCards();
    },)


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker зарегистрирован с областью:', registration.scope);
            })
            .catch((error) => {
                console.error('Ошибка регистрации Service Worker:', error);
            });
    });
}



fetch('http://localhost:3000')
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Ошибка:', error));

