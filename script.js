// Dark Mode Toggle
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark').toString());
}

// Initialize dark mode based on saved preference
function initializeDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
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
        grid.innerHTML = '<p class="col-span-full text-center text-gray-500 py-12">No products found.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer';
        card.onclick = function() { window.location.href = `product.html?id=${product.id}`; };
        card.innerHTML = `
            <div class="h-48 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-6xl">${product.image || '📦'}</div>
            <div class="p-5">
                <h3 class="font-bold text-lg mb-1 text-gray-900 dark:text-white">${product.name}</h3>
                <p class="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white mb-2">$${product.price.toFixed(2)}</p>
                <p class="text-sm text-gray-500 mb-3 line-clamp-2">${product.description}</p>
                <p class="text-xs text-gray-400 mb-4">Stock: ${product.stock} units</p>
                <button onclick="event.stopPropagation(); addToCart(${product.id})" class="w-full py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium rounded-xl shadow-lg shadow-primary-500/25 transition-all flex items-center justify-center gap-2 text-sm">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
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
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const adminNavLink = document.getElementById('admin-nav-link');
    const adminDropdownLink = document.getElementById('admin-dropdown-link');
    const adminMobileLink = document.getElementById('admin-mobile-link');
    const mobileLoginBtn = document.getElementById('mobile-login-btn');
    const mobileSignupBtn = document.getElementById('mobile-signup-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    const userNameDisplay = document.getElementById('user-name-display');

    if (currentUser) {
        const user = JSON.parse(currentUser);
        // Show user profile and logout
        if (userProfile) {
            userProfile.classList.remove('hidden');
            if (userNameDisplay) {
                userNameDisplay.textContent = user.name;
            }
        }
        if (loginBtn) loginBtn.classList.add('hidden');
        if (signupBtn) signupBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (mobileLoginBtn) mobileLoginBtn.classList.add('hidden');
        if (mobileSignupBtn) mobileSignupBtn.classList.add('hidden');
        if (mobileLogoutBtn) mobileLogoutBtn.classList.remove('hidden');
        
        // Show admin links if user is admin
        if (user.is_admin || user.isAdmin) {
            if (adminNavLink) adminNavLink.classList.remove('hidden');
            if (adminDropdownLink) adminDropdownLink.classList.remove('hidden');
            if (adminMobileLink) adminMobileLink.classList.remove('hidden');
        } else {
            if (adminNavLink) adminNavLink.classList.add('hidden');
            if (adminDropdownLink) adminDropdownLink.classList.add('hidden');
            if (adminMobileLink) adminMobileLink.classList.add('hidden');
        }
    } else {
        // Show login/signup, hide user elements
        if (userProfile) userProfile.classList.add('hidden');
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (signupBtn) signupBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (mobileLoginBtn) mobileLoginBtn.classList.remove('hidden');
        if (mobileSignupBtn) mobileSignupBtn.classList.remove('hidden');
        if (mobileLogoutBtn) mobileLogoutBtn.classList.add('hidden');
        if (adminNavLink) adminNavLink.classList.add('hidden');
        if (adminDropdownLink) adminDropdownLink.classList.add('hidden');
        if (adminMobileLink) adminMobileLink.classList.add('hidden');
    }
}

// Show user menu
function showUserMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    const dropdown = document.getElementById('user-dropdown');
    dropdown.classList.toggle('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('user-dropdown');
    const userProfile = document.getElementById('user-profile');
    if (dropdown && userProfile && !userProfile.contains(event.target)) {
        dropdown.classList.add('hidden');
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
    checkUserLogin();
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}
