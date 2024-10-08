document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    const menuSelect = document.getElementById('menu-select');
    const cantidadInput = document.getElementById('cantidad');
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const fechaInput = document.getElementById('fecha');
    const agregarPedidoBtn = document.getElementById('agregar-pedido');
    const listaPedidos = document.getElementById('lista-pedidos');
    const totalPedido = document.getElementById('total-pedido');
    const enviarWhatsappBtn = document.getElementById('enviar-whatsapp');

    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const precios = {
        'Canapé': 1000,
        'Empanadas': 1000,
        'Sándwiches': 1000,
        'Pizzetas': 1000
    };

    function toggleMenu() {
        navLinks.classList.toggle('active');
        burger.classList.toggle('active');
        menuIcon.style.display = navLinks.classList.contains('active') ? 'none' : 'inline-block';
        closeIcon.style.display = navLinks.classList.contains('active') ? 'inline-block' : 'none';
    }

    burger.addEventListener('click', toggleMenu);

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    function actualizarTotal() {
        const total = pedidos.reduce((sum, pedido) => sum + pedido.precio * pedido.cantidad, 0);
        totalPedido.textContent = `Total: $${total}`;
    }

    function guardarPedidos() {
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
    }

    function renderizarPedidos() {
        listaPedidos.innerHTML = '';
        pedidos.forEach((pedido, index) => {
            const li = document.createElement('li');
            li.className = 'pedido-item';
            li.innerHTML = `
                <span>${pedido.menu} - Cantidad: ${pedido.cantidad} - $${pedido.precio * pedido.cantidad}</span>
                <button class="eliminar-pedido" data-index="${index}">🗑️</button>
            `;
            listaPedidos.appendChild(li);
        });
        actualizarTotal();
    }

    agregarPedidoBtn.addEventListener('click', () => {
        const menu = menuSelect.value;
        const cantidad = parseInt(cantidadInput.value);
        if (menu && cantidad > 0) {
            pedidos.push({
                menu,
                cantidad,
                precio: precios[menu]
            });
            guardarPedidos();
            renderizarPedidos();
            menuSelect.value = '';
            cantidadInput.value = '1';
        }
    });

    listaPedidos.addEventListener('click', (e) => {
        if (e.target.classList.contains('eliminar-pedido')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            pedidos.splice(index, 1);
            guardarPedidos();
            renderizarPedidos();
        }
    });

    enviarWhatsappBtn.addEventListener('click', () => {
        const nombre = nombreInput.value;
        const apellido = apellidoInput.value;
        const fecha = fechaInput.value;
        
        if (!nombre || !apellido || !fecha || pedidos.length === 0) {
            alert('Por favor, complete todos los campos y agregue al menos un pedido.');
            return;
        }

        let mensaje = `Nuevo Pedido de: ${nombre} ${apellido} para el ${fecha}%0A`;
        pedidos.forEach(pedido => {
            mensaje += `${pedido.cantidad} ${pedido.menu}%0A`;
        });

        const whatsappUrl = `https://wa.me/543364330643?text=${mensaje}`;
        window.open(whatsappUrl, '_blank');
    });

    // Cargar pedidos guardados al iniciar
    renderizarPedidos();
});