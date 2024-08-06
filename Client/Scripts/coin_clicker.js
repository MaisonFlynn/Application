document.addEventListener('DOMContentLoaded', () => {
    const coin = document.getElementById('coin');
    const display = document.getElementById('count');
    const pop = new Audio('../../Sounds/Pop.mp3');
    let count = 0;

    coin.addEventListener('click', () => {
        // Increase Coin
        count++;
        display.textContent = count;

        // Play Pop Sound
        pop.currentTime = 0; // Reset Sound
        pop.play();

        // Shrink
        coin.classList.add('shrink');

        // Remove Shrink AFTER Animation
        coin.addEventListener('animationend', () => {
            coin.classList.remove('shrink');
        }, { once: true });
    });
});
