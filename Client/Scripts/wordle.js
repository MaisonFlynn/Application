document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const guess = document.getElementById('guess');
    const submit = document.getElementById('submit');
    const message = document.getElementById('message');

    let count = 0; // Count Guess
    const cap = 6; // 6 Guess

    // Draw the empty board with 6 rows and 5 columns
    function draw() {
        for (let i = 0; i < cap; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            for (let j = 0; j < 5; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                row.appendChild(cell);
            }
            board.appendChild(row);
        }
    }

    draw(); 

    submit.addEventListener('click', guesstimate);
    guess.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            guesstimate();
        }
    });

    async function guesstimate() {
        if (count >= cap) {
            message.textContent = "Guessless";
            return;
        }

        const value = guess.value.trim().toLowerCase();
        if (value.length !== 5) {
            message.textContent = '$5 Footlong';
            return;
        }

        try {
            const sessionToken = localStorage.getItem('sessionToken');

            if (!sessionToken) {
                message.textContent = 'NO Session Token';
                return;
            }

            const response = await fetch('/wordle/guess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'sessionToken': sessionToken
                },
                body: JSON.stringify({ guess: value }),
            });

            const data = await response.json();

            if (data.error) {
                message.textContent = data.error;
                return;
            }

            facelift(value, data.result, count);
            count++;

            if (data.result.every(letter => letter.status === 'correct')) {
                message.textContent = "+ 5 🪙's";
                message.classList.add('win');
                disable();
            } else if (count >= cap) {
                message.textContent = `Better Luck Tomorrow :P`;
                disable();
            } else {
                guess.value = '';
                guess.focus();
            }
        } catch (error) {
            console.error('Error:', error);
            message.textContent = 'Wordle Hurdle XD';
        }
    }

    function facelift(value, result, index) {
        const row = board.children[index];
        const cells = row.children;

        result.forEach((result, i) => {
            cells[i].textContent = value[i];
            cells[i].classList.add(result.status);
        });
    }

    function disable() {
        guess.disabled = true;
        submit.disabled = true;
    }
});