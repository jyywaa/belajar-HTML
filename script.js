// Data Default 5 Barang Produk Gadget
const defaultProducts = [
    {
        id: 101,
        name: "iPhone 17 Pro Max",
        price: 22000000,
        desc: "Layar 120Hz Super Retina XDR, Chipset A18 Pro, RAM 12GB, Titanium Design.",
        image: "iphone.jpeg",
        video: "iphone2.mp4",
        rating: 5.0,
        sold: 230,
        bestseller: true
    },
    {
        id: 102,
        name: "Oppo A6 Pro",
        price: 21500000,
        desc: "Kamera 200MP Zoom 100x, Snapdragon 8 Gen 4, S-Pen Built-in, Dynamic AMOLED 2X.",
        image: "oppo.jpeg",
        video: "1.mp4",
        rating: 4.9,
        sold: 185,
        bestseller: true
    },
    {
        id: 103,
        name: "MacBook Pro M3 Max",
        price: 34900000,
        desc: "Apple M3 Max Chip, RAM 36GB, SSD 1TB, Liquid Retina XDR Display 16 Inch.",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        video: "",
        rating: 4.9,
        sold: 94,
        bestseller: true
    },
    {
        id: 104,
        name: "iPad Pro M4 OLED",
        price: 18400000,
        desc: "Ultra Thin Design 5.1mm, Ultra Retina XDR Tandem OLED, Chip M4 Super Fast.",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
        video: "",
        rating: 4.8,
        sold: 112,
        bestseller: false
    },
    {
        id: 105,
        name: "Sony WH-1000XM5 Headset",
        price: 4890000,
        desc: "Industry Leading Noise Canceling, High-Res Audio Wireless, 30 Hours Battery.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        video: "",
        rating: 4.8,
        sold: 310,
        bestseller: false
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

// Toast Notifikasi Melayang (TANPA POPUP ALERT / OK)
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
    }, 2800);
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
    
    if (el) {
        el.classList.add('active');
    } else {
        const navs = document.querySelectorAll('.bottom-nav .nav-item');
        if (tabName === 'home' && navs[0]) navs[0].classList.add('active');
        if (tabName === 'cart' && navs[1]) navs[1].classList.add('active');
        if (tabName === 'profile' && navs[2]) navs[2].classList.add('active');
        if (tabName === 'orders' && navs[3]) navs[3].classList.add('active');
    }
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// Onboarding & Autentikasi
function checkOnboarding() {
    if (!state.user) {
        document.getElementById('modal-onboarding').classList.add('active');
    } else {
        document.getElementById('modal-onboarding').classList.remove('active');
        document.getElementById('user-header-name').innerText = state.user.username;
        document.getElementById('profile-username').innerText = state.user.username;
        document.getElementById('profile-email').innerText = state.user.email;
        document.getElementById('profile-phone').innerText = state.user.phone;

        const roleTag = document.getElementById('profile-role-tag');

        // Khusus Admin meila / meila123
        if (state.user.role === 'admin') {
            document.getElementById('admin-panel').style.display = 'block';
            document.getElementById('admin-divider').style.display = 'block';
            roleTag.innerText = "Administrator";
            roleTag.style.background = "#ff4757";
            roleTag.style.color = "#fff";
        } else {
            document.getElementById('admin-panel').style.display = 'none';
            document.getElementById('admin-divider').style.display = 'none';
            roleTag.innerText = "Customer VIP";
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
        document.getElementById('wizard-subtitle').innerText = "Langkah 2: Username & Password";
        document.getElementById('wiz-username').required = true;
        document.getElementById('wiz-password').required = true;
    } else if (state.wizardStep === 2) {
        state.wizardStep = 3;
        document.getElementById('wizard-step-2').style.display = 'none';
        document.getElementById('wizard-step-3').style.display = 'block';
        document.getElementById('wizard-subtitle').innerText = "Langkah 3: Nomor Kontak";
        document.getElementById('wiz-phone').required = true;
        document.getElementById('wiz-btn-next').innerText = "Masuk & Belanja Sekarang";
    } else if (state.wizardStep === 3) {
        const email = document.getElementById('wiz-email').value;
        const username = document.getElementById('wiz-username').value;
        const pass = document.getElementById('wiz-password').value;
        const phone = document.getElementById('wiz-phone').value;

        let role = "customer";
        if (username === "meila" && pass === "meila123") {
            role = "admin";
        }

        state.user = { email, username, phone, role };
        saveState();
        showToast(`⚡ Selamat datang, ${state.user.username}!`);
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
        showToast("⚠️ Harap upload gambar produk!");
        return;
    }

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
            showToast("✅ Produk berhasil ditambahkan ke Katalog!");
        };

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

// Render Katalog Produk
function renderProducts() {
    const bestsellerContainer = document.getElementById('bestseller-list');
    const gridContainer = document.getElementById('product-grid');

    bestsellerContainer.innerHTML = '';
    gridContainer.innerHTML = '';

    state.products.forEach(p => {
        const productHtml = `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <div class="product-info">
                    <div class="product-title">${p.name}</div>
                    <div class="product-price">${formatRupiah(p.price)}</div>
                    <div class="product-desc">${p.desc}</div>
                    <div class="product-meta">
                        <span>⭐ ${p.rating}</span>
                        <span>Terjual ${p.sold}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-outline" onclick="addToCart(${p.id})">+ Cart</button>
                        <button class="btn btn-accent" onclick="openDetail(${p.id})">Lihat</button>
                    </div>
                </div>
            </div>
        `;

        gridContainer.innerHTML += productHtml;

        if (p.bestseller) {
            bestsellerContainer.innerHTML += `
                <div class="scroll-item">
                    <img src="${p.image}" style="width:100%; height:75px; object-fit:cover; border-radius:8px;">
                    <div class="product-title" style="margin-top:6px;">${p.name}</div>
                    <div style="font-size:11px; color:var(--accent); font-weight:bold; margin-bottom:4px;">${formatRupiah(p.price)}</div>
                    <button class="btn btn-accent" style="font-size:10px; padding:5px;" onclick="openDetail(${p.id})">Beli</button>
                </div>
            `;
        }
    });
}

// Modal Detail Produk
function openDetail(id) {
    const p = state.products.find(item => item.id === id);
    if (!p) return;

    const videoHtml = p.video ? `
        <div style="margin-top:12px;">
            <label style="font-size:12px; color:var(--text-muted); display:block; margin-bottom:6px;">Video Demo:</label>
            <video controls style="width:100%; border-radius:10px;" poster="${p.image}">
                <source src="${p.video}">
            </video>
        </div>` : '';

    const content = `
        <img src="${p.image}" style="width:100%; height:200px; object-fit:cover; border-radius:12px;">
        <h2 style="font-size:17px; margin-top:12px; color: #fff;">${p.name}</h2>
        <div style="font-size:18px; font-weight:800; color:var(--accent); margin:6px 0;">${formatRupiah(p.price)}</div>
        <p style="font-size:12px; color:var(--text-muted); line-height:1.6;">${p.desc}</p>
        ${videoHtml}
        <div style="display:flex; gap:8px; margin-top:18px;">
            <button class="btn btn-outline" onclick="addToCart(${p.id}); closeModal('modal-detail');">+ Keranjang</button>
            <button class="btn btn-accent" onclick="directCheckout(${p.id})">Beli Sekarang</button>
        </div>
    `;

    document.getElementById('detail-content').innerHTML = content;
    openModal('modal-detail');
}

// Tambah ke Keranjang (Langsung tanpa dialog OK)
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
    showToast(`🛒 ${p.name} berhasil dimasukkan ke keranjang!`);
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
        cartContainer.innerHTML = `<div style="text-align:center; font-size:12px; color:var(--text-muted); padding:24px;">Keranjang belanja Anda masih kosong.</div>`;
    } else {
        state.cart.forEach((item, index) => {
            subtotal += item.price * item.qty;
            cartContainer.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding:10px 0;">
                    <div>
                        <div style="font-size:13px; font-weight:bold; color: #fff;">${item.name}</div>
                        <div style="font-size:11px; color:var(--accent); margin-top:2px;">${formatRupiah(item.price)} x ${item.qty}</div>
                    </div>
                    <button class="btn btn-outline" style="width:auto; padding:6px 10px; font-size:11px; color:var(--danger); border-color:rgba(255,71,87,0.3);" onclick="removeFromCart(${index})">Hapus</button>
                </div>
            `;
        });
    }

    const shipping = state.cart.length > 0 ? 20000 : 0;
    document.getElementById('cart-subtotal').innerText = formatRupiah(subtotal);
    document.getElementById('cart-shipping').innerText = formatRupiah(shipping);
    document.getElementById('cart-total').innerText = formatRupiah(subtotal + shipping);

    // Render Orders
    const ordersContainer = document.getElementById('orders-container');
    ordersContainer.innerHTML = '';

    if (state.orders.length === 0) {
        ordersContainer.innerHTML = `<div style="text-align:center; font-size:12px; color:var(--text-muted); padding:24px;">Belum ada riwayat pesanan.</div>`;
    } else {
        state.orders.forEach(o => {
            ordersContainer.innerHTML += `
                <div class="card" style="margin-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-bottom:8px;">
                        <span>ID Pesanan: #${o.id}</span>
                        <span>${o.date}</span>
                    </div>
                    <div style="font-size:13px; font-weight:bold; color:#fff; margin-bottom:6px;">${o.itemsSummary}</div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding-top:8px; border-top:1px dashed var(--border);">
                        <span style="font-size:13px; font-weight:bold; color:var(--accent);">${formatRupiah(o.total)} (COD)</span>
                        <span style="font-size:10px; background:rgba(0,242,254,0.15); color:var(--accent); padding:3px 8px; border-radius:10px; font-weight:bold;">${o.status}</span>
                    </div>
                </div>
            `;
        });
    }
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    saveState();
    showToast("🗑️ Barang dihapus dari keranjang!");
}

// Process Checkout (Langsung tanpa popup alert OK)
function processCheckout() {
    if (state.cart.length === 0) {
        showToast("⚠️ Keranjang belanja Anda masih kosong!");
        return;
    }

    const subtotal = state.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const total = subtotal + 20000;
    const summary = state.cart.map(i => `${i.name} (${i.qty})`).join(', ');

    const newOrder = {
        id: Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString('id-ID'),
        itemsSummary: summary,
        total: total,
        status: "Dikemas (COD)"
    };

    state.orders.unshift(newOrder);
    state.cart = [];
    saveState();

    showToast("🎉 Pesanan berhasil dibuat! Silakan cek menu Pesanan.");
    switchTab('orders');
}

function directCheckout(id) {
    closeModal('modal-detail');
    addToCart(id);
    switchTab('cart');
}
