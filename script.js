// Dark Mode Toggle
function toggleDarkMode() {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    if (isDarkMode) {
        localStorage.setItem('darkMode', 'enabled');
        updateDarkModeIcon(true);
    } else {
        localStorage.setItem('darkMode', 'disabled');
        updateDarkModeIcon(false);
    }
}

// Update dark mode icon
function updateDarkModeIcon(isDarkMode) {
    const icon = document.querySelector('.dark-mode-icon');
    if (icon) {
        if (isDarkMode) {
            icon.textContent = '☀️';
        } else {
            icon.textContent = '🌙';
        }
    }
}

// Initialize dark mode based on saved preference
function initializeDarkMode() {
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
}

// Initialize sample products data\n
function initializeProducts() {
    const existingProducts = localStorage.getItem('techhub_products');
    if (!existingProducts) {
        const sampleProducts = [
            {
                id: 1,
                name: 'MacBook Pro 14" M4 Pro',
                category: 'laptops',
                price: 1999,
                description: 'Powerful laptop with M4 Pro chip, 16GB RAM, 512GB SSD. Perfect for professionals.',
                image: '💻',
                stock: 15
            },
            {
                id: 2,
                name: 'Dell XPS 13',
                category: 'laptops',
                price: 1299,
                description: 'Ultrabook with Intel Core i7, 8GB RAM, 512GB SSD. Ultra-portable design.',
                image: '💻',
                stock: 20
            },
            {
                id: 3,
                name: 'Gaming Laptop - RTX 4070',
                category: 'laptops',
                price: 1599,
                description: 'High-performance gaming laptop with RTX 4070, 16GB RAM, 1TB SSD.',
                image: '🎮',
                stock: 10
            },
            {
                id: 4,
                name: 'Desktop PC - Intel i9',
                category: 'desktops',
                price: 2499,
                description: 'Powerful desktop with Intel i9 processor, 32GB RAM, RTX 4090 GPU.',
                image: '🖥️',
                stock: 8
            },
            {
                id: 5,
                name: 'Wireless Mouse',
                category: 'peripherals',
                price: 29,
                description: 'Ergonomic wireless mouse with 2.4GHz connectivity.',
                image: '🖱️',
                stock: 50
            },
            {
                id: 6,
                name: 'Mechanical Keyboard',
                category: 'peripherals',
                price: 89,
                description: 'RGB Mechanical keyboard with Cherry MX switches.',
                image: '⌨️',
                stock: 30
            },
            {
                id: 7,
                name: 'Wireless Headphones',
                category: 'accessories',
                price: 149,
                description: 'Premium wireless headphones with active noise cancellation.',
                image: '🎧',
                stock: 25
            },
            {
                id: 8,
                name: 'USB-C Hub',
                category: 'accessories',
                price: 49,
                description: '7-in-1 USB-C hub with HDMI, SD card reader, and USB ports.',
                image: '🔌',
                stock: 40
            }
        ];
        localStorage.setItem('techhub_products', JSON.stringify(sampleProducts));
    }
}

// Load and display products
function loadProducts(filter = 'all') {
    initializeProducts();
    const products = JSON.parse(localStorage.getItem('techhub_products') || '[]');
    const grid = document.getElementById('products-grid');
    
    if (!grid) return;
    
    let filteredProducts = products;
    if (filter !== 'all') {
        filteredProducts = products.filter(p => p.category === filter);
    }

    grid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No products found.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.image || '📦'}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-stock">Stock: ${product.stock} units</div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filter products
function filterProducts(category) {
    loadProducts(category);
    
    // Update active filter button
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(category.toLowerCase()) || 
            (category === 'all' && btn.textContent === 'All')) {
            btn.classList.add('active');
        }
    });
}

// Add to cart
function addToCart(productId) {
    // Check if user is logged in
    const currentUser = localStorage.getItem('current_user');
    if (!currentUser) {
        alert('Please login first to add products to your cart!');
        window.location.href = 'login.html';
        return;
    }

    const products = JSON.parse(localStorage.getItem('techhub_products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found!');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    // Navigate to cart confirmation page instead of showing alert
    window.location.href = 'cart-confirmation.html';
}

// Check if user is logged in
function checkUserLogin() {
    const currentUser = localStorage.getItem('current_user');
    const userProfile = document.getElementById('user-profile');
    const authLinks = document.querySelector('.auth-links');
    const adminBtn = document.getElementById('admin-btn');
    const userNameDisplay = document.getElementById('user-name-display');

    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (userProfile) {
            userProfile.style.display = 'inline-block';
            if (userNameDisplay) {
                userNameDisplay.textContent = user.name;
            }
        }
        // Hide login/signup buttons
        if (authLinks) {
            const loginBtn = authLinks.querySelector('.btn-login');
            const signupBtn = authLinks.querySelector('.btn-signup');
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
        }
        // Hide admin button when user is logged in
        if (adminBtn) {
            adminBtn.style.display = 'none';
        }
    } else {
        if (userProfile) {
            userProfile.style.display = 'none';
        }
        // Show admin button only if NO user is logged in
        if (adminBtn) {
            adminBtn.style.display = 'block';
        }
    }
}

// Show user menu
function showUserMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    const dropdown = document.getElementById('user-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('user-dropdown');
    const userProfile = document.getElementById('user-profile');
    if (dropdown && userProfile && !userProfile.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

// Logout
function logout() {
    localStorage.removeItem('current_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Check admin password
function checkAdminPassword(event) {
    event.preventDefault();
    
    const adminPassword = prompt('Enter Admin Password:');
    
    if (adminPassword === 'moheidin2015') {
        window.location.href = 'admin-login.html';
    } else if (adminPassword !== null) {
        alert('Incorrect password! Access denied.');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
    initializeProducts();
    loadProducts('all');
    checkUserLogin(); // This will show/hide admin button based on login status

    // Setup filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
});
