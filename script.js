// --- INITIAL DATA & STORAGE MANAGEMENT ---
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: '1',
        title: 'IPhone 17 Pro Max',
        desc: 'Layar 120Hz Super Retina XDR, Chipset A17 Pro, RAM 8GB, Titanium Design. Garansi Resmi.',
        price: 'Rp 22.000.000',
        img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
        video: 'iphone2.mp4',
        rating: 5,
        comments: ['Barang original dan pengiriman cepat!', 'Kualitas kamera luar biasa.']
    }
];

let orders = JSON.parse(localStorage.getItem('orders')) || [
    {
        id: '#GDG-247715',
        user: 'rea',
        phone: '0856332524823',
        email: 'aza@gmail.com',
        address: 'Jl. Rowosari ll, Semarang Jawa Tengah Indonesia',
        item: 'iPhone 17 Pro Max (Inc. Ongkir Rp 5.000)',
        total: 'Rp 22.004.000 (COD)',
        status: 'Dikemas'
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveData() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// --- AUTHENTICATION SYSTEM ---
function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value.trim();

    if (user === 'meila' && pass === 'meila123') {
        currentUser = { username: 'meila', role: 'admin' };
    } else {
        currentUser = { username: user, role: 'customer' };
    }

    saveData();
    initApp();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    initApp();
}

// --- APP INITIALIZATION ---
function initApp() {
    const header = document.getElementById('main-header');
    const bottomNav = document.getElementById('bottom-nav');
    const viewLogin = document.getElementById('view-login');
    const viewAdminPanel = document.getElementById('view-admin-panel');

    if (!currentUser) {
        // Show Login Screen Only
        header.classList.add('hidden');
        bottomNav.classList.add('hidden');
        viewLogin.classList.remove('hidden');
        viewAdminPanel.classList.add('hidden');
        hideAllViews();
    } else {
        // User Logged In
        header.classList.remove('hidden');
        bottomNav.classList.remove('hidden');
        viewLogin.classList.add('hidden');

        document.getElementById('user-role-badge').innerText = currentUser.role.toUpperCase();
        document.getElementById('prof-username').innerText = currentUser.username;
        document.getElementById('prof-role').innerText = currentUser.role.toUpperCase();

        if (currentUser.role === 'admin') {
            viewAdminPanel.classList.remove('hidden');
        } else {
            viewAdminPanel.classList.add('hidden');
        }

        switchTab('home');
    }
}

function hideAllViews() {
    ['view-home', 'view-cart', 'view-profile', 'view-orders'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
}

function switchTab(tabName) {
    if (!currentUser) return;
    hideAllViews();

    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`nav-${tabName}`).classList.add('active');

    document.getElementById(`view-${tabName}`).classList.remove('hidden');

    if (tabName === 'home') renderProducts();
    if (tabName === 'cart') renderCart();
    if (tabName === 'orders') renderOrders();
}

// --- PRODUCT MANAGEMENT (ADMIN & PRODUCT RENDER) ---
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // Media: Image or Video
        let mediaHTML = p.img ? `<img src="${p.img}" class="product-media" alt="${p.title}">` : '';
        let videoHTML = p.video ? `<video src="${p.video}" class="product-media" controls></video>` : '';

        // Actions based on Role
        let actionsHTML = '';
        if (currentUser && currentUser.role === 'admin') {
            actionsHTML = `
                <div class="admin-actions">
                    <button class="btn-action btn-edit" onclick="editProduct('${p.id}')"><i class="fa-solid fa-pen-to-square"></i> Edit Barang</button>
                    <button class="btn-action btn-delete" onclick="deleteProduct('${p.id}')"><i class="fa-solid fa-trash"></i> Hapus</button>
                </div>
            `;
        } else {
            actionsHTML = `
                <div class="buyer-actions">
                    <button class="btn-action btn-cart" onclick="addToCart('${p.id}')"><i class="fa-solid fa-cart-plus"></i> Keranjang</button>
                    <button class="btn-action btn-buy" onclick="buyNow('${p.id}')">Beli Sekarang</button>
                </div>
            `;
        }

        // Comments List
        let commentsHTML = p.comments.map(c => `<div class="comment-item"><i class="fa-regular fa-comment"></i> ${c}</div>`).join('');

        card.innerHTML = `
            ${mediaHTML}
            ${videoHTML}
            <div class="product-info">
                <div class="product-title">${p.title}</div>
                <div class="product-price">${p.price}</div>
                <div class="product-desc">${p.desc}</div>
                <div class="rating-box">
                    <i class="fa-solid fa-star"></i> ${p.rating}.0 | Komentar & Rating
                </div>
                <div class="comments-section">
                    <strong>Ulasan Pembeli:</strong>
                    ${commentsHTML}
                    <div style="margin-top:5px; display:flex; gap:5px;">
                        <input type="text" id="comment-input-${p.id}" class="form-control" style="font-size:0.75rem; padding:4px;" placeholder="Tulis komentar...">
                        <button onclick="addComment('${p.id}')" style="background:var(--primary); color:white; border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem;"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
                ${actionsHTML}
            </div>
        `;
        grid.appendChild(card);
    });
}

// Save / Edit Product
function saveProduct(e) {
    e.preventDefault();
    const editId = document.getElementById('edit-product-id').value;
    const title = document.getElementById('prod-title').value;
    const desc = document.getElementById('prod-desc').value;
    const imgFile = document.getElementById('prod-img-file').files[0];
    const videoFile = document.getElementById('prod-video-file').files[0];

    let imgData = editId ? (products.find(p => p.id === editId)?.img || '') : '';
    let videoData = editId ? (products.find(p => p.id === editId)?.video || '') : '';

    const processSave = () => {
        if (editId) {
            const index = products.findIndex(p => p.id === editId);
            if (index !== -1) {
                products[index].title = title;
                products[index].desc = desc;
                if (imgData) products[index].img = imgData;
                if (videoData) products[index].video = videoData;
            }
        } else {
            products.push({
                id: Date.now().toString(),
                title: title,
                desc: desc,
                price: 'Rp ' + (Math.floor(Math.random() * 50) + 5) * 100000,
                img: imgData || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
                video: videoData,
                rating: 5,
                comments: ['Produk baru ditambahkan!']
            });
        }
        saveData();
        renderProducts();
        document.getElementById('product-form').reset();
        document.getElementById('edit-product-id').value = '';
        alert('Produk berhasil disimpan!');
    };

    // Convert File to Base64 (Data URL) for Persistence
    let filesToRead = 0;
    let filesRead = 0;

    if (imgFile) filesToRead++;
    if (videoFile) filesToRead++;

    if (filesToRead === 0) {
        processSave();
        return;
    }

    if (imgFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imgData = e.target.result;
            filesRead++;
            if (filesRead === filesToRead) processSave();
        };
        reader.readAsDataURL(imgFile);
    }

    if (videoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            videoData = e.target.result;
            filesRead++;
            if (filesRead === filesToRead) processSave();
        };
        reader.readAsDataURL(videoFile);
    }
}

function editProduct(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;
    document.getElementById('edit-product-id').value = p.id;
    document.getElementById('prod-title').value = p.title;
    document.getElementById('prod-desc').value = p.desc;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteProduct(id) {
    if (confirm('Yakin ingin menghapus barang ini?')) {
        products = products.filter(p => p.id !== id);
        saveData();
        renderProducts();
    }
}

function addComment(prodId) {
    const input = document.getElementById(`comment-input-${prodId}`);
    if (!input.value.trim()) return;
    const p = products.find(prod => prod.id === prodId);
    if (p) {
        p.comments.push(currentUser.username + ': ' + input.value.trim());
        saveData();
        renderProducts();
    }
}

// --- SHOPPING & TRANSACTIONS ---
function addToCart(id) {
    const p = products.find(prod => prod.id === id);
    if (p) {
        cart.push(p);
        saveData();
        alert('Produk berhasil ditambahkan ke keranjang!');
    }
}

function renderCart() {
    const container = document.getElementById('cart-list');
    const totalBox = document.getElementById('cart-total');
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p style="color:#777;">Keranjang belanja Anda kosong.</p>';
        totalBox.innerText = '';
        return;
    }

    cart.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'order-card';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong>${item.title}</strong>
                    <p style="color:var(--accent); font-weight:bold;">${item.price}</p>
                </div>
                <button class="btn-action btn-delete" style="max-width:80px;" onclick="removeFromCart(${idx})">Hapus</button>
            </div>
        `;
        container.appendChild(div);
    });

    totalBox.innerHTML = `Total Item: ${cart.length} Barang <br><button onclick="checkoutCart()" class="btn-primary" style="margin-top:10px;">Proses Checkout</button>`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveData();
    renderCart();
}

function buyNow(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    const newOrder = {
        id: '#AZR-' + Math.floor(100000 + Math.random() * 900000),
        user: currentUser.username,
        phone: '0856332524823',
        email: currentUser.username.includes('@') ? currentUser.username : currentUser.username + '@gmail.com',
        address: 'Jl. Mangkang Kulon, Semarang, Jawa Tengah, Indonesia',
        item: `${p.title} (Inc. Ongkir Rp 5.000)`,
        total: `${p.price} (COD)`,
        status: 'Dikemas'
    };

    orders.unshift(newOrder);
    saveData();
    alert('Pesanan berhasil dibuat! Silakan cek menu Pesanan.');
    switchTab('orders');
}

function checkoutCart() {
    if (cart.length === 0) return;
    cart.forEach(p => {
        orders.unshift({
            id: '#AZR-' + Math.floor(100000 + Math.random() * 900000),
            user: currentUser.username,
            phone: '0856332524823',
            email: currentUser.username + '@gmail.com',
            address: 'Jl. Mangkang Kulon, Semarang, Jawa Tengah, Indonesia',
            item: `${p.title} (Inc. Ongkir Rp 5.000)`,
            total: `${p.price} (COD)`,
            status: 'Dikemas'
        });
    });
    cart = [];
    saveData();
    alert('Semua pesanan berhasil dibuat!');
    switchTab('orders');
}

// --- ORDER STATUS & SHIPMENT REPORT ---
function renderOrders() {
    const adminContainer = document.getElementById('admin-orders-list');
    const buyerContainer = document.getElementById('buyer-orders-list');

    if (adminContainer) adminContainer.innerHTML = '';
    if (buyerContainer) buyerContainer.innerHTML = '';

    if (orders.length === 0) {
        const emptyHTML = '<p style="color:#777;">Belum ada pesanan aktif.</p>';
        if (adminContainer) adminContainer.innerHTML = emptyHTML;
        if (buyerContainer) buyerContainer.innerHTML = emptyHTML;
        return;
    }

    orders.forEach((o, index) => {
        const card = document.createElement('div');
        card.className = 'order-card';

        card.innerHTML = `
            <div class="order-header">
                <strong>${o.id}</strong>
                <span class="order-status-badge"><i class="fa-solid fa-box"></i> ${o.status}</span>
            </div>
            <div class="order-details">
                <p><b>Pemesanan Oleh:</b> ${o.user} (${o.phone})</p>
                <p><b>Email:</b> ${o.email}</p>
                <p><b>Alamat Pengiriman:</b> ${o.address}</p>
                <p><b>Produk:</b> ${o.item}</p>
                <p style="font-size:1rem; font-weight:bold; color:var(--text-dark); margin-top:5px;"><b>Total:</b> ${o.total}</p>
            </div>
            ${currentUser && currentUser.role === 'admin' ? `
                <div style="margin-top:10px; display:flex; gap:5px; align-items:center;">
                    <label style="font-size:0.8rem;">Update Status:</label>
                    <select onchange="updateOrderStatus(${index}, this.value)" style="padding:4px; border-radius:4px;">
                        <option value="Belum Dibayar" ${o.status === 'Belum Dibayar' ? 'selected' : ''}>Belum Dibayar</option>
                        <option value="Dikemas" ${o.status === 'Dikemas' ? 'selected' : ''}>Dikemas</option>
                        <option value="Dikirim" ${o.status === 'Dikirim' ? 'selected' : ''}>Dikirim</option>
                        <option value="Selesai" ${o.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                    </select>
                </div>
            ` : ''}
        `;

        if (currentUser.role === 'admin' && adminContainer) {
            adminContainer.appendChild(card.cloneNode(true));
        }
        if (buyerContainer) {
            buyerContainer.appendChild(card);
        }
    });
}

function updateOrderStatus(index, newStatus) {
    orders[index].status = newStatus;
    saveData();
    renderOrders();
}

function clearOrderHistory() {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat pesanan?')) {
        orders = [];
        saveData();
        renderOrders();
    }
}

// Run on Page Load
window.onload = initApp;