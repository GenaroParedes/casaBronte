// Verificar si el usuario es admin
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
    }
    
    // Inicializar las secciones
    mostrarProductos();
    cargarVentas();
    cargarUsuarios();
});

// Función para mostrar diferentes secciones del panel
function showSection(sectionId) {
    // Ocultar todas las secciones
    ['productos', 'ventas', 'usuarios'].forEach(section => {
        document.getElementById(section).style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionId).style.display = 'block';
}

// Productos
let productos = JSON.parse(localStorage.getItem('productos')) || [];

function agregarProducto() {
    const nombre = document.getElementById('producto-nombre').value;
    const descripcion = document.getElementById('producto-descripcion').value;
    const precio = document.getElementById('producto-precio').value;
    const imagen = document.getElementById('producto-imagen').files[0];

    if (imagen) {
        const reader = new FileReader();
        reader.onloadend = function() {
            const producto = {
                id: Date.now(),
                name: nombre,
                description: descripcion,
                price: parseFloat(precio),
                image: reader.result
            };

            productos.push(producto);
            localStorage.setItem('productos', JSON.stringify(productos));
            mostrarProductos();
            limpiarFormulario();
        }
        reader.readAsDataURL(imagen);
    }
}

function mostrarProductos() {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';

    productos.forEach(producto => {
        const productoCard = document.createElement('div');
        productoCard.classList.add('product-card');
        productoCard.innerHTML = `
            <img src="${producto.image}" alt="${producto.name}">
            <h3>${producto.name}</h3>
            <p>${producto.description}</p>
            <p>$${producto.price.toFixed(2)}</p>
            <button class="btn" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            <button class="btn" onclick="editarProducto(${producto.id})">Editar</button>
        `;
        listaProductos.appendChild(productoCard);
    });
}

function eliminarProducto(id) {
    if(confirm('¿Está seguro de eliminar este producto?')) {
        productos = productos.filter(p => p.id !== id);
        localStorage.setItem('productos', JSON.stringify(productos));
        mostrarProductos();
    }
}

function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        document.getElementById('producto-nombre').value = producto.name;
        document.getElementById('producto-descripcion').value = producto.description;
        document.getElementById('producto-precio').value = producto.price;
        
        // Cambiar el botón de agregar a actualizar
        const botonAgregar = document.querySelector('#producto-form button');
        botonAgregar.textContent = 'Actualizar Producto';
        botonAgregar.onclick = function() {
            actualizarProducto(id);
        };
    }
}

function actualizarProducto(id) {
    const nombre = document.getElementById('producto-nombre').value;
    const descripcion = document.getElementById('producto-descripcion').value;
    const precio = document.getElementById('producto-precio').value;
    const imagen = document.getElementById('producto-imagen').files[0];

    const indice = productos.findIndex(p => p.id === id);
    if (indice !== -1) {
        if (imagen) {
            const reader = new FileReader();
            reader.onloadend = function() {
                productos[indice] = {
                    id: id,
                    name: nombre,
                    description: descripcion,
                    price: parseFloat(precio),
                    image: reader.result
                };
                localStorage.setItem('productos', JSON.stringify(productos));
                mostrarProductos();
                limpiarFormulario();
                
                // Restaurar el botón a su estado original
                const botonAgregar = document.querySelector('#producto-form button');
                botonAgregar.textContent = 'Agregar Producto';
                botonAgregar.onclick = agregarProducto;
            }
            reader.readAsDataURL(imagen);
        } else {
            // Si no se sube nueva imagen, mantener la imagen anterior
            productos[indice] = {
                id: id,
                name: nombre,
                description: descripcion,
                price: parseFloat(precio),
                image: productos[indice].image
            };
            localStorage.setItem('productos', JSON.stringify(productos));
            mostrarProductos();
            limpiarFormulario();
            
            // Restaurar el botón a su estado original
            const botonAgregar = document.querySelector('#producto-form button');
            botonAgregar.textContent = 'Agregar Producto';
            botonAgregar.onclick = agregarProducto;
        }
    }
}

function limpiarFormulario() {
    document.getElementById('producto-nombre').value = '';
    document.getElementById('producto-descripcion').value = '';
    document.getElementById('producto-precio').value = '';
    document.getElementById('producto-imagen').value = '';
}

// Gestión de Ventas
function cargarVentas() {
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    const tablaVentas = document.getElementById('tabla-ventas');
    
    tablaVentas.innerHTML = `
        <thead>
            <tr>
                <th>ID Venta</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            ${ventas.map(venta => `
                <tr>
                    <td>${venta.id}</td>
                    <td>${new Date(venta.fecha).toLocaleDateString()}</td>
                    <td>$${venta.total.toFixed(2)}</td>
                    <td>${venta.estado}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

// Gestión de Usuarios
function cargarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const tablaUsuarios = document.getElementById('tabla-usuarios');
    
    tablaUsuarios.innerHTML = `
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            ${usuarios.map(usuario => `
                <tr>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.role}</td>
                    <td>
                        <button class="btn" onclick="cambiarRolUsuario('${usuario.email}')">Cambiar Rol</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
}

function cambiarRolUsuario(email) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioIndex = usuarios.findIndex(u => u.email === email);
    
    if (usuarioIndex !== -1) {
        usuarios[usuarioIndex].role = usuarios[usuarioIndex].role === 'admin' ? 'user' : 'admin';
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        cargarUsuarios();
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}