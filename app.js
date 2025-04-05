
document.addEventListener('DOMContentLoaded', function() {
  // Services data
  const services = [
    { id: 1, name: 'Masaje Relajante', price: 50, duration: 60 },
    { id: 2, name: 'Facial Hidratante', price: 35, duration: 45 },
    { id: 3, name: 'Manicura Spa', price: 20, duration: 30 },
    { id: 4, name: 'Pedicura Spa', price: 25, duration: 40 },
    { id: 5, name: 'Exfoliación Corporal', price: 45, duration: 50 },
    { id: 6, name: 'Tratamiento Capilar', price: 30, duration: 35 }
  ];

  const servicesList = document.getElementById('servicesList');
  const totalContainer = document.getElementById('totalContainer');
  const totalAmount = document.getElementById('totalAmount');
  const orderForm = document.getElementById('spa-form');
  const orderConfirmation = document.getElementById('orderConfirmation');
  const orderNumberSpan = document.getElementById('orderNumber');
  const newOrderBtn = document.getElementById('newOrderBtn');

  let selectedServices = [];
  let total = 0;
  let totalDuration = 0;

  // Render services
  function renderServices() {
    servicesList.innerHTML = '';
    
    services.forEach(service => {
      const serviceItem = document.createElement('div');
      serviceItem.className = 'service-item';
      serviceItem.innerHTML = `
        <label>
          <div class="checkbox-wrapper">
            <input type="checkbox" class="checkbox-input" data-id="${service.id}" data-price="${service.price}" data-duration="${service.duration}">
            <div class="checkbox-custom"></div>
          </div>
          <span>${service.name} (${service.duration} min)</span>
        </label>
        <span class="service-price">$${service.price}</span>
      `;
      servicesList.appendChild(serviceItem);
    });

    // Add event listeners to checkboxes
    const checkboxes = document.querySelectorAll('.checkbox-input');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateTotals);
    });
  }

  // Update totals when selecting services
  function updateTotals() {
    selectedServices = [];
    total = 0;
    totalDuration = 0;

    const checkboxes = document.querySelectorAll('.checkbox-input:checked');
    
    checkboxes.forEach(checkbox => {
      const serviceId = parseInt(checkbox.getAttribute('data-id'));
      const price = parseFloat(checkbox.getAttribute('data-price'));
      const duration = parseInt(checkbox.getAttribute('data-duration'));
      
      const service = services.find(s => s.id === serviceId);
      if (service) {
        selectedServices.push(service);
        total += price;
        totalDuration += duration;
      }
    });

    // Update total display
    totalAmount.textContent = `$${total} (${totalDuration} min)`;
    
    // Show or hide total container
    if (selectedServices.length > 0) {
      totalContainer.classList.add('visible');
    } else {
      totalContainer.classList.remove('visible');
    }
  }

  // Generate random order number
  function generateOrderNumber() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  // Handle form submission
  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      alert('Por favor, selecciona al menos un servicio.');
      return;
    }
    
    const customerName = document.getElementById('customerName').value;
    const orderNumber = generateOrderNumber();
    
    // Create order object
    const orderData = {
      orderNumber: orderNumber,
      customerName: customerName || 'Cliente sin nombre',
      services: selectedServices,
      totalAmount: total,
      totalDuration: totalDuration
    };
    
    // Store the new order in localStorage for the admin panel to pick up
    localStorage.setItem('spaNewOrder', JSON.stringify(orderData));
    
    // Display confirmation
    orderNumberSpan.textContent = orderNumber;
    orderConfirmation.classList.add('visible');
    
    console.log('Nueva reserva:', orderData);
  });

  // Handle new order button click
  newOrderBtn.addEventListener('click', function() {
    orderConfirmation.classList.remove('visible');
    orderForm.reset();
    selectedServices = [];
    total = 0;
    totalDuration = 0;
    totalContainer.classList.remove('visible');
    
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('.checkbox-input');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
  });

  // Initialize
  renderServices();
});
