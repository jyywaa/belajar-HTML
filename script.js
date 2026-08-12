// Data Default Awal
const defaultProducts = [
    {
        id: 101,
        name: "Oppo A6 Pro",
        price: 15000000,
        desc: "Layar 120Hz OLED, RAM 12GB, Storage 256GB, Chipset Super Kencang.",
        image: "Oppo.jpeg",
        video: "1.mp4",
        rating: 4.9,
        sold: 142,
        bestseller: true
    },
    {
        id: 102,
        name: "Laptop Ultra Book Pro",
        price: 22500000,
        desc: "Processor Core i9, RAM 32GB, SSD 1TB, Baterai Tahan 18 Jam.",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        rating: 4.8,
        sold: 89,
        bestseller: true
    }
];

// State Aplikasi
let state = {
    user: JSON.parse(localStorage.getItem('app_user')) || null,
    products: JSON.parse(localStorage.getItem('app_products')) || defaultProducts,
    cart: JSON.parse(localStorage.getItem('app_cart')) || [],
    orders: JSON.parse(localStorage.getItem('app_orders')) || [],
    wizardStep: 1
};

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    checkOnboarding();
    renderProducts();
    updateUI();
});

function saveState() {
    localStorage.setItem('app_user', JSON.stringify(state.user));
    localStorage.setItem('app_products', JSON.stringify(state.products));
    localStorage.setItem('app_cart', JSON.stringify(state.cart));
    localStorage.setItem('app_orders', JSON.stringify(state.orders));
    updateUI();
}

// Toast Notifikasi
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Format Rupiah
function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString('id-ID');
}

// Navigasi Tab Single Page
function switchTab(tabName, el) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

    document.getElementById(`view-${tabName}`).classList.add('active');
    if (el) el.classList.add('active');
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// Onboarding & Autentikasi (Penanganan Agar Tidak Stuck)
function checkOnboarding() {
    if (!state.user) {
        document.getElementById('modal-onboarding').classList.add('active');
    } else {
        document.getElementById('modal-onboarding').classList.remove('active');
        document.getElementById('user-header-name').innerText = state.user.username;
        document.getElementById('profile-username').innerText = state.user.username;
        document.getElementById('profile-email').innerText = state.user.email || 'aza@gmail.com';
        document.getElementById('profile-phone').innerText = state.user.phone || '08123456789';
        
        const addressEl = document.getElementById('profile-address');
        if (addressEl) {
            addressEl.innerText = state.user.address || 'Jl. Mangkang Kulon SMK Texmaco Semarang Jawa Tengah Indonesia';
        }

        // Auto fills alamat di form keranjang
        const cartAddressInput = document.getElementById('cart-address');
        if (cartAddressInput && !cartAddressInput.value) {
            cartAddressInput.value = state.user.address || 'Jl. Mangkang Kulon SMK Texmaco Semarang Jawa Tengah Indonesia';
        }

        const roleTag = document.getElementById('profile-role-tag');

        // Cek Login Khusus Admin (Username: meila, Pass: meila123)
        if (state.user.role === 'admin') {
            document.getElementById('admin-panel').style.display = 'block';
            document.getElementById('admin-divider').style.display = 'block';
            roleTag.innerText = "Administrator";
            roleTag.style.background = "#ff4d4d";
            roleTag.style.color = "#fff";
        } else {
            document.getElementById('admin-panel').style.display = 'none';
            document.getElementById('admin-divider').style.display = 'none';
            roleTag.innerText = "Customer Member";
            roleTag.style.background = "var(--accent)";
            roleTag.style.color = "#000";
        }
    }
}

function handleWizardStep(e) {
    e.preventDefault();
    if (state.wizardStep === 1) {
        state.wizardStep = 2;
        document.getElementById('wizard-step-1').style.display = 'none';
        document.getElementById('wizard-step-2').style.display = 'block';
        document.getElementById('wizard-subtitle').innerText = "Langkah 2 dari 3: Buat Akun Anda";
        document.getElementById('wiz-username').required = true;
        document.getElementById('wiz-password').required = true;
    } else if (state.wizardStep === 2) {
        state.wizardStep = 3;
        document.getElementById('wizard-step-2').style.display = 'none';
        document.getElementById('wizard-step-3').style.display = 'block';
        document.getElementById('wizard-subtitle').innerText = "Langkah 3 dari 3: Nomor Kontak & Alamat";
        document.getElementById('wiz-phone').required = true;
        document.getElementById('wiz-btn-next').innerText = "Selesai & Belanja";
    } else if (state.wizardStep === 3) {
        const email = document.getElementById('wiz-email').value;
        const username = document.getElementById('wiz-username').value;
        const pass = document.getElementById('wiz-password').value;
        const phone = document.getElementById('wiz-phone').value;
        const address = document.getElementById('wiz-address').value || 'Jl. Mangkang Kulon SMK Texmaco Semarang Jawa Tengah Indonesia';

        // Logika Admin
        let role = "customer";
        if (username === "meila" && pass === "meila123") {
            role = "admin";
        }

        state.user = { email, username, phone, address, role };
        saveState();
        showToast(`Selamat datang, ${state.user.username}!`);
        checkOnboarding();
    }
}

function confirmLogout() {
    state.user = null;
    state.wizardStep = 1;
    localStorage.removeItem('app_user');
    location.reload();
}

// Handling Upload Media & Simpan Produk Admin
function handleAdminSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('admin-name').value;
    const desc = document.getElementById('admin-desc').value;
    const price = parseInt(document.getElementById('admin-price').value);

    const imgFile = document.getElementById('admin-image-file').files[0];
    const videoFile = document.getElementById('admin-video-file').files[0];

    if (!imgFile) {
        showToast("⚠️ Silakan upload gambar produk!");
        return;
    }

    // Convert file Gambar ke Base64
    const readerImg = new FileReader();
    readerImg.onload = function(eImg) {
        const imgBase64 = eImg.target.result;

        const processSave = (videoBase64 = "") => {
            const newProd = {
                id: Date.now(),
                name: name,
                price: price,
                desc: desc,
                image: imgBase64,
                video: videoBase64,
                rating: 5.0,
                sold: 0,
                bestseller: false
            };

            state.products.unshift(newProd);
            saveState();
            renderProducts();
            document.getElementById('admin-form').reset();
            showToast("✅ Produk berhasil disimpan ke Database!");
        };

        // Convert Video ke Base64 jika ada
        if (videoFile) {
            const readerVideo = new FileReader();
            readerVideo.onload = function(eVideo) {
                processSave(eVideo.target.result);
            };
            readerVideo.readAsDataURL(videoFile);
        } else {
            processSave("");
        }
    };

    readerImg.readAsDataURL(imgFile);
}

// Render Katalog Produk (Termasuk Gambar & Video Demo)
function renderProducts() {
    const bestsellerContainer = document.getElementById('bestseller-list');
    const gridContainer = document.getElementById('product-grid');

    bestsellerContainer.innerHTML = '';
    gridContainer.innerHTML = '';

    state.products.forEach(p => {
        const videoHtml = p.video ? `
            <video class="product-video" controls muted poster="${p.image}">
                <source src="${p.video}">
            </video>` : '';

        const productHtml = `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Gambar+Produk'">
                <div class="product-info">
                    <div class="product-title">${p.name}</div>
                    <div class="product-price">${formatRupiah(p.price)}</div>
                    <div class="product-desc">${p.desc}</div>
                    ${videoHtml}
                    <div class="product-meta">
                        <span>⭐ ${p.rating}</span>
                        <span>Terjual ${p.sold}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-outline" onclick="addToCart(${p.id})">+ Cart</button>
                        <button class="btn btn-accent" onclick="openDetail(${p.id})">Beli</button>
                    </div>
                </div>
            </div>
        `;

        gridContainer.innerHTML += productHtml;

        if (p.bestseller) {
            bestsellerContainer.innerHTML += `
                <div class="scroll-item">
                    <img src="${p.image}" style="width:100%; height:75px; object-fit:cover; border-radius:6px;" onerror="this.src='https://via.placeholder.com/150'">
                    <div class="product-title" style="margin-top:4px;">${p.name}</div>
                    <div style="font-size:11px; color:var(--accent); font-weight:bold;">${formatRupiah(p.price)}</div>
                    <button class="btn btn-accent" style="font-size:10px; padding:4px; margin-top:4px;" onclick="openDetail(${p.id})">Lihat</button>
                </div>
            `;
        }
    });
}

// Open Detail View Modal
function openDetail(id) {
    const p = state.products.find(item => item.id === id);
    if (!p) return;

    const videoHtml = p.video ? `
        <div style="margin-top:12px;">
            <label style="font-size:12px; color:var(--text-muted); display:block; margin-bottom:4px;">Video Demonstration:</label>
            <video controls style="width:100%; border-radius:8px;" poster="${p.image}">
                <source src="${p.video}">
            </video>
        </div>` : '';

    const content = `
        <img src="${p.image}" style="width:100%; height:200px; object-fit:cover; border-radius:10px;" onerror="this.src='https://via.placeholder.com/400x200'">
        <h2 style="font-size:16px; margin-top:12px;">${p.name}</h2>
        <div style="font-size:18px; font-weight:bold; color:var(--accent); margin:6px 0;">${formatRupiah(p.price)}</div>
        <p style="font-size:12px; color:var(--text-muted); line-height:1.5;">${p.desc}</p>
        ${videoHtml}
        <div style="display:flex; gap:8px; margin-top:16px;">
            <button class="btn btn-outline" onclick="addToCart(${p.id}); closeModal('modal-detail');">+ Keranjang</button>
            <a href="#" class="btn btn-accent" style="text-align:center; text-decoration:none;" onclick="directCheckout(${p.id})">Beli Sekarang</a>
        </div>
    `;

    document.getElementById('detail-content').innerHTML = content;
    openModal('modal-detail');
}

// Cart & Transaksi
function addToCart(id) {
    const p = state.products.find(item => item.id === id);
    if (!p) return;

    const existing = state.cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        state.cart.push({ ...p, qty: 1 });
    }

    saveState();
    showToast("🛒 Masuk Keranjang!");
}

function updateUI() {
    // Badge Cart Count
    const totalQty = state.cart.reduce((sum, i) => sum + i.qty, 0);
    document.getElementById('cart-badge').innerText = totalQty;

    // Render Cart Items
    const cartContainer = document.getElementById('cart-items-container');
    cartContainer.innerHTML = '';

    let subtotal = 0;

    if (state.cart.length === 0) {
        cartContainer.innerHTML = `<div style="text-align:center; font-size:12px; color:var(--text-muted); padding:20px;">Keranjang kosong.</div>`;
    } else {
        state.cart.forEach((item, index) => {
            subtotal += item.price * item.qty;
            cartContainer.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding:8px 0;">
                    <div>
                        <div style="font-size:13px; font-weight:bold;">${item.name}</div>
                        <div style="font-size:11px; color:var(--accent);">${formatRupiah(item.price)} x ${item.qty}</div>
                    </div>
                    <button class="btn btn-outline" style="width:auto; padding:4px 8px; font-size:10px; color:var(--danger);" onclick="removeFromCart(${index})">Hapus</button>
                </div>
            `;
        });
    }

    const shipping = state.cart.length > 0 ? 20000 : 0;
    document.getElementById('cart-subtotal').innerText = formatRupiah(subtotal);
    document.getElementById('cart-shipping').innerText = formatRupiah(shipping);
    document.getElementById('cart-total').innerText = formatRupiah(subtotal + shipping);

    // Render Orders (Pembeli)
    const ordersContainer = document.getElementById('orders-container');
    ordersContainer.innerHTML = '';

    if (state.orders.length === 0) {
        ordersContainer.innerHTML = `<div style="text-align:center; font-size:12px; color:var(--text-muted); padding:20px;">Belum ada pesanan aktif.</div>`;
    } else {
        state.orders.forEach(o => {
            ordersContainer.innerHTML += `
                <div class="order-card">
                    <div class="order-header">
                        <span class="order-id">#GS-${o.id}</span>
                        <span class="order-status-badge">📦 ${o.status}</span>
                    </div>
                    <div class="order-detail-text">
                        Pemesanan Oleh: <strong>${o.customerName || 'Azana'}</strong> (${o.customerPhone || '0856332524823'})<br>
                        Email: ${o.customerEmail || 'aza@gmail.com'}<br>
                        Alamat Pengiriman: ${o.address}<br>
                        ${o.itemsSummary} (Inc. Ongkir ${formatRupiah(o.shippingCost)})
                    </div>
                    <div class="order-summary-price">${formatRupiah(o.total)} (COD)</div>
                </div>
            `;
        });
    }

    // Render Orders untuk Admin Panel (Jika Login Sebagai Admin)
    const adminOrdersList = document.getElementById('admin-orders-list');
    if (adminOrdersList && state.user && state.user.role === 'admin') {
        adminOrdersList.innerHTML = '';
        if (state.orders.length === 0) {
            adminOrdersList.innerHTML = `<div style="font-size:12px; color:var(--text-muted);">Belum ada pesanan masuk.</div>`;
        } else {
            state.orders.forEach((o, index) => {
                adminOrdersList.innerHTML += `
                    <div class="order-card" style="margin-top: 8px;">
                        <div class="order-header">
                            <span class="order-id">#GS-${o.id}</span>
                            <select onchange="updateOrderStatus(${index}, this.value)" class="form-control" style="width: auto; padding: 4px; font-size: 11px;">
                                <option value="Dikemas" ${o.status === 'Dikemas' ? 'selected' : ''}>Dikemas</option>
                                <option value="Dikirim" ${o.status === 'Dikirim' ? 'selected' : ''}>Dikirim</option>
                                <option value="Selesai" ${o.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                            </select>
                        </div>
                        <div class="order-detail-text">
                            <strong>Pembeli:</strong> ${o.customerName} (${o.customerPhone})<br>
                            <strong>Alamat:</strong> ${o.address}<br>
                            <strong>Produk:</strong> ${o.itemsSummary}
                        </div>
                    </div>
                `;
            });
        }
    }
}

function updateOrderStatus(index, newStatus) {
    state.orders[index].status = newStatus;
    saveState();
    showToast(`Status order #${state.orders[index].id} diubah ke ${newStatus}`);
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    saveState();
}

function processCheckout() {
    if (state.cart.length === 0) {
        showToast("⚠️ Keranjang belanja masih kosong!");
        return;
    }

    const shippingAddress = document.getElementById('cart-address').value;
    if (!shippingAddress.trim()) {
        showToast("⚠️ Mohon isi alamat pengiriman lengkap!");
        return;
    }

    const shipping = 20000;
    const subtotal = state.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const total = subtotal + shipping;
    const summary = state.cart.map(i => `${i.name} x${i.qty}`).join(', ');

    const newOrder = {
        id: Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString('id-ID'),
        customerName: state.user ? state.user.username : 'Azana',
        customerPhone: state.user ? state.user.phone : '0856332524823',
        customerEmail: state.user ? state.user.email : 'aza@gmail.com',
        address: shippingAddress,
        itemsSummary: summary,
        shippingCost: shipping,
        total: total,
        status: "Dikemas"
    };

    state.orders.unshift(newOrder);
    state.cart = [];
    saveState();

    showToast("🎉 Checkout Berhasil! Pesanan Anda sedang dikemas.");
    switchTab('profile');
}

function directCheckout(id) {
    closeModal('modal-detail');
    addToCart(id);
    switchTab('cart');
}

function clearOrderHistory() {
    state.orders = [];
    saveState();
    showToast("Riwayat pesanan berhasil dibersihkan!");
}
