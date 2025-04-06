
document.addEventListener('DOMContentLoaded', function() {
  // Servicios disponibles
  const services = [
    { id: 1, name: 'Masaje Relajante', price: 50, duration: 60 },
    { id: 2, name: 'Facial Profundo', price: 40, duration: 45 },
    { id: 3, name: 'Manicura', price: 25, duration: 30 },
    { id: 4, name: 'Pedicura', price: 30, duration: 40 },
    { id: 5, name: 'Tratamiento Capilar', price: 35, duration: 50 },
    { id: 6, name: 'Depilación', price: 45, duration: 55 }
  ];

  // Horarios disponibles
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  
  // Elementos DOM
  const servicesList = document.getElementById('servicesList');
  const timeSlotsList = document.getElementById('timeSlots');
  const totalAmountDisplay = document.getElementById('totalAmount');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const orderConfirmation = document.getElementById('orderConfirmation');
  const orderNumberSpan = document.getElementById('orderNumber');
  const confirmDateSpan = document.getElementById('confirmDate');
  const confirmTimeSpan = document.getElementById('confirmTime');
  const newOrderBtn = document.getElementById('newOrderBtn');
  const spaForm = document.getElementById('spa-form');
  
  // Variables de estado
  let selectedServices = [];
  let selectedTime = null;
  let totalAmount = 0;
  let totalDuration = 0;

  // Función para mostrar el loader
  function showLoader(message = "Cargando...") {
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
      loadingText.textContent = message;
    }
    loadingOverlay.classList.add('visible');
  }
  
  // Función para ocultar el loader
  function hideLoader() {
    loadingOverlay.classList.remove('visible');
  }

  // Simula carga inicial
  showLoader("Cargando servicios...");
  setTimeout(hideLoader, 800);

  // Función para formatear precio
  function formatPrice(price) {
    return price.toFixed(0);
  }

  // Cargar servicios disponibles
  function renderServices() {
    if (!servicesList) return;
    
    servicesList.innerHTML = '';
    
    services.forEach(service => {
      const serviceItem = document.createElement('div');
      serviceItem.className = 'service-item';
      
      serviceItem.innerHTML = `
        <div class="service-checkbox">
          <input type="checkbox" id="service-${service.id}" data-id="${service.id}" data-price="${service.price}" data-duration="${service.duration}">
          <label for="service-${service.id}">
            <div class="service-name">${service.name}</div>
            <div class="service-details">
              <span class="service-duration">${service.duration} min</span>
              <span class="service-price">$${formatPrice(service.price)}</span>
            </div>
          </label>
        </div>
      `;
      
      servicesList.appendChild(serviceItem);
      
      // Añadir eventos a los checkboxes
      const checkbox = serviceItem.querySelector(`input[type="checkbox"]`);
      checkbox.addEventListener('change', handleServiceSelection);
    });
  }

  // Cargar horas disponibles
  function renderTimeSlots() {
    if (!timeSlotsList) return;
    
    timeSlotsList.innerHTML = '';
    
    timeSlots.forEach(time => {
      const timeSlot = document.createElement('div');
      timeSlot.className = 'time-slot';
      timeSlot.setAttribute('data-time', time);
      
      timeSlot.innerHTML = time;
      
      if (selectedTime === time) {
        timeSlot.classList.add('selected');
      }
      
      timeSlot.addEventListener('click', function() {
        // Remover selección previa
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
          slot.classList.remove('selected');
        });
        
        // Seleccionar nuevo horario
        this.classList.add('selected');
        selectedTime = this.getAttribute('data-time');
      });
      
      timeSlotsList.appendChild(timeSlot);
    });
  }

  // Manejar selección de servicios
  function handleServiceSelection(e) {
    const serviceId = parseInt(e.target.dataset.id);
    const servicePrice = parseFloat(e.target.dataset.price);
    const serviceDuration = parseInt(e.target.dataset.duration);
    
    if (e.target.checked) {
      // Añadir servicio
      const selectedService = services.find(service => service.id === serviceId);
      selectedServices.push(selectedService);
    } else {
      // Remover servicio
      selectedServices = selectedServices.filter(service => service.id !== serviceId);
    }
    
    // Actualizar total
    calculateTotal();
  }

  // Calcular total
  function calculateTotal() {
    totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0);
    totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);
    
    if (totalAmountDisplay) {
      totalAmountDisplay.textContent = `$${formatPrice(totalAmount)}`;
    }
  }

  // Procesar el formulario de reserva
  if (spaForm) {
    spaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validar que haya servicios seleccionados
      if (selectedServices.length === 0) {
        alert('Por favor, selecciona al menos un servicio');
        return;
      }
      
      // Validar que se haya seleccionado una hora
      if (!selectedTime) {
        alert('Por favor, selecciona un horario para tu cita');
        return;
      }
      
      // Validar que se haya ingresado un nombre
      const customerName = document.getElementById('customerName').value.trim();
      if (!customerName) {
        alert('Por favor, ingresa tu nombre');
        return;
      }

      // Validar que se haya ingresado un teléfono
      const customerPhone = document.getElementById('customerPhone').value.trim();
      if (!customerPhone) {
        alert('Por favor, ingresa tu número de teléfono');
        return;
      }
      
      // Validar que se haya seleccionado una fecha
      const appointmentDate = document.getElementById('appointmentDate').value;
      if (!appointmentDate) {
        alert('Por favor, selecciona una fecha para tu cita');
        return;
      }
      
      // Mostrar animación de carga
      showLoader('Procesando tu reserva...');
      
      // Simular proceso de reserva (2 segundos)
      setTimeout(() => {
        // Crear objeto de reserva
        const orderNumber = Math.floor(Math.random() * 10000);
        const order = {
          orderNumber,
          customerName,
          customerPhone,
          services: selectedServices,
          appointmentDate,
          appointmentTime: selectedTime,
          totalAmount,
          totalDuration
        };
        
        // Guardar en localStorage para uso en el panel de admin
        localStorage.setItem('spaNewOrder', JSON.stringify(order));
        
        // Formatear fecha para mostrar
        const displayDate = formatDate(appointmentDate);
        
        // Actualizar confirmación
        orderNumberSpan.textContent = orderNumber;
        confirmDateSpan.textContent = displayDate;
        confirmTimeSpan.textContent = selectedTime;
        
        // Mostrar confirmación
        hideLoader();
        orderConfirmation.classList.add('visible');
        
        // Logging
        console.log('info: Nueva reserva:', order);
      }, 2000);
    });
  }

  // Formatear fecha
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  }

  // Botón de nueva reserva
  if (newOrderBtn) {
    newOrderBtn.addEventListener('click', function() {
      // Ocultar confirmación
      orderConfirmation.classList.remove('visible');
      
      // Resetear formulario
      if (spaForm) {
        spaForm.reset();
      }
      
      // Resetear servicios seleccionados
      selectedServices = [];
      document.querySelectorAll('.service-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
      });
      
      // Resetear hora seleccionada
      selectedTime = null;
      document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
      });
      
      // Resetear total
      calculateTotal();
    });
  }

  // Inicializar
  renderServices();
  renderTimeSlots();
  
  // Simular navegación entre páginas con efecto de carga
  document.querySelectorAll('a').forEach(link => {
    // No aplicar a links que abren en nueva pestaña o tienen comportamiento especial
    if (link.getAttribute('target') === '_blank' || link.getAttribute('href').startsWith('#')) {
      return;
    }
    
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href && !href.startsWith('javascript:')) {
        e.preventDefault();
        showLoader('Cambiando de página...');
        
        setTimeout(() => {
          window.location.href = href;
        }, 800);
      }
    });
  });
});
