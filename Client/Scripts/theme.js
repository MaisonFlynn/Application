async function theme() {
    const username = localStorage.getItem('username');
    if (!username) return;

    try {
        const response = await fetch('/shop/theme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        if (!response.ok) {
            throw new Error('Failure TO Fetch Theme');
        }

        const data = await response.json();
        if (data.theme) {
            document.body.style.backgroundColor = data.theme;
        }
    } catch (error) {
        console.error('Error Fetching Theme:', error);
    }
}

theme();