
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const loginScreen = document.getElementById('loginScreen');
  const adminDashboard = document.getElementById('adminDashboard');
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const ordersContainer = document.getElementById('ordersContainer');
  const paymentModal = document.getElementById('paymentModal');
  const paymentDetails = document.getElementById('paymentDetails');
  const paymentMethod = document.getElementById('paymentMethod');
  const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
  const completeOrderBtn = document.getElementById('completeOrderBtn');
  
  // Simple admin password (in a real app this would be secured properly)
  const ADMIN_PASSWORD = 'admin123';
  
  // Mock data for orders (in a real app this would come from a server)
  let orders = [];

  // Check if the user is already logged in
  const isLoggedIn = localStorage.getItem('spaAdminLoggedIn') === 'true';
  if (isLoggedIn) {
    showAdminDashboard();
  }
  
  // Handle login form submission
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
  
  // Handle logout
  logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('spaAdminLoggedIn');
    showLoginScreen();
  });
  
  // Show admin dashboard
  function showAdminDashboard() {
    loginScreen.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    loadOrders();
  }
  
  // Show login screen
  function showLoginScreen() {
    adminDashboard.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    loginForm.reset();
  }
  
  // Load orders from localStorage or create some samples
  function loadOrders() {
    const storedOrders = localStorage.getItem('spaOrders');
    
    if (storedOrders) {
      orders = JSON.parse(storedOrders);
    } else {
      // Sample orders for demonstration
      orders = [
        {
          id: generateOrderId(),
          number: 1234,
          customerName: 'Ana García',
          services: [
            { name: 'Masaje Relajante', price: 50, duration: 60 },
            { name: 'Facial Hidratante', price: 35, duration: 45 }
          ],
          totalAmount: 85,
          totalDuration: 105,
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: generateOrderId(),
          number: 1235,
          customerName: 'Carlos Rodríguez',
          services: [
            { name: 'Manicura Spa', price: 20, duration: 30 },
            { name: 'Pedicura Spa', price: 25, duration: 40 }
          ],
          totalAmount: 45,
          totalDuration: 70,
          status: 'in-progress',
          createdAt: new Date().toISOString()
        }
      ];
      saveOrders();
    }
    
    renderOrders();
  }
  
  // Render orders in the dashboard
  function renderOrders() {
    if (orders.length === 0) {
      ordersContainer.innerHTML = '<div class="no-orders-message">No hay reservas registradas actualmente.</div>';
      return;
    }
    
    ordersContainer.innerHTML = '';
    
    orders.forEach(order => {
      const card = document.createElement('div');
      card.className = `order-card status-${order.status}`;
      card.dataset.id = order.id;
      
      const statusText = getStatusText(order.status);
      
      let servicesHTML = '';
      order.services.forEach(service => {
        servicesHTML += `
          <div class="service-item-admin">
            <span>${service.name}</span>
            <span>$${service.price}</span>
          </div>
        `;
      });
      
      card.innerHTML = `
        <div class="order-header">
          <span class="order-number">Reserva #${order.number}</span>
          <span class="order-status status-${order.status}">${statusText}</span>
        </div>
        <div class="order-client">Cliente: ${order.customerName || 'Sin nombre'}</div>
        <div class="order-services">
          ${servicesHTML}
        </div>
        <div class="order-total">
          <span>Total</span>
          <span>$${order.totalAmount} (${order.totalDuration} min)</span>
        </div>
        <div class="order-action-buttons">
          ${getActionButtons(order.status, order.id)}
        </div>
      `;
      
      ordersContainer.appendChild(card);
    });
    
    // Add event listeners to buttons
    addOrderActionListeners();
  }
  
  // Get the appropriate action buttons based on order status
  function getActionButtons(status, orderId) {
    switch(status) {
      case 'pending':
        return `<button class="button small start-button" data-id="${orderId}">Iniciar</button>`;
      case 'in-progress':
        return `<button class="button small complete-button" data-id="${orderId}">Completar</button>`;
      case 'completed':
        return `<button class="button small payment-button" data-id="${orderId}">Cobrar</button>
                <button class="button small secondary delete-button" data-id="${orderId}">Eliminar</button>`;
      default:
        return '';
    }
  }
  
  // Get status text
  function getStatusText(status) {
    switch(status) {
      case 'pending': return 'Pendiente';
      case 'in-progress': return 'En proceso';
      case 'completed': return 'Completado';
      default: return '';
    }
  }
  
  // Add event listeners to order action buttons
  function addOrderActionListeners() {
    // Start buttons
    document.querySelectorAll('.start-button').forEach(button => {
      button.addEventListener('click', function() {
        const orderId = this.getAttribute('data-id');
        updateOrderStatus(orderId, 'in-progress');
      });
    });
    
    // Complete buttons
    document.querySelectorAll('.complete-button').forEach(button => {
      button.addEventListener('click', function() {
        const orderId = this.getAttribute('data-id');
        updateOrderStatus(orderId, 'completed');
      });
    });
    
    // Payment buttons
    document.querySelectorAll('.payment-button').forEach(button => {
      button.addEventListener('click', function() {
        const orderId = this.getAttribute('data-id');
        showPaymentModal(orderId);
      });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', function() {
        const orderId = this.getAttribute('data-id');
        deleteOrder(orderId);
      });
    });
  }
  
  // Update order status
  function updateOrderStatus(orderId, status) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      saveOrders();
      renderOrders();
    }
  }
  
  // Show payment modal
  function showPaymentModal(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Populate payment details
    let servicesHTML = '<div class="payment-service-list">';
    order.services.forEach(service => {
      servicesHTML += `
        <div class="service-item-admin">
          <span>${service.name}</span>
          <span>$${service.price}</span>
        </div>
      `;
    });
    servicesHTML += '</div>';
    
    paymentDetails.innerHTML = `
      <p>Reserva #${order.number}</p>
      <p>Cliente: ${order.customerName || 'Sin nombre'}</p>
      ${servicesHTML}
      <div class="payment-total">
        <span>Total a cobrar:</span>
        <span>$${order.totalAmount}</span>
      </div>
    `;
    
    // Store the current order ID for the payment process
    completeOrderBtn.setAttribute('data-id', orderId);
    
    // Show the modal
    paymentModal.classList.add('visible');
    paymentMethod.value = '';
  }
  
  // Hide payment modal
  function hidePaymentModal() {
    paymentModal.classList.remove('visible');
  }
  
  // Complete order and process payment
  completeOrderBtn.addEventListener('click', function() {
    const payment = paymentMethod.value;
    
    if (!payment) {
      alert('Por favor, selecciona un método de pago');
      return;
    }
    
    const orderId = this.getAttribute('data-id');
    deleteOrder(orderId);
    hidePaymentModal();
    
    // Here you would typically send payment information to a server
    alert('Pago procesado con éxito. Reserva archivada.');
  });
  
  // Cancel payment
  cancelPaymentBtn.addEventListener('click', hidePaymentModal);
  
  // Delete an order
  function deleteOrder(orderId) {
    orders = orders.filter(o => o.id !== orderId);
    saveOrders();
    renderOrders();
  }
  
  // Save orders to localStorage
  function saveOrders() {
    localStorage.setItem('spaOrders', JSON.stringify(orders));
  }
  
  // Generate a unique ID
  function generateOrderId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
  
  // Listen for new orders from the client page
  window.addEventListener('storage', function(e) {
    if (e.key === 'spaNewOrder') {
      const newOrder = JSON.parse(e.newValue);
      addNewOrder(newOrder);
      localStorage.removeItem('spaNewOrder');
    }
  });
  
  // Add a new order
  function addNewOrder(orderData) {
    const order = {
      id: generateOrderId(),
      number: orderData.orderNumber,
      customerName: orderData.customerName,
      services: orderData.services,
      totalAmount: orderData.totalAmount,
      totalDuration: orderData.totalDuration,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    saveOrders();
    renderOrders();
  }
});
