// 🎨 FutPro - Gestor de Interfaz de Usuario
export class UIManager {
  constructor() {
    this.toastContainer = null
    this.loadingOverlay = null
    this.modals = new Map()
    this.notifications = []
    this.themes = {
      dark: 'dark-theme',
      light: 'light-theme'
    }
    this.currentTheme = 'dark'
    
    this.init()
  }

  init() {
    this.createToastContainer()
    this.createLoadingOverlay()
    this.setupGlobalEventListeners()
    this.setupKeyboardShortcuts()
  }

  // ===== SISTEMA DE TOAST NOTIFICATIONS =====

  createToastContainer() {
    this.toastContainer = document.getElementById('toastContainer')
    
    if (!this.toastContainer) {
      this.toastContainer = document.createElement('div')
      this.toastContainer.id = 'toastContainer'
      this.toastContainer.className = 'toast-container'
      document.body.appendChild(this.toastContainer)
    }
  }

  showToast(message, type = 'info', duration = 5000, actions = null) {
    const toast = document.createElement('div')
    toast.className = `toast ${type} show`
    
    const icon = this.getToastIcon(type)
    
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">
          <i class="${icon}"></i>
        </div>
        <div class="toast-message">
          <span class="toast-text">${message}</span>
          ${actions ? this.renderToastActions(actions) : ''}
        </div>
        <button class="toast-close" onclick="this.closest('.toast').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="toast-progress">
        <div class="toast-progress-bar" style="animation: toastProgress ${duration}ms linear"></div>
      </div>
    `

    this.toastContainer.appendChild(toast)

    // Auto remove
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add('fade-out')
        setTimeout(() => toast.remove(), 300)
      }
    }, duration)

    // Add click to close
    toast.addEventListener('click', (e) => {
      if (e.target.classList.contains('toast-close') || e.target.closest('.toast-close')) {
        toast.classList.add('fade-out')
        setTimeout(() => toast.remove(), 300)
      }
    })

    return toast
  }

  getToastIcon(type) {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    }
    return icons[type] || icons.info
  }

  renderToastActions(actions) {
    return `
      <div class="toast-actions">
        ${actions.map(action => `
          <button class="toast-action-btn ${action.type || 'secondary'}" 
                  onclick="${action.onClick}">
            ${action.label}
          </button>
        `).join('')}
      </div>
    `
  }

  // ===== SISTEMA DE LOADING =====

  createLoadingOverlay() {
    this.loadingOverlay = document.getElementById('loadingOverlay')
    
    if (!this.loadingOverlay) {
      this.loadingOverlay = document.createElement('div')
      this.loadingOverlay.id = 'loadingOverlay'
      this.loadingOverlay.className = 'loading-overlay hidden'
      this.loadingOverlay.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p class="loading-text">Cargando...</p>
        </div>
      `
      document.body.appendChild(this.loadingOverlay)
    }
  }

  showLoading(message = 'Cargando...') {
    if (this.loadingOverlay) {
      const loadingText = this.loadingOverlay.querySelector('.loading-text')
      if (loadingText) loadingText.textContent = message
      
      this.loadingOverlay.classList.remove('hidden')
      document.body.style.overflow = 'hidden'
    }
  }

  hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add('hidden')
      document.body.style.overflow = ''
    }
  }

  // ===== SISTEMA DE MODALES =====

  createModal(id, content, options = {}) {
    const {
      title = '',
      size = 'medium',
      closable = true,
      backdrop = true,
      customClass = ''
    } = options

    const modal = document.createElement('div')
    modal.id = id
    modal.className = `modal ${customClass}`
    modal.setAttribute('data-size', size)

    modal.innerHTML = `
      <div class="modal-backdrop" ${backdrop ? 'onclick="uiManager.closeModal(\'' + id + '\')"' : ''}></div>
      <div class="modal-content">
        ${title || closable ? `
          <div class="modal-header">
            ${title ? `<h2 class="modal-title">${title}</h2>` : ''}
            ${closable ? `
              <button class="modal-close" onclick="uiManager.closeModal('${id}')">
                <i class="fas fa-times"></i>
              </button>
            ` : ''}
          </div>
        ` : ''}
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `

    document.body.appendChild(modal)
    this.modals.set(id, modal)

    return modal
  }

  showModal(id, options = {}) {
    const modal = this.modals.get(id) || document.getElementById(id)
    
    if (modal) {
      modal.classList.add('show')
      document.body.style.overflow = 'hidden'
      
      // Focus management
      const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])')
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100)
      }

      // Trigger event
      modal.dispatchEvent(new CustomEvent('modal:shown', { detail: options }))
    }
  }

  closeModal(id) {
    const modal = this.modals.get(id) || document.getElementById(id)
    
    if (modal) {
      modal.classList.remove('show')
      
      // Check if any other modals are open
      const openModals = document.querySelectorAll('.modal.show')
      if (openModals.length === 0) {
        document.body.style.overflow = ''
      }

      // Trigger event
      modal.dispatchEvent(new CustomEvent('modal:hidden'))
    }
  }

  closeAllModals() {
    document.querySelectorAll('.modal.show').forEach(modal => {
      modal.classList.remove('show')
    })
    document.body.style.overflow = ''
  }

  // ===== SISTEMA DE CONFIRMACIÓN =====

  showConfirmDialog(message, options = {}) {
    const {
      title = 'Confirmar',
      confirmText = 'Aceptar',
      cancelText = 'Cancelar',
      type = 'warning',
      onConfirm = () => {},
      onCancel = () => {}
    } = options

    return new Promise((resolve) => {
      const modalId = 'confirmDialog'
      
      const content = `
        <div class="confirm-dialog ${type}">
          <div class="confirm-icon">
            <i class="${this.getConfirmIcon(type)}"></i>
          </div>
          <div class="confirm-message">
            <p>${message}</p>
          </div>
          <div class="confirm-actions">
            <button class="btn btn-secondary" onclick="uiManager.handleConfirmCancel('${modalId}')">
              ${cancelText}
            </button>
            <button class="btn btn-${this.getConfirmButtonType(type)}" onclick="uiManager.handleConfirmAccept('${modalId}')">
              ${confirmText}
            </button>
          </div>
        </div>
      `

      // Remove existing modal if present
      const existingModal = document.getElementById(modalId)
      if (existingModal) existingModal.remove()

      const modal = this.createModal(modalId, content, {
        title,
        size: 'small',
        closable: true,
        customClass: 'confirm-modal'
      })

      // Store callbacks
      modal._onConfirm = () => {
        onConfirm()
        resolve(true)
      }
      
      modal._onCancel = () => {
        onCancel()
        resolve(false)
      }

      this.showModal(modalId)
    })
  }

  handleConfirmAccept(modalId) {
    const modal = document.getElementById(modalId)
    if (modal && modal._onConfirm) {
      modal._onConfirm()
    }
    this.closeModal(modalId)
  }

  handleConfirmCancel(modalId) {
    const modal = document.getElementById(modalId)
    if (modal && modal._onCancel) {
      modal._onCancel()
    }
    this.closeModal(modalId)
  }

  getConfirmIcon(type) {
    const icons = {
      warning: 'fas fa-exclamation-triangle',
      danger: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle',
      success: 'fas fa-check-circle'
    }
    return icons[type] || icons.warning
  }

  getConfirmButtonType(type) {
    const buttonTypes = {
      warning: 'warning',
      danger: 'danger',
      info: 'primary',
      success: 'success'
    }
    return buttonTypes[type] || 'primary'
  }

  // ===== ANIMACIONES Y TRANSICIONES =====

  animateElement(element, animation, duration = 300) {
    return new Promise((resolve) => {
      element.style.animation = `${animation} ${duration}ms ease`
      
      setTimeout(() => {
        element.style.animation = ''
        resolve()
      }, duration)
    })
  }

  fadeIn(element, duration = 300) {
    element.style.opacity = '0'
    element.style.display = 'block'
    
    return this.animateElement(element, 'fadeIn', duration)
  }

  fadeOut(element, duration = 300) {
    return new Promise((resolve) => {
      this.animateElement(element, 'fadeOut', duration).then(() => {
        element.style.display = 'none'
        resolve()
      })
    })
  }

  slideIn(element, direction = 'down', duration = 300) {
    const animations = {
      down: 'slideInDown',
      up: 'slideInUp',
      left: 'slideInLeft',
      right: 'slideInRight'
    }
    
    return this.animateElement(element, animations[direction], duration)
  }

  pulse(element, intensity = 'normal') {
    const animations = {
      soft: 'pulseSoft',
      normal: 'pulse',
      strong: 'pulseStrong'
    }
    
    return this.animateElement(element, animations[intensity], 600)
  }

  // ===== FORMULARIOS =====

  setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId)
    const formGroup = field?.closest('.form-group')
    
    if (formGroup) {
      formGroup.classList.add('error')
      formGroup.classList.remove('success')
      
      this.clearFieldMessage(formGroup)
      
      const errorElement = document.createElement('div')
      errorElement.className = 'error-message'
      errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`
      formGroup.appendChild(errorElement)
      
      field?.focus()
    }
  }

  setFieldSuccess(fieldId, message = '') {
    const field = document.getElementById(fieldId)
    const formGroup = field?.closest('.form-group')
    
    if (formGroup) {
      formGroup.classList.add('success')
      formGroup.classList.remove('error')
      
      this.clearFieldMessage(formGroup)
      
      if (message) {
        const successElement = document.createElement('div')
        successElement.className = 'success-message'
        successElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`
        formGroup.appendChild(successElement)
      }
    }
  }

  clearFieldError(fieldId) {
    const field = document.getElementById(fieldId)
    const formGroup = field?.closest('.form-group')
    
    if (formGroup) {
      formGroup.classList.remove('error', 'success')
      this.clearFieldMessage(formGroup)
    }
  }

  clearFieldMessage(formGroup) {
    const messages = formGroup.querySelectorAll('.error-message, .success-message')
    messages.forEach(msg => msg.remove())
  }

  setButtonLoading(button, loading = true, loadingText = 'Cargando...') {
    if (!button) return
    
    if (loading) {
      button.dataset.originalText = button.textContent
      button.textContent = loadingText
      button.classList.add('loading')
      button.disabled = true
    } else {
      button.textContent = button.dataset.originalText || button.textContent
      button.classList.remove('loading')
      button.disabled = false
      delete button.dataset.originalText
    }
  }

  // ===== VALIDACIÓN DE FORMULARIOS =====

  validateForm(formElement) {
    const fields = formElement.querySelectorAll('input, select, textarea')
    let isValid = true
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false
      }
    })
    
    return isValid
  }

  validateField(field) {
    const value = field.value.trim()
    const type = field.type
    const required = field.hasAttribute('required')
    let isValid = true
    
    // Clear previous errors
    this.clearFieldError(field.id)
    
    // Required validation
    if (required && !value) {
      this.setFieldError(field.id, 'Este campo es obligatorio')
      return false
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !required) return true
    
    // Type-specific validation
    switch (type) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          this.setFieldError(field.id, 'Email inválido')
          isValid = false
        }
        break
        
      case 'password':
        if (value.length < 6) {
          this.setFieldError(field.id, 'La contraseña debe tener al menos 6 caracteres')
          isValid = false
        }
        break
        
      case 'tel':
        if (!/^\+?[\d\s\-()]+$/.test(value)) {
          this.setFieldError(field.id, 'Número de teléfono inválido')
          isValid = false
        }
        break
        
      case 'url':
        try {
          new URL(value)
        } catch {
          this.setFieldError(field.id, 'URL inválida')
          isValid = false
        }
        break
    }
    
    // Custom validation patterns
    const pattern = field.getAttribute('pattern')
  if (pattern && !new RegExp(pattern).test(value)) {
      this.setFieldError(field.id, field.getAttribute('data-error') || 'Formato inválido')
      isValid = false
    }
    
    // Min/max length
    const minLength = field.getAttribute('minlength')
    const maxLength = field.getAttribute('maxlength')
    
    if (minLength && value.length < parseInt(minLength)) {
      this.setFieldError(field.id, `Mínimo ${minLength} caracteres`)
      isValid = false
    }
    
    if (maxLength && value.length > parseInt(maxLength)) {
      this.setFieldError(field.id, `Máximo ${maxLength} caracteres`)
      isValid = false
    }
    
    return isValid
  }

  // ===== UTILIDADES DE UI =====

  scrollToElement(element, offset = 0) {
    const elementTop = element.offsetTop - offset
    window.scrollTo({
      top: elementTop,
      behavior: 'smooth'
    })
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  copyToClipboard(text) {
    return navigator.clipboard.writeText(text).then(() => {
      this.showToast('Copiado al portapapeles', 'success', 2000)
    }).catch(() => {
      this.showToast('Error al copiar', 'error', 3000)
    })
  }

  // ===== EVENT LISTENERS =====

  setupGlobalEventListeners() {
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show')
        if (openModal) {
          this.closeModal(openModal.id)
        }
      }
    })

    // Click outside to close dropdowns
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown, .user-menu')) {
        document.querySelectorAll('.dropdown.show, .user-dropdown.show').forEach(dropdown => {
          dropdown.classList.remove('show')
        })
      }
    })

    // Form validation on input
    document.addEventListener('input', (e) => {
      if (e.target.matches('input, select, textarea')) {
        const formGroup = e.target.closest('.form-group')
        if (formGroup && (formGroup.classList.contains('error') || formGroup.classList.contains('success'))) {
          // Re-validate field on change if it was previously validated
          setTimeout(() => this.validateField(e.target), 100)
        }
      }
    })
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.getElementById('globalSearch')
        if (searchInput) {
          searchInput.focus()
        }
      }
      
      // Ctrl/Cmd + / for help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        this.showHelpModal()
      }
    })
  }

  showHelpModal() {
    const content = `
      <div class="help-content">
        <h3>Atajos de Teclado</h3>
        <div class="shortcuts-list">
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>K</kbd>
            <span>Buscar</span>
          </div>
          <div class="shortcut-item">
            <kbd>Ctrl</kbd> + <kbd>/</kbd>
            <span>Ayuda</span>
          </div>
          <div class="shortcut-item">
            <kbd>Esc</kbd>
            <span>Cerrar modales</span>
          </div>
        </div>
      </div>
    `
    
    this.createModal('helpModal', content, {
      title: 'Ayuda - FutPro',
      size: 'medium'
    })
    
    this.showModal('helpModal')
  }

  // ===== TEMAS =====

  setTheme(theme) {
    document.body.className = document.body.className.replace(/\w+-theme/g, '')
    document.body.classList.add(this.themes[theme] || this.themes.dark)
    this.currentTheme = theme
    
    localStorage.setItem('futpro-theme', theme)
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('futpro-theme') || 'dark'
    this.setTheme(savedTheme)
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark'
    this.setTheme(newTheme)
  }
}

// Crear instancia global
window.uiManager = new UIManager()

export default UIManager
