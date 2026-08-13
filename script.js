// DATA SAMPLE PRODUK DENGAN DUMMY BASE64 GAMBAR DEFAULTS
let products = [
    {
        id: 1,
        nama: "Smartphone Flagship X",
        kategori: "Smartphone",
        harga: 12499000,
        stok: 15,
        media: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        nama: "Laptop Ultra Slim Pro",
        kategori: "Laptop",
        harga: 24999000,
        stok: 8,
        media: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80"
    }
];

let cart = [];

let orders = [
    {
        id: "ORD-1001",
        pembeli: "Budi Santoso",
        hp: "081234567890",
        items: "Smartphone Flagship X (1)",
        totalHarga: 12499000,
        alamat: "Jl. Merdeka No. 45, RT 02/RW 05, Kel. Gambir, Jakarta Pusat",
        status: "Dikirim"
    }
];

let currentUploadedImage = ""; // Variabel penampung Base64 gambar yang di-upload

// INITIAL LOAD
document.addEventListener("DOMContentLoaded", () => {
    renderBuyerProducts();
    renderCart();
    renderAdminTable();
    renderAdminOrders();
    updateStats();

    // Event listener untuk preview gambar yang diupload
    const fileInput = document.getElementById("barang-media-file");
    if(fileInput) {
        fileInput.addEventListener("change", handleImageUpload);
    }
});

// FUNGSI MEMBACA UPLOAD GAMBAR MENJADI BASE64
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUploadedImage = e.target.result;
            const preview = document.getElementById("image-preview");
            preview.src = currentUploadedImage;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}

// SWITCH MODE (PEMBELI vs ADMIN)
function switchMode(mode) {
    document.getElementById("btn-mode-pembeli").classList.remove("active");
    document.getElementById("btn-mode-admin").classList.remove("active");
    document.getElementById("section-pembeli").classList.remove("active");
    document.getElementById("section-admin").classList.remove("active");

    if (mode === 'pembeli') {
        document.getElementById("btn-mode-pembeli").classList.add("active");
        document.getElementById("section-pembeli").classList.add("active");
    } else {
        document.getElementById("btn-mode-admin").classList.add("active");
        document.getElementById("section-admin").classList.add("active");
    }
}

// FORMAT RUPIAH
function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

// -------------------------------------------------------------
// FITUR PEMBELI
// -------------------------------------------------------------
function renderBuyerProducts() {
    const grid = document.getElementById("buyer-products-grid");
    grid.innerHTML = "";

    products.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${p.media}" class="product-media" alt="${p.nama}">
                <div class="product-details">
                    <span class="product-category">${p.kategori}</span>
                    <h3 class="product-title">${p.nama}</h3>
                    <p class="product-price">${formatRupiah(p.harga)}</p>
                    <p class="product-stock">Tersedia: ${p.stok} unit</p>
                    <button class="btn btn-add-cart" onclick="tambahKeKeranjang(${p.id})">+ Keranjang</button>
                </div>
            </div>
        `;
    });
}

function tambahKeKeranjang(id) {
    const p = products.find(prod => prod.id === id);
    if (p.stok <= 0) {
        alert("Stok barang ini telah habis!");
        return;
    }

    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
        if (cart[existingIndex].qty < p.stok) {
            cart[existingIndex].qty += 1;
        } else {
            alert("Jumlah dalam keranjang melebihi stok yang tersedia.");
        }
    } else {
        cart.push({ ...p, qty: 1 });
    }
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById("cart-list-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total-price");

    if (cart.length === 0) {
        cartList.innerHTML = `<li class="empty-cart-msg">Keranjang Anda masih kosong.</li>`;
        cartCount.innerText = "0";
        cartTotal.innerText = formatRupiah(0);
        return;
    }

    let total = 0;
    let count = 0;
    cartList.innerHTML = "";

    cart.forEach((item, index) => {
        const itemTotal = item.harga * item.qty;
        total += itemTotal;
        count += item.qty;

        cartList.innerHTML += `
            <li class="cart-item-row">
                <div>
                    <strong>${item.nama}</strong> (${item.qty}x)
                </div>
                <div>
                    ${formatRupiah(itemTotal)} 
                    <button style="color:red; cursor:pointer; background:none; border:none; margin-left:10px;" onclick="hapusDariKeranjang(${index})">❌</button>
                </div>
            </li>
        `;
    });

    cartCount.innerText = count;
    cartTotal.innerText = formatRupiah(total);
}

function hapusDariKeranjang(index) {
    cart.splice(index, 1);
    renderCart();
}

function prosesCheckout(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Keranjang belanja Anda masih kosong!");
        return;
    }

    const nama = document.getElementById("nama-pembeli").value;
    const hp = document.getElementById("hp-pembeli").value;
    const alamat = document.getElementById("alamat-pembeli").value;

    let totalHargaOrder = 0;
    const itemsSummary = cart.map(c => {
        totalHargaOrder += (c.harga * c.qty);
        return `${c.nama} (${c.qty})`;
    }).join(", ");

    // Potong Stok
    cart.forEach(c => {
        const p = products.find(prod => prod.id === c.id);
        if (p) p.stok -= c.qty;
    });

    const newOrder = {
        id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
        pembeli: nama,
        hp: hp,
        items: itemsSummary,
        totalHarga: totalHargaOrder,
        alamat: alamat,
        status: "Pending (Pesanan Baru)"
    };

    orders.push(newOrder);

    alert("Pesanan berhasil dikirim! Terima kasih sudah berbelanja.");
    
    // Reset Form & Keranjang
    cart = [];
    document.getElementById("form-checkout").reset();
    renderCart();
    renderBuyerProducts();
    renderAdminTable();
    renderAdminOrders();
    updateStats();
}

// -------------------------------------------------------------
// FITUR ADMIN
// -------------------------------------------------------------
function renderAdminTable() {
    const tbody = document.getElementById("admin-product-table");
    tbody.innerHTML = "";

    products.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${p.media}" class="table-thumb" alt="${p.nama}"></td>
                <td><strong>${p.nama}</strong></td>
                <td>${p.kategori}</td>
                <td>${formatRupiah(p.harga)}</td>
                <td>${p.stok} unit</td>
                <td>
                    <button class="btn btn-edit" onclick="editBarang(${p.id})">Edit</button>
                    <button class="btn btn-delete" onclick="hapusBarang(${p.id})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function renderAdminOrders() {
    const tbody = document.getElementById("admin-orders-table");
    tbody.innerHTML = "";

    orders.forEach((o, index) => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.pembeli}<br><small>${o.hp}</small></td>
                <td>${o.items}</td>
                <td>${o.alamat}</td>
                <td><span style="font-weight:bold; color:#0284c7;">${o.status}</span></td>
                <td>
                    <select class="status-select" onchange="ubahStatusPesanan(${index}, this.value)">
                        <option value="Pending (Pesanan Baru)" ${o.status === 'Pending (Pesanan Baru)' ? 'selected' : ''}>Pending</option>
                        <option value="Diproses" ${o.status === 'Diproses' ? 'selected' : ''}>Diproses</option>
                        <option value="Dikirim" ${o.status === 'Dikirim' ? 'selected' : ''}>Dikirim</option>
                        <option value="Selesai" ${o.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                    </select>
                </td>
            </tr>
        `;
    });
}

function ubahStatusPesanan(index, statusBaru) {
    orders[index].status = statusBaru;
    renderAdminOrders();
}

function updateStats() {
    const totalOmset = orders.reduce((acc, curr) => acc + (curr.totalHarga || 0), 0);
    const totalStokUnit = products.reduce((acc, curr) => acc + curr.stok, 0);

    document.getElementById("stat-omset").innerText = formatRupiah(totalOmset);
    document.getElementById("stat-total-produk").innerText = `${products.length} Jenis (${totalStokUnit} Unit)`;
    document.getElementById("stat-pesanan-masuk").innerText = `${orders.length} Transaksi`;
}

// MODAL BARANG ADMIN
function bukaModalTambahBarang() {
    document.getElementById("modal-title").innerText = "Tambah Gadget Baru";
    document.getElementById("form-barang").reset();
    document.getElementById("barang-id").value = "";
    document.getElementById("image-preview").style.display = "none";
    document.getElementById("image-preview").src = "";
    currentUploadedImage = "";
    document.getElementById("modal-barang").style.display = "flex";
}

function tutupModalBarang() {
    document.getElementById("modal-barang").style.display = "none";
}

function editBarang(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    document.getElementById("modal-title").innerText = "Edit Gadget";
    document.getElementById("barang-id").value = p.id;
    document.getElementById("barang-nama").value = p.nama;
    document.getElementById("barang-kategori").value = p.kategori;
    document.getElementById("barang-harga").value = p.harga;
    document.getElementById("barang-stok").value = p.stok;

    currentUploadedImage = p.media;
    const preview = document.getElementById("image-preview");
    preview.src = p.media;
    preview.style.display = "block";

    document.getElementById("modal-barang").style.display = "flex";
}

function hapusBarang(id) {
    if (confirm("Apakah Anda yakin ingin menghapus gadget ini dari katalog?")) {
        products = products.filter(p => p.id !== id);
        renderAdminTable();
        renderBuyerProducts();
        updateStats();
    }
}

function simpanBarang(event) {
    event.preventDefault();
    const id = document.getElementById("barang-id").value;
    const nama = document.getElementById("barang-nama").value;
    const kategori = document.getElementById("barang-kategori").value;
    const harga = parseInt(document.getElementById("barang-harga").value);
    const stok = parseInt(document.getElementById("barang-stok").value);

    if (!currentUploadedImage && !id) {
        alert("Silakan upload gambar produk terlebih dahulu!");
        return;
    }

    if (id) {
        // Edit produk
        const p = products.find(prod => prod.id == id);
        p.nama = nama;
        p.kategori = kategori;
        p.harga = harga;
        p.stok = stok;
        if (currentUploadedImage) {
            p.media = currentUploadedImage;
        }
    } else {
        // Tambah produk baru
        const newProduct = {
            id: Date.now(),
            nama,
            kategori,
            harga,
            stok,
            media: currentUploadedImage
        };
        products.push(newProduct);
    }

    tutupModalBarang();
    renderAdminTable();
    renderBuyerProducts();
    updateStats();
}
