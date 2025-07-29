


let cart = [];
let cartCount = 0;
let cartTotal = 0;

let autoSlideIntervals = new Map();
let isUserInteracting = false;



document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    initializeImageCarousel();
    initializeImageModal();
    initializeCategories();
    initializeMobileNav();
    initializeScrollEffects();
    initializeKeyboardNavigation();
    initializeTouchNavigation();
    initializeNotificationSystem();
});


function initializeImageCarousel() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, cardIndex) => {
        const images = card.querySelectorAll('.product-image');
        const dots = card.querySelectorAll('.dot');
        
        if (images.length <= 1) return;
        
     
        let currentIndex = 0;
        card.dataset.currentIndex = currentIndex;
        
        
        images.forEach((img, index) => {
            img.classList.toggle('active', index === 0);
        });
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === 0);
        });
        
      
        setupAutoSlide(card, cardIndex);
        
      
        setupCardInteractionListeners(card);
        setupDotsNavigation(card);
        setupArrowNavigation(card);
    });
}

function setupAutoSlide(card, cardIndex) {
    const images = card.querySelectorAll('.product-image');
    if (images.length <= 1) return;
    
    const slideInterval = setInterval(() => {
        if (!isUserInteracting && !card.matches(':hover')) {
            navigateToImage(card, 'next');
        }
    }, 4000 + (cardIndex * 500));
    
    autoSlideIntervals.set(card, slideInterval);
}

function setupCardInteractionListeners(card) {
    card.addEventListener('mouseenter', () => {
        pauseAutoSlide(card);
    });
    
    card.addEventListener('mouseleave', () => {
        resumeAutoSlide(card);
    });
    
    card.addEventListener('touchstart', () => {
        isUserInteracting = true;
        pauseAutoSlide(card);
    });
    
    card.addEventListener('touchend', () => {
        setTimeout(() => {
            isUserInteracting = false;
            resumeAutoSlide(card);
        }, 1000);
    });
}

function setupDotsNavigation(card) {
    const dots = card.querySelectorAll('.dot');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            navigateToImage(card, index);
            pauseAutoSlideTemporarily(card, 8000);
        });
    });
}

function setupArrowNavigation(card) {
    const prevBtn = card.querySelector('.image-nav-btn.prev');
    const nextBtn = card.querySelector('.image-nav-btn.next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            navigateToImage(card, 'prev');
            pauseAutoSlideTemporarily(card, 8000);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            navigateToImage(card, 'next');
            pauseAutoSlideTemporarily(card, 8000);
        });
    }
}



function navigateToImage(card, direction) {
    const images = card.querySelectorAll('.product-image');
    const dots = card.querySelectorAll('.dot');
    const currentIndex = parseInt(card.dataset.currentIndex) || 0;
    let newIndex;
    
  
    if (direction === 'next') {
        newIndex = (currentIndex + 1) % images.length;
    } else if (direction === 'prev') {
        newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    } else if (typeof direction === 'number') {
        newIndex = direction;
    } else {
        return;
    }
    
    
    if (newIndex < 0 || newIndex >= images.length) return;
    if (newIndex === currentIndex) return;
    
    
    applyImageTransition(card, currentIndex, newIndex);
    
    
    card.dataset.currentIndex = newIndex;
    

    updateDots(dots, newIndex);
    
    console.log(`Navegando de ${currentIndex} para ${newIndex} em card com ${images.length} imagens`);
}

function applyImageTransition(card, fromIndex, toIndex) {
    const images = card.querySelectorAll('.product-image');
    
    
    images.forEach(img => img.classList.remove('active'));
    
   
    images[toIndex].classList.add('active');
}

function updateDots(dots, activeIndex) {
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
    });
}


function pauseAutoSlide(card) {
    const interval = autoSlideIntervals.get(card);
    if (interval) {
        clearInterval(interval);
    }
}

function resumeAutoSlide(card) {
    const images = card.querySelectorAll('.product-image');
    if (images.length <= 1) return;
    
    pauseAutoSlide(card);
    
    const newInterval = setInterval(() => {
        if (!isUserInteracting && !card.matches(':hover')) {
            navigateToImage(card, 'next');
        }
    }, 4000);
    
    autoSlideIntervals.set(card, newInterval);
}

function pauseAutoSlideTemporarily(card, duration = 8000) {
    pauseAutoSlide(card);
    setTimeout(() => {
        resumeAutoSlide(card);
    }, duration);
}



function initializeImageModal() {
    createModalIfNotExists();
    setupImageClickListeners();
    setupModalEventListeners();
}

function createModalIfNotExists() {
    if (document.getElementById('image-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'image-modal';
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeImageModal()" aria-label="Fechar modal">
                <i class="fas fa-times"></i>
            </button>
            <img class="modal-image" src="" alt="" />
            <div class="modal-info">
                <h3 class="modal-title"></h3>
                <p class="modal-description"></p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function setupImageClickListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('product-image') && e.target.classList.contains('active')) {
            const card = e.target.closest('.product-card');
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('.product-info p').textContent;
            
            openImageModal(e.target.src, e.target.alt, title, description);
        }
    });
}

function setupModalEventListeners() {
    const modal = document.getElementById('image-modal');
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeImageModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeImageModal();
        }
    });
}

function openImageModal(src, alt, title = '', description = '') {
    const modal = document.getElementById('image-modal');
    const modalImage = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    
    modalImage.src = src;
    modalImage.alt = alt;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}


function initializeKeyboardNavigation() {
    let focusedCard = null;
    
    document.addEventListener('keydown', function(e) {
        const hoveredCard = document.querySelector('.product-card:hover');
        if (hoveredCard) {
            focusedCard = hoveredCard;
        }
        
        if (!focusedCard) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                navigateToImage(focusedCard, 'prev');
                pauseAutoSlideTemporarily(focusedCard, 5000);
                break;
                
            case 'ArrowRight':
                e.preventDefault();
                navigateToImage(focusedCard, 'next');
                pauseAutoSlideTemporarily(focusedCard, 5000);
                break;
                
            case 'Enter':
            case ' ':
                e.preventDefault();
                const activeImage = focusedCard.querySelector('.product-image.active');
                if (activeImage) {
                    activeImage.click();
                }
                break;
        }
    });
}



function initializeTouchNavigation() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let activeCard = null;
    let isDragging = false;
    
    document.addEventListener('touchstart', function(e) {
        const card = e.target.closest('.product-card');
        if (!card) return;
        
        const images = card.querySelectorAll('.product-image');
        if (images.length <= 1) return;
        
        activeCard = card;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        isDragging = false;
        
        console.log('Touch start:', touchStartX, touchStartY);
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (!activeCard) return;
        
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const diffX = touchStartX - touchX;
        const diffY = touchStartY - touchY;
        
     
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
            isDragging = true;
            e.preventDefault(); 
            console.log('Dragging horizontally:', diffX);
        }
    }, { passive: false });
    
    document.addEventListener('touchend', function(e) {
        if (!activeCard || !isDragging) {
            activeCard = null;
            isDragging = false;
            return;
        }
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndTime = Date.now();
        
        const diffX = touchStartX - touchEndX;
        const timeDiff = touchEndTime - touchStartTime;
        
        console.log('Touch end - diffX:', diffX, 'timeDiff:', timeDiff);
        
        
        const isQuickSwipe = timeDiff < 800;
        const isLongEnoughSwipe = Math.abs(diffX) > 30;
        
        if (isQuickSwipe && isLongEnoughSwipe) {
            if (diffX > 0) {
                
                console.log('Swipe left - próxima imagem');
                navigateToImage(activeCard, 'next');
            } else {
             
                console.log('Swipe right - imagem anterior');
                navigateToImage(activeCard, 'prev');
            }
            pauseAutoSlideTemporarily(activeCard, 6000);
            
           
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }
        
        activeCard = null;
        isDragging = false;
        touchStartX = 0;
        touchStartY = 0;
        touchStartTime = 0;
    }, { passive: true });
}



function initializeNotificationSystem() {
    if (!document.getElementById('notifications-container')) {
        const container = document.createElement('div');
        container.id = 'notifications-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'success', duration = 3000) {
    const container = document.getElementById('notifications-container');
    const notification = document.createElement('div');
    
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        margin-bottom: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        font-weight: 600;
        max-width: 300px;
        pointer-events: auto;
        cursor: pointer;
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, duration);
    
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}



function initializeCart() {
    const savedCart = localStorage.getItem('babyCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function initializeCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            productCards.forEach((card, index) => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'flex';
                    card.style.animation = `fadeUpStaggered 0.5s ease forwards`;
                    card.style.animationDelay = `${index * 0.1}s`;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function initializeMobileNav() {
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            mobileNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.product-card, .about-text, .about-image');
    animatedElements.forEach(el => observer.observe(el));
}


document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const name = e.target.dataset.name;
        const price = parseFloat(e.target.dataset.price);
        
        addToCart(name, price);
        showNotification(`${name} adicionado ao carrinho!`);
        
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 150);
    }
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCart();
    animateCartIcon();
}

function updateCartDisplay() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    document.getElementById('cart-count').textContent = cartCount;
    document.getElementById('cart-total').textContent = cartTotal.toFixed(2);
    
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Carrinho vazio</p>';
        return;
    }
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div>
                <div class="cart-item-name">${item.name}</div>
                <div class="item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div>
                <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
                <span class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </span>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    updateCartDisplay();
    saveCart();
}

function removeFromCart(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    updateCartDisplay();
    saveCart();
    showNotification(`${itemName} removido do carrinho`);
}

function saveCart() {
    localStorage.setItem('babyCart', JSON.stringify(cart));
}

function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.classList.add('cart-bump');
    setTimeout(() => {
        cartIcon.classList.remove('cart-bump');
    }, 500);
}

function toggleCart() {
    const cartDropdown = document.getElementById('cart-dropdown');
    cartDropdown.classList.toggle('active');
}

function goToCheckout() {
    if (cart.length === 0) {
        showNotification('Carrinho vazio!', 'warning');
        return;
    }
    
    let message = 'Olá! Gostaria de fazer o seguinte pedido:\n\n';
    
    cart.forEach(item => {
        message += `• ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Total: R$ ${cartTotal.toFixed(2)}*\n\n`;
    message += 'Aguardo confirmação! 🧸';
    
    const whatsappUrl = `https://wa.me/5511934460341?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
        clearCart();
    }, 1000);
}

function clearCart() {
    cart = [];
    updateCartDisplay();
    saveCart();
    showNotification('Carrinho limpo!');
    
    const cartDropdown = document.getElementById('cart-dropdown');
    cartDropdown.classList.remove('active');
}


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});


document.addEventListener('click', function(e) {
    const cartDropdown = document.getElementById('cart-dropdown');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
        cartDropdown.classList.remove('active');
    }
});


window.addEventListener('beforeunload', function() {
    autoSlideIntervals.forEach(interval => clearInterval(interval));
});

