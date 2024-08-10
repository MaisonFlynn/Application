function showRegisterForm() {
    const flip = document.getElementById('auth');
    if (!flip.style.transform.includes("180deg")) {
        flip.style.transform = "translateX(-100%) rotateY(180deg)";
    }
}

function showLoginForm() {
    const flip = document.getElementById('auth');
    if (flip.style.transform.includes("180deg")) {
        flip.style.transform = "translateX(0%) rotateY(0deg)";
    }
}

function togglePassword(inputID) {
    const input = document.getElementById(inputID);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Check FOR UNSAFE Character(s)
function sanitize(input) {
    const regex = /^[a-zA-Z0-9\s@.]*$/;
    return regex.test(input);
}

function validateUsername(username) {
    const regex = /^(?! )[A-Za-z\d](?!.*  )(?!.* $)[A-Za-z\d ]{2,}[A-Za-z\d]$/;
    return regex.test(username);
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(email).toLowerCase());
}

function validatePassword(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
}

async function exists(email, username) {
    try {
        const response = await fetch('/auth/exists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username })
        });
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error('Existing Error:', error);
        return false;
    }
}

async function register(event) {
    event.preventDefault();

    // Clear Message(s)
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('usernameError').textContent = '';
    document.getElementById('registerSuccess').textContent = '';

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    // Validate & Sanitize Input(s)
    if (!validateUsername(username) || !sanitize(username)) {
        document.getElementById('usernameError').textContent = 'Invalid Username';
        return;
    }

    if (!validateEmail(email) || !sanitize(email)) {
        document.getElementById('emailError').textContent = 'Invalid Email';
        return;
    }

    if (!validatePassword(password) || !sanitize(password)) {
        document.getElementById('passwordError').textContent = 'Invalid Password';
        return;
    }

    const userExists = await exists(email, username);
    if (userExists) {
        document.getElementById('usernameError').textContent = 'Username OR Email Exists';
        return;
    }

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    console.log('Register Response:', data);
    
    if (response.ok) {
        document.getElementById('registerSuccess').textContent = 'Verification Email SENT';
    } else if (response.status === 500 && data.error === 'Email NOT Sent') {
        document.getElementById('registerError').textContent = 'Email NOT Sent';
    } else {
        console.error(data.error);
    }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function login(event) {
    event.preventDefault();

    // Clear Message(s)
    document.getElementById('loginError').textContent = '';
    document.getElementById('loginSuccess').textContent = '';

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Sanitize Input(s)
    if (!sanitize(username) || !sanitize(password)) {
        document.getElementById('loginError').textContent = 'Unsanitary Input(s)';
        return;
    }

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            // Save Token(s) & Username
            localStorage.setItem('token', data.token);
            localStorage.setItem('sessionToken', data.sessionToken);
            localStorage.setItem('username', username);
            document.getElementById('loginSuccess').textContent = 'Logging IN';
            window.location.href = '/Pages/home.html';
        } else if (response.status === 400 && data.error === 'User Logged IN') {
            document.getElementById('loginError').textContent = 'User Logged IN';
        } else {
            console.error(data.error);
            document.getElementById('loginError').textContent = 'Invalid Credential(s)';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function verifyEmail(token) {
    try {
        const response = await fetch(`/auth/verify?token=${token}`);
        const data = await response.json();
        const loginError = document.getElementById('loginError');
        const loginSuccess = document.getElementById('loginSuccess');
        
        if (response.ok) {
            loginSuccess.textContent = 'Verification Successful';
        } else {
            loginError.textContent = data.error;
        }
    } catch (error) {
        loginError.textContent = error;
    }
}

// Check IF Token IN URL
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
if (token) {
    verifyEmail(token);
}

function forgot() {
    window.location.href = 'Pages/forgot.html'
}