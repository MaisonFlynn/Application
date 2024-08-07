document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', async () => {
        const item = card.id;
        const username = localStorage.getItem('username');

        try {
            const response = await fetch('/shop/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, item })
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error === 'Brokie') {
                    // Trigger shake animation
                    card.classList.add('shake');
                    setTimeout(() => card.classList.remove('shake'), 500);
                }
                throw new Error('Purchase Failed');
            }

            const data = await response.json();
            document.body.style.backgroundColor = data.theme;
            document.getElementById('coins').innerText = `🪙 ${data.coins}`;
        } catch (error) {
            console.error(error);
        }
    });
});
