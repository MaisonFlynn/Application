// Allow Redirect(s) WITHOUT Logging OUT
let navigating = false;

// Verify Logged IN
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const sessionToken = localStorage.getItem('sessionToken');
    if (!token || !sessionToken) {
        window.location.href = '../../index.html';
    } else {
        // Verify Session Token w/ Server
        try {
            const response = await fetch('/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionToken })
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('Token Verification Error:', data.error);
                window.location.href = '../../index.html';
            } else {
                // Fetch & Display User Detail(s)
                const userResponse = await fetch('/auth/profile', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const userData = await userResponse.json();
                if (userResponse.ok) {
                    document.getElementById('username').textContent = userData.user.username;
                    document.getElementById('coins').textContent = `🪙 ${userData.user.coins}`;
                } else {
                    console.error('Profile Error', userData.error);
                }
            }
        } catch (error) {
            console.error('Token Verification Error:', error);
            window.location.href = '../../index.html';
        }
    }
});

async function logout() {
    const sessionToken = localStorage.getItem('sessionToken');
    const overlay = document.getElementById('overlay');
    const confirmation = document.getElementById('confirmation');
    const confirm = document.getElementById('confirm');
    const cancel = document.getElementById('cancel');
    const profile = document.getElementById('profile');

    // Hide Profile
    profile.style.display = 'none';

    // Show Confirmation
    confirmation.style.display = 'block';
    overlay.style.display = 'block';

    // Confirm Logout
    confirm.onclick = async function() {
        if (!sessionToken) {
            console.error('NO Session Token Found');
            return;
        }

        try {
            const response = await fetch('/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionToken })
            });
            if (response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('sessionToken');
                window.location.href = '../../index.html';
            } else {
                console.error('Logout Error');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Cancel Logout
    cancel.onclick = function() {
        confirmation.style.display = 'none';
        overlay.style.display = 'none';
    };
}

// Logout ON Window OR Tab Close
window.addEventListener('beforeunload', () => {
    if (!navigating) {
        const sessionToken = localStorage.getItem('sessionToken');
        if (sessionToken) {
            const data = JSON.stringify({ sessionToken });
            const blob = new Blob([data], { type: 'application/json' });
            navigator.sendBeacon('/auth/logout', blob);
        } else {
            console.log('No Session Token');
        }
    }
});

function profile() {
    const profile = document.getElementById('profile');
    const overlay = document.getElementById('overlay');
    if (profile.style.display === 'none' || profile.style.display === '') {
        profile.style.display = 'flex';
        overlay.style.display = 'block';
    } else {
        profile.style.display = 'none';
        overlay.style.display = 'none';
    }
}

function shop() {
    navigating = true;
    window.location.href = '../shop.html';
}

function home() {
    navigating = true;
    window.location.href = '../home.html';
}
