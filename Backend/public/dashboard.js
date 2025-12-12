const API_URL = 'http://localhost:5000/api';
let currentProducts = [];
let currentOrders = [];

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login first!');
        window.location.href = '/index.html';
        return;
    }
    
    loadUserInfo();
    loadProducts();
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Navigation tabs
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Add product button
    document.getElementById('addProductBtn').addEventListener('click', openAddProductModal);

    // Modal close button
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);

    // Product form submit
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);

    // Image URL preview
    document.getElementById('productImageUrl').addEventListener('input', previewImage);

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('productModal');
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Load user information
async function loadUserInfo() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        });

        if (response.ok) {
            const user = await response.json();
            document.getElementById('adminName').textContent = user.name;
        } else {
            logout();
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

// Switch between tabs
function switchTab(tabName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    // Update page title
    const titles = {
        'products': 'Products Management',
        'orders': 'Orders Management',
        'stats': 'Statistics Dashboard'
    };
    document.getElementById('pageTitle').textContent = titles[tabName];

    // Load data for the tab
    if (tabName === 'orders') {
        loadOrders();
    } else if (tabName === 'stats') {
        loadStats();
    }
}

// Load all products
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        currentProducts = products;
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        displayEmptyState('productsGrid', '❌ Failed to load products. Please refresh the page.');
    }
}

// Display products in grid
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        displayEmptyState('productsGrid', '📦 No products yet. Click "Add New Product" to get started!');
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.imageUrl}" 
                 alt="${product.name}" 
                 class="product-image" 
                 onerror="this.src='https://via.placeholder.com/300x220/7f1d1d/ffffff?text=No+Image'">
            <div class="product-card-content">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-info">
                    <span class="product-price">₦${Number(product.price).toLocaleString()}</span>
                    <span class="product-category">${product.category}</span>
                </div>
                <div class="product-meta">
                    <div>📦 Stock: ${product.stock} units</div>
                    <div>📏 Sizes: ${Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes}</div>
                </div>
                <div class="product-actions">
                    <button class="btn-edit" onclick="editProduct('${product.id}')">✏️ Edit</button>
                    <button class="btn-danger" onclick="deleteProduct('${product.id}')">🗑️ Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load all orders
async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        });
        
        if (response.ok) {
            const orders = await response.json();
            currentOrders = orders;
            displayOrders(orders);
        } else {
            displayEmptyState('ordersList', '❌ Failed to load orders');
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        displayEmptyState('ordersList', '❌ Failed to load orders. Please refresh the page.');
    }
}

// Display orders
function displayOrders(orders) {
    const list = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        displayEmptyState('ordersList', '🛒 No orders yet. Waiting for customers!');
        return;
    }

    list.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-status status-${order.status}">${order.status}</span>
            </div>
            <div class="order-details">
                <div><strong>Customer:</strong> ${order.customerName}</div>
                <div><strong>Email:</strong> ${order.email}</div>
                <div><strong>Phone:</strong> ${order.phone}</div>
                <div><strong>Total:</strong> ₦${Number(order.totalAmount).toLocaleString()}</div>
                <div><strong>Items:</strong> ${order.items.length} item(s)</div>
                <div><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</div>
            </div>
            <div style="margin-top: 15px;">
                <button class="btn-edit" onclick="updateOrderStatus('${order.id}', 'completed')">
                    ✅ Mark Complete
                </button>
                <button class="btn-danger" onclick="updateOrderStatus('${order.id}', 'cancelled')">
                    ❌ Cancel Order
                </button>
            </div>
        </div>
    `).join('');
}

// Load statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/orders/stats/summary`, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        });
        
        if (response.ok) {
            const stats = await response.json();
            displayStats(stats);
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Display statistics
function displayStats(stats) {
    const grid = document.getElementById('statsGrid');
    grid.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${stats.totalOrders || 0}</div>
            <div class="stat-label">📊 Total Orders</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.pendingOrders || 0}</div>
            <div class="stat-label">⏳ Pending Orders</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.completedOrders || 0}</div>
            <div class="stat-label">✅ Completed</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">₦${Number(stats.totalRevenue || 0).toLocaleString()}</div>
            <div class="stat-label">💰 Total Revenue</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${currentProducts.length}</div>
            <div class="stat-label">📦 Total Products</div>
        </div>
    `;
}

// Open add product modal
function openAddProductModal() {
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('productModal').classList.add('show');
}

// Edit product
function editProduct(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productSizes').value = Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes;
    document.getElementById('productImageUrl').value = product.imageUrl;
    
    // Show image preview
    previewImage();
    
    document.getElementById('productModal').classList.add('show');
}

// Handle product form submission
async function handleProductSubmit(e) {
    e.preventDefault();

    const productId = document.getElementById('productId').value;
    const sizesValue = document.getElementById('productSizes').value;
    
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        stock: parseInt(document.getElementById('productStock').value),
        sizes: sizesValue.split(',').map(s => s.trim()).filter(s => s),
        imageUrl: document.getElementById('productImageUrl').value
    };

    try {
        const url = productId ? `${API_URL}/products/${productId}` : `${API_URL}/products`;
        const method = productId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            alert(productId ? '✅ Product updated successfully!' : '✅ Product added successfully!');
            closeModal();
            loadProducts();
        } else {
            const error = await response.json();
            alert('❌ Error: ' + (error.message || 'Failed to save product'));
        }
    } catch (error) {
        console.error('Error saving product:', error);
        alert('❌ Error saving product. Please check your connection.');
    }
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        });

        if (response.ok) {
            alert('✅ Product deleted successfully!');
            loadProducts();
        } else {
            alert('❌ Error deleting product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('❌ Error deleting product. Please check your connection.');
    }
}

// Update order status
async function updateOrderStatus(orderId, status) {
    const confirmMessage = status === 'completed' 
        ? 'Mark this order as completed?' 
        : 'Cancel this order?';
    
    if (!confirm(confirmMessage)) return;

    try {
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            alert('✅ Order status updated!');
            loadOrders();
        } else {
            alert('❌ Error updating order status');
        }
    } catch (error) {
        console.error('Error updating order:', error);
        alert('❌ Error updating order. Please check your connection.');
    }
}

// Preview image from URL
function previewImage() {
    const imageUrl = document.getElementById('productImageUrl').value;
    const preview = document.getElementById('imagePreview');
    
    if (imageUrl) {
        preview.innerHTML = `<img src="${imageUrl}" onerror="this.style.display='none'" alt="Preview">`;
    } else {
        preview.innerHTML = '';
    }
}

// Close modal
function closeModal() {
    document.getElementById('productModal').classList.remove('show');
}

// Display empty state
function displayEmptyState(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = `
        <div class="empty-state">
            <h3>📭</h3>
            <p>${message}</p>
        </div>
    `;
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    }
}