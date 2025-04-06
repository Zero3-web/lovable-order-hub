
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

  // Time slots for appointments
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const servicesList = document.getElementById('servicesList');
  const timeSlotsList = document.getElementById('timeSlots');
  const appointmentDateInput = document.getElementById('appointmentDate');
  const totalContainer = document.getElementById('totalContainer');
  const totalAmount = document.getElementById('totalAmount');
  const orderForm = document.getElementById('spa-form');
  const orderConfirmation = document.getElementById('orderConfirmation');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const orderNumberSpan = document.getElementById('orderNumber');
  const confirmDateSpan = document.getElementById('confirmDate');
  const confirmTimeSpan = document.getElementById('confirmTime');
  const newOrderBtn = document.getElementById('newOrderBtn');

  let selectedServices = [];
  let total = 0;
  let totalDuration = 0;
  let selectedTime = null;

  // Set min date to today
  const today = new Date();
  const formattedToday = formatDate(today);
  appointmentDateInput.min = formattedToday;
  appointmentDateInput.value = formattedToday;

  // Format date for input
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Format date for display
  function formatDateDisplay(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }

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

  // Render time slots
  function renderTimeSlots() {
    if (!timeSlotsList) return;
    
    timeSlotsList.innerHTML = '';
    
    timeSlots.forEach(time => {
      const timeSlot = document.createElement('div');
      timeSlot.className = 'time-slot';
      timeSlot.innerHTML = `
        <input type="radio" name="appointmentTime" id="time-${time}" class="time-radio" value="${time}">
        <label for="time-${time}" class="time-label">${time}</label>
      `;
      timeSlotsList.appendChild(timeSlot);
    });

    // Add event listeners to time slots
    const timeRadios = document.querySelectorAll('.time-radio');
    timeRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        selectedTime = this.value;
      });
    });

    // Select first time slot by default
    if (timeRadios.length > 0) {
      timeRadios[0].checked = true;
      selectedTime = timeRadios[0].value;
    }
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

  // Show loading animation
  function showLoading() {
    loadingOverlay.classList.add('visible');
    
    // Fix the lotus animation
    document.querySelectorAll('.lotus-petal').forEach((petal, index) => {
      const rotation = index * 60;
      petal.style.setProperty('--rotation', `${rotation}deg`);
    });
  }

  // Hide loading animation
  function hideLoading() {
    loadingOverlay.classList.remove('visible');
  }

  // Handle form submission
  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      alert('Por favor, selecciona al menos un servicio.');
      return;
    }

    if (!selectedTime) {
      alert('Por favor, selecciona una hora para tu cita.');
      return;
    }
    
    const customerName = document.getElementById('customerName').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const orderNumber = generateOrderNumber();
    
    // Show loading animation
    showLoading();
    
    // Create order object
    const orderData = {
      orderNumber: orderNumber,
      customerName: customerName || 'Cliente sin nombre',
      services: selectedServices,
      appointmentDate: appointmentDate,
      appointmentTime: selectedTime,
      totalAmount: total,
      totalDuration: totalDuration
    };
    
    // Store the new order in localStorage for the admin panel to pick up
    localStorage.setItem('spaNewOrder', JSON.stringify(orderData));
    
    // Simulate request delay
    setTimeout(() => {
      // Hide loading
      hideLoading();
      
      // Set confirmation details
      orderNumberSpan.textContent = orderNumber;
      confirmDateSpan.textContent = formatDateDisplay(appointmentDate);
      confirmTimeSpan.textContent = selectedTime;
      
      // Display confirmation
      orderConfirmation.classList.add('visible');
      
      console.log('Nueva reserva:', orderData);
    }, 1500);
  });

  // Handle new order button click
  newOrderBtn.addEventListener('click', function() {
    orderConfirmation.classList.remove('visible');
    orderForm.reset();
    selectedServices = [];
    total = 0;
    totalDuration = 0;
    totalContainer.classList.remove('visible');
    
    // Set default date
    appointmentDateInput.value = formatDate(new Date());
    
    // Select first time slot
    const timeRadios = document.querySelectorAll('.time-radio');
    if (timeRadios.length > 0) {
      timeRadios[0].checked = true;
      selectedTime = timeRadios[0].value;
    }
    
    // Uncheck all service checkboxes
    const checkboxes = document.querySelectorAll('.checkbox-input');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
  });

  // Initialize
  renderServices();
  renderTimeSlots();
});
