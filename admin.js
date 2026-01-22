// Check admin login
function checkAdminLogin() {
    const currentAdmin = localStorage.getItem('current_admin');
    if (!currentAdmin) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    const admin = JSON.parse(currentAdmin);
    const adminName = document.getElementById('admin-name');
    if (adminName) {
        adminName.textContent = 'Admin: ' + admin.email;
    }
    
    loadProductsList();
    updateDashboard();
}

// Admin logout
function adminLogout() {
    localStorage.removeItem('current_admin');
    window.location.href = 'admin-login.html';
}

// Show admin section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    // Add active class to clicked menu item
    event.target.classList.add('active');
    
    // Load data based on section
    if (sectionId === 'manage-products') {
        loadProductsList();
    } else if (sectionId === 'edit-product') {
        loadEditProductDropdown();
    }
}

// Update dashboard
function updateDashboard() {
    const products = JSON.parse(localStorage.getItem('techhub_products') || '[]');
    const users = JSON.parse(localStorage.getItem('techhub_users') || '[]');
    
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-users').textContent = users.length;
}

// Add product
document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('product-name').value;
            const category = document.getElementById('product-category').value;
            const price = parseFloat(document.getElementById('product-price').value);
            const description = document.getElementById('product-description').value;
            const image = document.getElementById('product-image').value;
            const stock = parseInt(document.getElementById('product-stock').value);
            
            if (!name || !category || !price) {
                showMessage('add-product-message', 'Please fill in all required fields!', 'error');
                return;
            }
            
            const products = JSON.parse(localStorage.getItem('techhub_products') || '[]');
            
            const newProduct = {
                id: Date.now(),
                name,
                category,
                price,
                description,
                image: image || '📦',
                stock
            };
            
            products.push(newProduct);
            localStorage.setItem('techhub_products', JSON.stringify(products));
            
            showMessage('add-product-message', 'Product added successfully!', 'success');
            addProductForm.reset();
            updateDashboard();
            
            // Clear message after 3 seconds
            setTimeout(() => {
                document.getElementById('add-product-message').textContent = '';
            }, 3000);
        });
    }

    // Edit product form
    const editProductForm = document.getElementById('edit-product-form');
    if (editProductForm) {
        editProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productId = parseInt(document.getElementById('edit-product-id').value);
            
            if (!productId) {
                showMessage('edit-product-message', 'Please select a product!', 'error');
                return;
            }
            
            const name = document.getElementById('edit-product-name').value;
            const category = document.getElementById('edit-product-category').value;
            const price = parseFloat(document.getElementById('edit-product-price').value);
            const description = document.getElementById('edit-product-description').value;
            const image = document.getElementById('edit-product-image').value;
            const stock = parseInt(document.getElementById('edit-product-stock').value);
            
            const products = JSON.parse(localStorage.getItem('techhub_products') || '[]');
            const productIndex = products.findIndex(p => p.id === productId);
            
            if (productIndex === -1) {
                showMessage('edit-product-message', 'Product not found!', 'error');
                return;
            }
            
            products[productIndex] = {
                ...products[productIndex],
                name,
                category,
                price,
                description,
                image: image || products[productIndex].image,
                stock
            };
            
            localStorage.setItem('techhub_products', JSON.stringify(products));
            showMessage('edit-product-message', 'Product updated successfully!', 'success');
            updateDashboard();
            
            setTimeout(() => {
                document.getElementById('edit-product-message').textContent = '';
                loadProductsList();
            }, 2000);
        });
    }

    // Search functionality
    const searchInput = document.getElementById('search-products');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            filterProductsList(this.value);
        });
    }

    checkAdminLogin();
});

// Load products list
function loadProductsList() {
    const tbody = document.getElementById('products-tbody');
    if (!tbody) return;
    
    const products = JSON.parse(localStorage.getItem('techhub_products') || '[]');
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No products found</td></tr>';
        return;
    }
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn-edit" onclick="selectProductForEdit(${product.id})">Edit</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Filter products list
function filterProductsList(searchTerm) {
    const tbody = document.getElementById('products-tbody');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('techhub_products') || '[]');
    const filteredProducts = products.filter(p => p.id !== productId);
    
    localStorage.setItem('techhub_products', JSON.stringify(filteredProducts));
    loadProductsList();
    updateDashboard();
    alert('Product deleted successfully!');
}

// Load edit product dropdown
function loadEditProductDropdown() {
    const select = document.getElementById('edit-product-id');
    if (!select) return;
    
    const products = JSON.parse(localStorage.getItem('techhub_products') || '[]');
    
    // Clear existing options
    const options = select.querySelectorAll('option:not(:first-child)');
    options.forEach(option => option.remove());
    
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        select.appendChild(option);
    });
}

// Select product for edit
function selectProductForEdit(productId) {
    showSection('edit-product');
    document.getElementById('edit-product-id').value = productId;
    loadProductForEdit();
}

// Load product for edit
function loadProductForEdit() {
    const productId = parseInt(document.getElementById('edit-product-id').value);
    
    if (!productId) {
        document.getElementById('edit-form-container').style.display = 'none';
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('techhub_products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found!');
        return;
    }
    
    // Populate form fields
    document.getElementById('edit-product-name').value = product.name;
    document.getElementById('edit-product-category').value = product.category;
    document.getElementById('edit-product-price').value = product.price;
    document.getElementById('edit-product-description').value = product.description;
    document.getElementById('edit-product-image').value = product.image;
    document.getElementById('edit-product-stock').value = product.stock;
    
    // Show form container
    document.getElementById('edit-form-container').style.display = 'block';
}

// Delete current product
function deleteCurrentProduct() {
    const productId = parseInt(document.getElementById('edit-product-id').value);
    
    if (!productId) {
        alert('Please select a product!');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    deleteProduct(productId);
    document.getElementById('edit-product-id').value = '';
    document.getElementById('edit-form-container').style.display = 'none';
    alert('Product deleted successfully!');
}

// Show message
function showMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = 'message ' + type;
    }
}
