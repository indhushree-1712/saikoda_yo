function showLogin() {
    document.getElementById('login-form').classList.add('active');
    document.getElementById('signup-form').classList.remove('active');
}

function showSignup() {
    document.getElementById('signup-form').classList.add('active');
    document.getElementById('login-form').classList.remove('active');
}
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('error') === 'invalid') {
    alert('Invalid Credentials. Please try again.');
}

const signupSuccess = new URLSearchParams(window.location.search).get('signup');
if (signupSuccess === 'success') {
    alert('Signup successful! Please log in.');
    showLogin(); // Show the login form
}


function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('username', data.username);
                window.location.href = 'home.html';
            } else {
                alert(data.error);
            }
        });
}