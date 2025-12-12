document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = 'Login successful! ✓';
            messageDiv.style.display = 'block';
            
            localStorage.setItem('token', data.token);
            
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = data.error || 'Login failed!';
            messageDiv.style.display = 'block';
        }
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Connection error!';
        messageDiv.style.display = 'block';
    }
});