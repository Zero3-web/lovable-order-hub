
document.addEventListener('DOMContentLoaded', function() {
  // Admin password - in a real app, this would be handled securely on the server
  const ADMIN_PASSWORD = 'admin123';

  // DOM elements
  const loginScreen = document.getElementById('loginScreen');
  const adminDashboard = document.getElementById('adminDashboard');
  const loginForm = document.getElementById('loginForm');
  const ordersContainer = document.getElementById('ordersContainer');
  const logoutBtn = document.getElementById('logoutBtn');
  const paymentModal = document.getElementById('paymentModal');
  const paymentDetails = document.getElementById('paymentDetails');
  const paymentMethodSelect = document.getElementById('paymentMethod');
  const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
  const completeOrderBtn = document.getElementById('completeOrderBtn');

  // Current order being processed
  let currentOrder = null;

  // Check if already logged in
  const isLoggedIn = localStorage.getItem('spaAdminLoggedIn') === 'true';
  if (isLoggedIn) {
    showAdminDashboard();
  }

  // Check for new orders and simulate real-time updates
  function checkForNewOrders() {
    const newOrderData = localStorage.getItem('spaNewOrder');
    if (newOrderData) {
      const order = JSON.parse(newOrderData);
      
      // Add to orders list
      const ordersList = JSON.parse(localStorage.getItem('spaOrders') || '[]');
      ordersList.push(order);
      localStorage.setItem('spaOrders', JSON.stringify(ordersList));
      
      // Remove the new order flag
      localStorage.removeItem('spaNewOrder');
      
      // Update UI
      renderOrders();
    }
    
    // Check again after 2 seconds
    setTimeout(checkForNewOrders, 2000);
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const password = document.getElementById('password').value;
      
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem('spaAdminLoggedIn', 'true');
        showAdminDashboard();
      } else {
        alert('Contraseña incorrecta');
      }
    });
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('spaAdminLoggedIn');
      window.location.reload();
    });
  }

  // Show admin dashboard
  function showAdminDashboard() {
    if (loginScreen) loginScreen.classList.add('hidden');
    if (adminDashboard) adminDashboard.classList.remove('hidden');
    
    renderOrders();
    checkForNewOrders();
  }

  // Format date for display
  function formatDateDisplay(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }

  // Render orders list
  function renderOrders() {
    if (!ordersContainer) return;
    
    const orders = JSON.parse(localStorage.getItem('spaOrders') || '[]');
    
    if (orders.length === 0) {
      ordersContainer.innerHTML = '<div class="no-orders-message">No hay reservas registradas actualmente.</div>';
      return;
    }
    
    ordersContainer.innerHTML = '';
    
    orders.forEach((order, index) => {
      const orderCard = document.createElement('div');
      orderCard.className = 'order-card';
      
      const services = order.services.map(service => `
        <li>
          <span>${service.name}</span>
          <span>$${service.price}</span>
        </li>
      `).join('');
      
      orderCard.innerHTML = `
        <div class="order-header">
          <div class="order-title">
            <h3>Reserva #${order.orderNumber}</h3>
            <span class="customer-name">${order.customerName}</span>
          </div>
          <div class="order-time">
            <div class="date-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>${formatDateDisplay(order.appointmentDate)}</span>
            </div>
            <div class="date-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>${order.appointmentTime}</span>
            </div>
          </div>
        </div>
        
        <div class="order-details">
          <h4>Servicios</h4>
          <ul class="services-list">
            ${services}
          </ul>
          <div class="order-total">
            <span>Total</span>
            <span>$${order.totalAmount}</span>
          </div>
          <div class="order-duration">
            <span>Duración estimada:</span>
            <span>${order.totalDuration} minutos</span>
          </div>
        </div>
        
        <div class="order-actions">
          <button class="button secondary call-button" data-index="${index}">Llamar Cliente</button>
          <button class="button finish-button" data-index="${index}">Finalizar y Cobrar</button>
        </div>
      `;
      
      ordersContainer.appendChild(orderCard);
    });
    
    // Add event listeners to buttons
    const callButtons = document.querySelectorAll('.call-button');
    const finishButtons = document.querySelectorAll('.finish-button');
    
    callButtons.forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        const orders = JSON.parse(localStorage.getItem('spaOrders') || '[]');
        alert(`Llamando a ${orders[index].customerName}`);
      });
    });
    
    finishButtons.forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        const orders = JSON.parse(localStorage.getItem('spaOrders') || '[]');
        showPaymentModal(orders[index], index);
      });
    });
  }

  // Show payment modal
  function showPaymentModal(order, index) {
    if (!paymentModal || !paymentDetails) return;
    
    currentOrder = { order, index };
    
    const services = order.services.map(service => `
      <li>
        <span>${service.name}</span>
        <span>$${service.price}</span>
      </li>
    `).join('');
    
    paymentDetails.innerHTML = `
      <div class="payment-order-info">
        <p>Cliente: <strong>${order.customerName}</strong></p>
        <p>Número de orden: <strong>#${order.orderNumber}</strong></p>
        <p>Fecha: <strong>${formatDateDisplay(order.appointmentDate)}</strong></p>
        <p>Hora: <strong>${order.appointmentTime}</strong></p>
      </div>
      <div class="payment-services">
        <h4>Servicios</h4>
        <ul class="services-list">
          ${services}
        </ul>
      </div>
      <div class="payment-total">
        <span>Total a cobrar:</span>
        <span>$${order.totalAmount}</span>
      </div>
    `;
    
    paymentMethodSelect.value = '';
    paymentModal.classList.add('visible');
  }

  // Cancel payment button
  if (cancelPaymentBtn) {
    cancelPaymentBtn.addEventListener('click', function() {
      paymentModal.classList.remove('visible');
      currentOrder = null;
    });
  }

  // Complete order button
  if (completeOrderBtn) {
    completeOrderBtn.addEventListener('click', function() {
      if (!currentOrder) return;
      
      const paymentMethod = paymentMethodSelect.value;
      
      if (!paymentMethod) {
        alert('Por favor, selecciona un método de pago');
        return;
      }
      
      // Get orders from storage
      const orders = JSON.parse(localStorage.getItem('spaOrders') || '[]');
      
      // Remove the completed order
      orders.splice(currentOrder.index, 1);
      
      // Save back to storage
      localStorage.setItem('spaOrders', JSON.stringify(orders));
      
      // Add to completed orders history
      const completedOrder = {
        ...currentOrder.order,
        paymentMethod,
        completedAt: new Date().toISOString()
      };
      
      const completedOrders = JSON.parse(localStorage.getItem('spaCompletedOrders') || '[]');
      completedOrders.push(completedOrder);
      localStorage.setItem('spaCompletedOrders', JSON.stringify(completedOrders));
      
      // Close modal and refresh list
      paymentModal.classList.remove('visible');
      currentOrder = null;
      renderOrders();
      
      // Show success message
      alert('Orden finalizada y cobrada correctamente');
    });
  }
});
