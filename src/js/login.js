function toggleForm(type) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    if (type === 'login') {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
        loginError.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
        registerError.style.display = 'none';
    }
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const role = document.querySelector('input[name="login-role"]:checked').value;
    const loginError = document.getElementById('login-error');

    const user = users.find(u => 
        u.email === email && 
        u.password === password && 
        u.role === role
    );

    if (user) {
        // Guardar usuario en localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirigir según el rol
        if (role === 'admin') {
            window.location.href = '../../admin.html';
        } else {
            window.location.href = '../../index.html';
        }
    } else {
        loginError.textContent = 'Credenciales incorrectas';
        loginError.style.display = 'block';
    }
}

function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const registerError = document.getElementById('register-error');

    // Validaciones básicas
    if (password !== confirmPassword) {
        registerError.textContent = 'Las contraseñas no coinciden';
        registerError.style.display = 'block';
        return;
    }

    // Verificar si el email ya existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        registerError.textContent = 'El correo ya está registrado';
        registerError.style.display = 'block';
        return;
    }

    // Crear nuevo usuario
    const newUser = {
        name,
        email,
        password,
        role: 'user'  // Por defecto, nuevo registro es usuario
    };

    users.push(newUser);
    
    // Guardar usuario en localStorage
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Redirigir a página principal
    window.location.href = 'index.html';
}

