// DATA BARANG LENGKAP
let daftarBarang = [
  { id: 1, nama: "Ayam Geprek", hargaBeli: 14400, hargaJual: 18000, diskon: "18% OFF", hargaCoret: 22000, rating: "4.8", stok: 35, img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300" },
  { id: 2, nama: "Nasi Goreng", hargaBeli: 16000, hargaJual: 20000, diskon: "15% OFF", hargaCoret: 24000, rating: "4.7", stok: 20, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300" },
  { id: 5, nama: "Matcha Latte", hargaBeli: 17600, hargaJual: 22000, diskon: "Promo", hargaCoret: 25000, rating: "4.9", stok: 15, img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300" },
  { id: 7, nama: "Es Krim Mochi", hargaBeli: 11000, hargaJual: 15000, diskon: "B1G1", hargaCoret: 18000, rating: "5.0", stok: 40, img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300" },
  { id: 9, nama: "Cardigan Pink", hargaBeli: 96000, hargaJual: 120000, diskon: "Hot", hargaCoret: 150000, rating: "4.8", stok: 10, img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300" },
  { id: 10, nama: "Sweater", hargaBeli: 80000, hargaJual: 100000, diskon: "New", hargaCoret: 130000, rating: "4.6", stok: 8, img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300" }
];

let keranjang = [];

// RENDER KATALOG UNTUK HALAMAN SHOP UTAMA
function renderKatalog() {
  const container = document.getElementById("katalogProdukContainer");
  if (!container) return;

  container.innerHTML = "";
  daftarBarang.forEach(item => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <span class="badge-discount">${item.diskon}</span>
      <img src="${item.img}" class="product-img" alt="${item.nama}">
      <div class="product-info">
        <div>
          <div class="product-title">${item.nama}</div>
          <div>
            <span class="product-price">Rp ${item.hargaJual.toLocaleString('id-ID')}</span>
            <span class="product-old-price">Rp ${item.hargaCoret.toLocaleString('id-ID')}</span>
          </div>
          <div class="product-meta">★ ${item.rating} | Stok: ${item.stok}</div>
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

// 1. FUNGSI KERANJANG DAN BELI LANGSUNG KE CHECKOUT
function tambahKeKeranjang(id) {
  const barang = daftarBarang.find(b => b.id === id);
  if (barang) {
    keranjang.push(barang);
    updateCartBadge();
    tampilkanModalEstetik({
      judul: "Berhasil!",
      deskripsi: `${barang.nama} telah ditambahkan ke keranjang.`,
      tipe: "alert"
    });
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
    container.innerHTML = "<p>Keranjang Anda masih kosong.</p>";
    return;
  }

  let total = 0;
  let html = `<h3>Ringkasan Pesanan:</h3><ul style="margin: 15px 0; padding-left:20px;">`;
  keranjang.forEach(item => {
    total += item.hargaJual;
    html += `<li>${item.nama} - <b>Rp ${item.hargaJual.toLocaleString('id-ID')}</b></li>`;
  });
  html += `</ul><h4>Total Bayar: <span style="color:#ff3385">Rp ${total.toLocaleString('id-ID')}</span></h4>
  <button class="m-btn m-btn-confirm" style="margin-top:15px;" onclick="prosesBayar()">Bayar Sekarang</button>`;
  container.innerHTML = html;
}

function prosesBayar() {
  tampilkanModalEstetik({
    judul: "Pembayaran Berhasil!",
    deskripsi: "Terima kasih sudah berbelanja di MochiShop.",
    tipe: "alert"
  });
  keranjang = [];
  updateCartBadge();
}

// 2. RENDER TABEL EDIT HARGA DENGAN NOMOR URUT RAPI (1, 2, 3...)
function renderTabelHarga() {
  const tbody = document.getElementById("tabelHargaBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  daftarBarang.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.nama}</td>
      <td>Rp ${item.hargaBeli.toLocaleString('id-ID')}</td>
      <td style="color: #ff3385; font-weight: bold;">Rp ${item.hargaJual.toLocaleString('id-ID')}</td>
      <td>
        <button class="btn-edit" onclick="bukaModalEditHarga(${item.id})">
          Edit Harga
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// 3. MODAL EDIT HARGA PENGGANTI BROWSER GOOGLE
function bukaModalEditHarga(id) {
  const barang = daftarBarang.find(b => b.id === id);
  if (!barang) return;

  const modalInput = document.getElementById("modalInput");
  modalInput.value = barang.hargaJual;

  tampilkanModalEstetik({
    judul: "Edit Harga Jual",
    deskripsi: `Masukkan harga baru untuk ${barang.nama}:`,
    tipe: "prompt",
    onConfirm: () => {
      const hargaBaru = parseInt(modalInput.value);
      if (!isNaN(hargaBaru) && hargaBaru > 0) {
        barang.hargaJual = hargaBaru;
        renderTabelHarga();
        renderKatalog();
        
        setTimeout(() => {
          tampilkanModalEstetik({
            judul: "Sukses!",
            deskripsi: "Harga berhasil diperbarui.",
            tipe: "alert"
          });
        }, 150);
      }
    }
  });
}

function tampilkanModalEstetik({ judul, deskripsi, tipe = "alert", onConfirm }) {
  const modal = document.getElementById("mochiModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalInput = document.getElementById("modalInput");
  const btnCancel = document.getElementById("modalBtnCancel");
  const btnConfirm = document.getElementById("modalBtnConfirm");

  modalTitle.innerText = judul;
  modalDescription.innerText = deskripsi;

  if (tipe === "alert") {
    modalInput.style.display = "none";
    btnCancel.style.display = "none";
  } else {
    modalInput.style.display = "block";
    btnCancel.style.display = "inline-block";
  }

  modal.classList.add("active");

  btnConfirm.onclick = () => {
    modal.classList.remove("active");
    if (onConfirm) onConfirm();
  };

  btnCancel.onclick = () => {
    modal.classList.remove("active");
  };
}

// NAVIGATION SWITCHER
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

// EVENT INIT
window.onload = function() {
  renderKatalog();
  renderTabelHarga();
};
