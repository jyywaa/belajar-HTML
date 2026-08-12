// ==========================================
// 1. DATA DEFAULT PRODUK (GadgetStore Pro)
// ==========================================
const defaultProducts = [
    {
        id: 101,
        name: "Oppo A6 Pro",
        price: 12000000,
        desc: "Layar 120Hz AMOLED, RAM 12GB, Storage 512GB.",
        image: "oppo.jpeg", // Pastikan nama file di GitHub persis 'oppo.jpeg'
        video: "1.mp4",     // Pastikan nama file di GitHub persis '1.mp4'
        rating: 4.9,
        sold: 142,
        bestseller: true
    },
    {
        id: 102,
        name: "Laptop Pro Book Studio",
        price: 24500000,
        desc: "Processor Chip M-Pro, RAM 32GB, SSD 1TB, Retina Display.",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        rating: 4.8,
        sold: 89,
        bestseller: true
    }
];

// PAKSA UPDATE LOCALSTORAGE JIKA ADA PERUBAHAN KODE (Sangat Penting!)
const APP_VERSION = "v2.0_gsp"; 
if (localStorage.getItem('app_ver') !== APP_VERSION) {
    localStorage.removeItem('app_products');
    localStorage.removeItem('app_orders');
    localStorage.setItem('app_ver', APP_VERSION);
}

// ==========================================
// 2. STATE UTAMA APLIKASI
// ==========================================
let state = {
    user: JSON.parse(localStorage.getItem('app_user')) || null,
    products: JSON.parse(localStorage.getItem('app_products')) || defaultProducts,
    cart: JSON.parse(localStorage.getItem('app_cart')) || [],
    orders: JSON.parse(localStorage.getItem('app_orders')) || [
        {
            id: "247715",
            user: "Suci",
            phone: "081234567890",
            email: "suci@gadgetstore.id",
            address: "Jl. Pemuda No. 123, Semarang, Jawa Tengah",
            itemsSummary: "Smartphone Premium X (Inc. Ongkir Rp 20.000)",
            total: 12020000,
            payment: "COD",
            status: "Diproses",
            date: "12/08/2026"
        }
    ]
};

// ==========================================
// 3. INISIALISASI SAAT BUKAI WEB
// ==========================================
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

function showToast(message) {
    const container = document.getElementById('toast-container');
    if(!container) return;
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

function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString('id-ID');
}

function switchTab(tabName, el) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

    const targetView = document.getElementById(`view-${tabName}`);
    if(targetView) targetView.classList.add('active');
    if (el) el.classList.add('active');
}

function openModal(id) { 
    const el = document.getElementById(id);
    if(el) el.classList.add('active'); 
}

function closeModal(id) { 
    const el = document.getElementById(id);
    if(el) el.classList.remove('active'); 
}

function checkOnboarding() {
    if (!state.user) {
        openModal('modal-onboarding');
    } else {
        closeModal('modal-onboarding');
        const userHeader = document.getElementById('user-header-name');
        if(userHeader) userHeader.innerText = state.user.username;
    }
}

// ==========================================
// 4. RENDER KATALOG PRODUK
// ==========================================
function renderProducts() {
    const gridContainer = document.getElementById('product-grid');
    if(!gridContainer) return;

    gridContainer.innerHTML = '';

    state.products.forEach(p => {
        const videoHtml = p.video ? `
            <video class="product-video" controls muted poster="${p.image}">
                <source src="${p.video}" type="video/mp4">
            </video>` : '';

        gridContainer.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/150?text=Foto+Tidak+Ada'">
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
                        <button class="btn btn-accent" onclick="addToCart(${p.id}); switchTab('cart');">Beli</button>
                    </div>
                </div>
            </div>
        `;
    });
}

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
    showToast("🛒 Masuk keranjang!");
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    saveState();
    showToast("Item dihapus dari keranjang.");
}

// ==========================================
// 5. UPDATE TAMPILAN KERANJANG & STATUS PESANAN (DARK THEME)
// ==========================================
function updateUI() {
    // A. Update Badge & Item Keranjang
    const totalQty = state.cart.reduce((sum, i) => sum + i.qty, 0);
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) cartBadge.innerText = totalQty;

    const cartContainer = document.getElementById('cart-items-container');
    let subtotal = 0;

    if (cartContainer) {
        cartContainer.innerHTML = '';
        if (state.cart.length === 0) {
            cartContainer.innerHTML = `<div style="text-align:center; font-size:12px; color:var(--text-muted); padding:20px;">Keranjang belanja kosong.</div>`;
        } else {
            state.cart.forEach((item, index) => {
                subtotal += item.price * item.qty;
                cartContainer.innerHTML += `
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding:8px 0;">
                        <div>
                            <div style="font-size:13px; font-weight:bold; color:var(--text-main);">${item.name}</div>
                            <div style="font-size:11px; color:var(--accent);">${formatRupiah(item.price)} x ${item.qty}</div>
                        </div>
                        <button class="btn btn-outline" style="width:auto; padding:4px 8px; font-size:10px; color:var(--danger); border-color:var(--danger);" onclick="removeFromCart(${index})">Hapus</button>
                    </div>
                `;
            });
        }

        const shipping = state.cart.length > 0 ? 20000 : 0;
        if (document.getElementById('cart-subtotal')) document.getElementById('cart-subtotal').innerText = formatRupiah(subtotal);
        if (document.getElementById('cart-shipping')) document.getElementById('cart-shipping').innerText = formatRupiah(shipping);
        if (document.getElementById('cart-total')) document.getElementById('cart-total').innerText = formatRupiah(subtotal + shipping);
    }

    // B. Tampilan Status Pengiriman (GadgetStore Pro Dark UI)
    const ordersContainer = document.getElementById('orders-container');
    if (ordersContainer) {
        let html = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                <h3 style="font-size: 15px; color: var(--accent); display: flex; align-items: center; gap: 8px; margin: 0;">
                    🚚 Status & Riwayat Pengiriman
                </h3>
                <button onclick="clearOrderHistory()" class="btn btn-outline" style="width: auto; padding: 6px 12px; font-size: 11px; color: var(--danger); border-color: var(--danger);">
                    🗑️ Hapus Riwayat
                </button>
            </div>
        `;

        if (state.orders.length === 0) {
            html += `
                <div class="card" style="text-align:center; font-size:12px; color:var(--text-muted); padding:24px;">
                    Belum ada riwayat pesanan.
                </div>`;
        } else {
            state.orders.forEach(o => {
                let statusColor = 'var(--accent)';
                if (o.status === 'Selesai') statusColor = 'var(--success)';
                if (o.status === 'Diproses' || o.status === 'Dikemas') statusColor = 'var(--warning)';

                html += `
                    <div class="card" style="border-left: 4px solid ${statusColor}; margin-bottom: 12px; background: #141c2e;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--border);">
                            <div>
                                <span style="font-weight: 800; font-size: 14px; color: var(--accent);">#GSP-${o.id}</span>
                                <span style="font-size: 10px; color: var(--text-muted); margin-left: 6px;">${o.date || ''}</span>
                            </div>
                            <span style="font-size: 11px; font-weight: 700; color: ${statusColor}; background: rgba(0, 242, 254, 0.08); padding: 4px 10px; border-radius: 20px; border: 1px solid ${statusColor};">
                                📦 ${o.status || 'Diproses'}
                            </span>
                        </div>

                        <div style="background: var(--bg-main); padding: 10px; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 10px; font-size: 11px; line-height: 1.5; color: var(--text-muted);">
                            <div style="color: var(--text-main); font-weight: 600; margin-bottom: 2px;">
                                👤 Pemesan: ${o.user} <span style="font-weight: normal; color: var(--text-muted);">(${o.phone || '08xxx'})</span>
                            </div>
                            <div style="margin-bottom: 4px;">✉️ Email: ${o.email || '-'}</div>
                            <div style="color: var(--text-main);">📍 <b>Alamat:</b> ${o.address}</div>
                        </div>

                        <div style="font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
                            🛒 ${o.itemsSummary}
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border); padding-top: 8px; margin-top: 6px;">
                            <span style="font-size: 11px; color: var(--text-muted);">Metode: <b style="color: var(--accent);">${o.payment}</b></span>
                            <span style="font-size: 15px; font-weight: 800; color: var(--accent);">${formatRupiah(o.total)}</span>
                        </div>
                    </div>
                `;
            });
        }

        ordersContainer.innerHTML = html;
    }
}

function clearOrderHistory() {
    if(confirm("Yakin ingin menghapus semua riwayat pesanan?")) {
        state.orders = [];
        saveState();
        showToast("Riwayat pesanan dihapus.");
    }
}
