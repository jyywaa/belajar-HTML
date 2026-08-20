// DATA BARANG UTUH
let daftarBarang = [
  { id: 1, nama: "Ayam Geprek", hargaBeli: 14400, hargaJual: 18000, diskon: "18% OFF", hargaCoret: 22000, rating: "4.8", stok: 35, img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300" },
  { id: 2, nama: "Nasi Goreng", hargaBeli: 16000, hargaJual: 20000, diskon: "15% OFF", hargaCoret: 24000, rating: "4.7", stok: 20, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300" },
  { id: 5, nama: "Matcha Latte", hargaBeli: 17600, hargaJual: 22000, diskon: "Promo", hargaCoret: 25000, rating: "4.9", stok: 15, img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300" },
  { id: 7, nama: "Es Krim Mochi", hargaBeli: 11000, hargaJual: 15000, diskon: "B1G1", hargaCoret: 18000, rating: "5.0", stok: 40, img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300" },
  { id: 9, nama: "Cardigan Pink", hargaBeli: 96000, hargaJual: 120000, diskon: "Hot", hargaCoret: 150000, rating: "4.8", stok: 10, img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300" },
  { id: 10, nama: "Sweater", hargaBeli: 80000, hargaJual: 100000, diskon: "New", hargaCoret: 130000, rating: "4.6", stok: 8, img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300" }
];

let keranjang = [];

// 1. LOGIKA SWITCH LOGIN / LOGOUT TOTAL
function prosesLogin() {
  document.getElementById("halamanLogin").style.display = "none";
  document.getElementById("appWrapper").style.display = "block";
  refreshAllViews();
}

function prosesLogout() {
  document.getElementById("appWrapper").style.display = "none";
  document.getElementById("halamanLogin").style.display = "flex";
}

// 2. KATALOG PRODUK
function renderKatalog() {
  const container = document.getElementById("katalogProdukContainer");
  if (!container) return;

  container.innerHTML = "";
  daftarBarang.forEach(item => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <span class="badge-discount">${item.diskon || 'Promo'}</span>
      <img src="${item.img || 'https://via.placeholder.com/150'}" class="product-img" alt="${item.nama}">
      <div class="product-info">
        <div>
          <div class="product-title">${item.nama}</div>
          <div>
            <span class="product-price">Rp ${item.hargaJual.toLocaleString('id-ID')}</span>
            <span class="product-old-price">Rp ${(item.hargaCoret || item.hargaJual * 1.2).toLocaleString('id-ID')}</span>
          </div>
          <div class="product-meta">★ ${item.rating || '4.5'} | Stok: ${item.stok || 10}</div>
        </div>
        <div class="action-btns">
          <button class="btn-cart" onclick="tambahKeKeranjang(${item.id})">🛒 Keranjang</button>
          <button class="btn-buy" onclick="beliLangsung(${item.id})">🛒 Beli</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// 3. LOGIKA KERANJANG & CHECKOUT
function tambahKeKeranjang(id) {
  const barang = daftarBarang.find(b => b.id === id);
  if (barang) {
    keranjang.push(barang);
    updateCartBadge();
    tampilkanNotificationModal("Berhasil!", `${barang.nama} berhasil dimasukkan ke keranjang.`);
  }
}

function beliLangsung(id) {
  const barang = daftarBarang.find(b => b.id === id);
  if (barang) {
    keranjang.push(barang);
    updateCartBadge();
    renderCheckoutPage();
    pindahHalaman("halamanCheckout");
  }
}

function updateCartBadge() {
  document.getElementById("cartBadge").innerText = keranjang.length;
}

function renderCheckoutPage() {
  const container = document.getElementById("ringkasanCheckout");
  if (keranjang.length === 0) {
    container.innerHTML = "<p>Keranjang belanja masih kosong.</p>";
    return;
  }

  let total = 0;
  let html = `<h3>Ringkasan Pesanan Anda:</h3><ul style="margin: 15px 0; padding-left:20px;">`;
  keranjang.forEach(item => {
    total += item.hargaJual;
    html += `<li style="margin-bottom:8px;">${item.nama} - <b>Rp ${item.hargaJual.toLocaleString('id-ID')}</b></li>`;
  });
  html += `</ul><h4 style="margin-top:10px;">Total Tagihan: <span style="color:#ff3385">Rp ${total.toLocaleString('id-ID')}</span></h4>
  <button class="m-btn m-btn-confirm" style="margin-top:15px; width:100%;" onclick="prosesBayar()">Proses Pembayaran</button>`;
  container.innerHTML = html;
}

function prosesBayar() {
  tampilkanNotificationModal("Pembayaran Sukses!", "Terima kasih telah berbelanja di MochiShop.");
  keranjang = [];
  updateCartBadge();
  renderCheckoutPage();
}

// 4. TABEL VIEW & EDIT HARGA / BARANG (URUT 1, 2, 3...)
function renderTabelHarga() {
  const tbody = document.getElementById("tabelHargaBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  daftarBarang.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><b>${index + 1}</b></td>
      <td>${item.nama}</td>
      <td>Rp ${item.hargaBeli.toLocaleString('id-ID')}</td>
      <td style="color: #ff3385; font-weight: bold;">Rp ${item.hargaJual.toLocaleString('id-ID')}</td>
      <td>
        <button class="btn-edit-harga" onclick="bukaModalEditHarga(${item.id})">Edit Harga</button>
        <button class="btn-edit-barang" onclick="bukaModalEditBarang(${item.id})">Edit Barang</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// 5. MODAL CUSTOM ESTETIK
function bukaModalEditHarga(id) {
  const barang = daftarBarang.find(b => b.id === id);
  if (!barang) return;

  document.getElementById("inputNama").style.display = "none";
  document.getElementById("inputHargaBeli").style.display = "none";
  
  const inputHargaJual = document.getElementById("inputHargaJual");
  inputHargaJual.style.display = "block";
  inputHargaJual.value = barang.hargaJual;

  bukaModalBase({
    judul: "Edit Harga Jual",
    deskripsi: `Masukkan harga jual baru untuk ${barang.nama}:`,
    onConfirm: () => {
      const hargaBaru = parseInt(inputHargaJual.value);
      if (!isNaN(hargaBaru) && hargaBaru > 0) {
        barang.hargaJual = hargaBaru;
        refreshAllViews();
        tampilkanNotificationModal("Berhasil!", "Harga jual barang telah diperbarui.");
      }
    }
  });
}

function bukaModalEditBarang(id) {
  const barang = daftarBarang.find(b => b.id === id);
  if (!barang) return;

  const inputNama = document.getElementById("inputNama");
  const inputHargaBeli = document.getElementById("inputHargaBeli");
  const inputHargaJual = document.getElementById("inputHargaJual");

  inputNama.style.display = "block";
  inputHargaBeli.style.display = "block";
  inputHargaJual.style.display = "block";

  inputNama.value = barang.nama;
  inputHargaBeli.value = barang.hargaBeli;
  inputHargaJual.value = barang.hargaJual;

  bukaModalBase({
    judul: "Edit Data Barang",
    deskripsi: `Perbarui informasi untuk produk ini:`,
    onConfirm: () => {
      if (inputNama.value.trim() !== "") {
        barang.nama = inputNama.value;
        barang.hargaBeli = parseInt(inputHargaBeli.value) || barang.hargaBeli;
        barang.hargaJual = parseInt(inputHargaJual.value) || barang.hargaJual;
        
        refreshAllViews();
        tampilkanNotificationModal("Berhasil!", "Detail barang telah diperbarui.");
      }
    }
  });
}

function bukaModalTambahBarang() {
  const inputNama = document.getElementById("inputNama");
  const inputHargaBeli = document.getElementById("inputHargaBeli");
  const inputHargaJual = document.getElementById("inputHargaJual");

  inputNama.style.display = "block";
  inputHargaBeli.style.display = "block";
  inputHargaJual.style.display = "block";

  inputNama.value = "";
  inputHargaBeli.value = "";
  inputHargaJual.value = "";

  bukaModalBase({
    judul: "Tambah Barang Baru",
    deskripsi: "Masukkan detail produk baru:",
    onConfirm: () => {
      if (inputNama.value.trim() !== "") {
        const idBaru = daftarBarang.length > 0 ? Math.max(...daftarBarang.map(b => b.id)) + 1 : 1;
        daftarBarang.push({
          id: idBaru,
          nama: inputNama.value,
          hargaBeli: parseInt(inputHargaBeli.value) || 0,
          hargaJual: parseInt(inputHargaJual.value) || 0,
          diskon: "NEW",
          stok: 10,
          rating: "5.0"
        });
        refreshAllViews();
        tampilkanNotificationModal("Berhasil!", "Barang baru telah ditambahkan.");
      }
    }
  });
}

function bukaModalBase({ judul, deskripsi, onConfirm }) {
  const modal = document.getElementById("mochiModal");
  document.getElementById("modalTitle").innerText = judul;
  document.getElementById("modalDescription").innerText = deskripsi;

  document.getElementById("modalBtnCancel").style.display = "inline-block";
  modal.classList.add("active");

  document.getElementById("modalBtnConfirm").onclick = () => {
    modal.classList.remove("active");
    if (onConfirm) onConfirm();
  };

  document.getElementById("modalBtnCancel").onclick = () => {
    modal.classList.remove("active");
  };
}

function tampilkanNotificationModal(judul, deskripsi) {
  document.getElementById("inputNama").style.display = "none";
  document.getElementById("inputHargaBeli").style.display = "none";
  document.getElementById("inputHargaJual").style.display = "none";

  bukaModalBase({
    judul: judul,
    deskripsi: deskripsi,
    onConfirm: null
  });
  
  document.getElementById("modalBtnCancel").style.display = "none";
}

function refreshAllViews() {
  renderTabelHarga();
  renderKatalog();
}

function pindahMenu(targetId, element) {
  document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
  if (element) element.classList.add('active');
  pindahHalaman(targetId);
}

function pindahHalaman(targetId) {
  document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
  const targetSection = document.getElementById(targetId);
  if (targetSection) targetSection.classList.add('active');
}
