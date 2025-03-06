document.getElementById('formulario-contacto').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const mensaje = document.getElementById('mensaje').value;

    // Guardar mensaje en localStorage
    const contactos = JSON.parse(localStorage.getItem('contactos')) || [];
    const nuevoContacto = {
        id: Date.now(),
        nombre,
        email,
        telefono,
        mensaje,
        fecha: new Date().toISOString()
    };

    contactos.push(nuevoContacto);
    localStorage.setItem('contactos', JSON.stringify(contactos));

    // Mostrar mensaje de confirmación
    document.getElementById('mensaje-enviado').style.display = 'block';

    // Limpiar formulario
    this.reset();

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        document.getElementById('mensaje-enviado').style.display = 'none';
    }, 3000);
});