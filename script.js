// Data Default (2 HP & 1 Laptop) dengan Video Cepat Diputar
const defaultProducts = [
    {
        id: 101,
        name: "Oppo A6 Pro",
        price: 15000000,
        desc: "Layar 120Hz OLED, RAM 12GB, Storage 256GB, Kamera 108MP.",
        image: "Oppo.jpeg",
        video: "1.mp4",
        rating: 4.9,
        sold: 142,
        bestseller: true
    },
    {
        id: 102,
        name: "Iphone 17 Pro max",
        price: 4500000,
        desc: "Layar Full HD+, RAM 8GB, Storage 128GB, Baterai 5000mAh.",
        image: "iphone",
        video: "iphone2.mp4",
        rating: 4.7,
        sold: 210,
        bestseller: true
    },
    {
        id: 103,
        name: "Laptop Ultra Book Pro",
        price: 22500000,
        desc: "Processor Core i9, RAM 32GB, SSD 1TB, Baterai Tahan 18 Jam.",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        rating: 4.8,
        sold: 89,
        bestseller: true
    }
];

// Inisialisasi State (Reset Otomatis jika LocalStorage Kosong/Rusak)
let savedProducts = JSON.parse(localStorage.getItem('app_products'));
if (!savedProducts || !Array.isArray(savedProducts) || savedProducts.length === 0) {
    savedProducts = defaultProducts;
    localStorage.setItem('app_products', JSON.stringify(defaultProducts));
}

let state = {
    user: JSON.parse(localStorage.getItem('app_user')) || null,
    products: savedProducts,
    cart: JSON.parse(localStorage.getItem('app_cart')) || [],
    orders: JSON.parse(localStorage.getItem('app_orders')) || [],
    wizardStep: 1
};

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
    if (!container) return;
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
    if (targetView) targetView.classList.add('active');
    if (el) el.classList.add('active');
}

function openModal(id) { 
    const m = document.getElementById(id);
    if(m) m.classList.add('active'); 
}

function closeModal(id) { 
    const m = document.getElementById(id);
    if(m) m.classList.remove('active'); 
}

// Onboarding & Login
function checkOnboarding() {
    const onboardingModal = document.getElementById('modal-onboarding');
    if (!state.user) {
        if (onboardingModal) onboardingModal.classList.add('active');
    } else {
        if (onboardingModal) onboardingModal.classList.remove('active');
        
        const headerName = document.getElementById('user-header-name');
        if (headerName) headerName.innerText = state.user.username;

        const profName = document.getElementById('profile-username');
        if (profName) profName.innerText = state.user.username;

        const profEmail = document.getElementById('profile-email');
        if (profEmail) profEmail.innerText = state.user.email || 'aza@gmail.com';

        const profPhone = document.getElementById('profile-phone');
        if (profPhone) profPhone.innerText = state.user.phone || '08123456789';

        const profAddress = document.getElementById('profile-address');
        if (profAddress) profAddress.innerText = state.user.address || 'Jl. Mangkang Kulon SMK Texmaco Semarang';

        const cartAddressInput = document.getElementById('cart-address');
        if (cartAddressInput && !cartAddressInput.value) {
            cartAddressInput.value = state.user.address || 'Jl. Mangkang Kulon SMK Texmaco Semarang';
        }

        const roleTag = document.getElementById('profile-role-tag');
        const adminPanel = document.getElementById('admin-panel');
        const adminDivider = document.getElementById('admin-divider');

        // Login Admin
        if (state.user.role === 'admin') {
            if (adminPanel) adminPanel.style.display = 'block';
            if (adminDivider) adminDivider.style.display = 'block';
            if (roleTag) {
                roleTag.innerText = "Administrator";
                roleTag.style.background = "#ff4d4d";
                roleTag.style.color = "#fff";
            }
            renderAdminProductManage();
        } else {
            if (adminPanel) adminPanel.style.display = 'none';
            if (adminDivider) adminDivider.style.display = 'none';
            if (roleTag) {
                roleTag.innerText = "Customer Member";
                roleTag.style.background = "var(--accent)";
                roleTag.style.color = "#000";
            }
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
    } else if (state.wizardStep === 2) {
        state.wizardStep = 3;
        document.getElementById('wizard-step-2').style.display = 'none';
        document.getElementById('wizard-step-3').style.display = 'block';
        document.getElementById('wizard-subtitle').innerText = "Langkah 3 dari 3: Nomor Kontak & Alamat";
        document.getElementById('wiz-btn-next').innerText = "Selesai & Belanja";
    } else if (state.wizardStep === 3) {
        const email = document.getElementById('wiz-email').value;
        const username = document.getElementById('wiz-username').value;
        const pass = document.getElementById('wiz-password').value;
        const phone = document.getElementById('wiz-phone').value;
        const address = document.getElementById('wiz-address').value || 'Jl. Mangkang Kulon SMK Texmaco Semarang';

        let role = (username === "meila" && pass === "meila123") ? "admin" : "customer";

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

// Fitur Edit/Tambah Produk (Admin)
function handleAdminSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('admin-edit-id').value;
    const name = document.getElementById('admin-name').value;
    const desc = document.getElementById('admin-desc').value;
    const price = parseInt(document.getElementById('admin-price').value);

    const imgFile = document.getElementById('admin-image-file').files[0];
    const imgUrl = document.getElementById('admin-image-url').value;

    const videoFile = document.getElementById('admin-video-file').files[0];
    const videoUrl = document.getElementById('admin-video-url').value;

    let targetProduct = editId ? state.products.find(p => p.id == editId) : null;

    const processSave = (finalImg, finalVideo) => {
        if (editId && targetProduct) {
            targetProduct.name = name;
            targetProduct.desc = desc;
            targetProduct.price = price;
            if (finalImg) targetProduct.image = finalImg;
            if (finalVideo !== undefined && finalVideo !== "") targetProduct.video = finalVideo;
            showToast("✅ Produk berhasil diperbarui!");
        } else {
            const newProd = {
                id: Date.now(),
                name: name,
                price: price,
                desc: desc,
                image: finalImg || 'https://via.placeholder.com/300x200?text=Produk+Baru',
                video: finalVideo || '',
                rating: 5.0,
                sold: 0,
                bestseller: false
            };
            state.products.unshift(newProd);
            showToast("✅ Produk baru disimpan!");
        }

        cancelEditProduct();
        saveState();
        renderProducts();
        renderAdminProductManage();
    };

    const getImageThenSave = (cb) => {
        if (imgFile) {
            const reader = new FileReader();
            reader.onload = (e) => cb(e.target.result);
            reader.readAsDataURL(imgFile);
        } else if (imgUrl.trim() !== '') {
            cb(imgUrl.trim());
        } else {
            cb(targetProduct ? targetProduct.image : '');
        }
    };

    getImageThenSave((finalImg) => {
        if (videoFile) {
            const readerV = new FileReader();
            readerV.onload = (e) => processSave(finalImg, e.target.result);
            readerV.readAsDataURL(videoFile);
        } else if (videoUrl.trim() !== '') {
            processSave(finalImg, videoUrl.trim());
        } else {
            processSave(finalImg, targetProduct ? targetProduct.video : '');
        }
    });
}

function editProduct(id) {
    const p = state.products.find(item => item.id === id);
    if (!p) return;

    document.getElementById('admin-edit-id').value = p.id;
    document.getElementById('admin-name').value = p.name;
    document.getElementById('admin-desc').value = p.desc;
    document.getElementById('admin-price').value = p.price;
    document.getElementById('admin-image-url').value = p.image.startsWith('data:') ? '' : p.image;
    document.getElementById('admin-video-url').value = p.video.startsWith('data:') ? '' : p.video;

    document.getElementById('admin-form-title').innerHTML = "✏️ Edit Produk: " + p.name;
    document.getElementById('admin-submit-btn').innerText = "Update Produk";
    document.getElementById('admin-cancel-btn').style.display = "block";
    
    document.getElementById('admin-panel').scrollIntoView({ behavior: 'smooth' });
}

function cancelEditProduct() {
    document.getElementById('admin-edit-id').value = "";
    document.getElementById('admin-form').reset();
    document.getElementById('admin-form-title').innerHTML = "Panel Administrator (Tambah / Edit Produk)";
    document.getElementById('admin-submit-btn').innerText = "Simpan Produk";
    document.getElementById('admin-cancel-btn').style.display = "none";
}

function deleteProduct(id) {
    if (confirm("Hapus produk ini dari katalog?")) {
        state.products = state.products.filter(p => p.id !== id);
        saveState();
        renderProducts();
        renderAdminProductManage();
        showToast("🗑️ Produk berhasil dihapus!");
    }
}

function renderAdminProductManage() {
    const container = document.getElementById('admin-product-manage-list');
    if (!container) return;

    container.innerHTML = '';
    state.products.forEach(p => {
        container.innerHTML += `
            <div class="admin-item-card" style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-main); border:1px solid var(--border); border-radius:8px; padding:8px 12px; margin-bottom:8px;">
                <div>
                    <div style="font-size: 13px; font-weight: bold;">${p.name}</div>
                    <div style="font-size: 11px; color: var(--accent);">${formatRupiah(p.price)}</div>
                </div>
                <div style="display: flex; gap: 6px;">
                    <button class="btn btn-outline" style="width: auto; padding: 4px 8px; font-size: 11px;" onclick="editProduct(${p.id})">Edit</button>
                    <button class="btn btn-danger" style="width: auto; padding: 4px 8px; font-size: 11px;" onclick="deleteProduct(${p.id})">Hapus</button>
                </div>
            </div>
        `;
    });
}

// Render Produk di Katalog
function renderProducts() {
    const bestsellerContainer = document.getElementById('bestseller-list');
    const gridContainer = document.getElementById('product-grid');

    if (!bestsellerContainer || !gridContainer) return;

    bestsellerContainer.innerHTML = '';
    gridContainer.innerHTML = '';

    state.products.forEach(p => {
        const videoHtml = p.video ? `
            <video class="product-video" controls muted playsinline preload="none" poster="${p.image}">
                <source src="${p.video}" type="video/mp4">
            </video>` : '';

        const productHtml = `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Gambar+Produk'">
                <div class="product-info">
                    <div class="product-title">${p.name}</div>
                    <div class="product-price">${formatRupiah(p.price)}</div>
                    <div class="product-desc">${p.desc}</div>
                    ${videoHtml}
                    <div class="product-meta" style="margin-top:6px;">
                        <span>⭐ ${p.rating}</span>
                        <span>Terjual ${p.sold}</span>
                    </div>
                    <div class="product-actions" style="margin-top:8px;">
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

function openDetail(id) {
    const p = state.products.find(item => item.id === id);
    if (!p) return;

    const videoHtml = p.video ? `
        <div style="margin-top:12px;">
            <label style="font-size:12px; color:var(--text-muted); display:block; margin-bottom:4px;">Video Preview:</label>
            <video controls playsinline preload="none" style="width:100%; border-radius:8px; max-height:200px; background:#000;" poster="${p.image}">
                <source src="${p.video}" type="video/mp4">
            </video>
        </div>` : '';

    const content = `
        <img src="${p.image}" style="width:100%; height:180px; object-fit:cover; border-radius:10px;" onerror="this.src='https://via.placeholder.com/400x200'">
        <h2 style="font-size:16px; margin-top:12px;">${p.name}</h2>
        <div style="font-size:18px; font-weight:bold; color:var(--accent); margin:6px 0;">${formatRupiah(p.price)}</div>
        <p style="font-size:12px; color:var(--text-muted); line-height:1.5;">${p.desc}</p>
        ${videoHtml}
        <div style="display:flex; gap:8px; margin-top:16px;">
            <button class="btn btn-outline" onclick="addToCart(${p.id}); closeModal('modal-detail');">+ Keranjang</button>
            <button class="btn btn-accent" onclick="directCheckout(${p.id})">Beli Sekarang</button>
        </div>
    `;

    document.getElementById('detail-content').innerHTML = content;
    openModal('modal-detail');
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
    showToast("🛒 Berhasil dimasukkan ke Keranjang!");
}

function updateUI() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalQty = state.cart.reduce((sum, i) => sum + i.qty, 0);
        badge.innerText = totalQty;
    }

    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        cartContainer.innerHTML = '';
        let subtotal = 0;

        if (state.cart.length === 0) {
            cartContainer.innerHTML = `<div style="text-align:center; font-size:12px; color:var(--text-muted); padding:20px;">Keranjang belanja kosong.</div>`;
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
    }
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
    const shipping = 20000;
    const subtotal = state.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

    const newOrder = {
        id: Math.floor(100000 + Math.random() * 900000),
        address: shippingAddress,
        total: subtotal + shipping,
        status: "Dikemas"
    };

    state.orders.unshift(newOrder);
    state.cart = [];
    saveState();

    showToast("🎉 Checkout Berhasil!");
    switchTab('profile');
}

function directCheckout(id) {
    closeModal('modal-detail');
    addToCart(id);
    switchTab('cart');
}
