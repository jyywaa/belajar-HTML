// DATA BARANG (Data lama dipertahankan)
let daftarBarang = [
  { id: 1, nama: "Ayam Geprek", hargaBeli: 14400, hargaJual: 18000, stok: 35 },
  { id: 2, nama: "Nasi Goreng", hargaBeli: 16000, hargaJual: 20000, stok: 20 },
  { id: 5, nama: "Matcha Latte", hargaBeli: 17600, hargaJual: 22000, stok: 15 },
  { id: 7, nama: "Es Krim Mochi", hargaBeli: 11000, hargaJual: 15000, stok: 40 },
  { id: 9, nama: "Cardigan Pink", hargaBeli: 96000, hargaJual: 120000, stok: 10 },
  { id: 10, nama: "Sweater", hargaBeli: 80000, hargaJual: 100000, stok: 8 }
];

let keranjang = [];

// 1. PENANGANAN TOMBOL BELI DAN KERANJANG
function tambahKeKeranjang(idBarang) {
  const barang = daftarBarang.find(b => b.id === idBarang);
  if (barang) {
    keranjang.push(barang);
    updateBadgeKeranjang();
    tampilkanModalEstetik({
      judul: "Berhasil!",
      deskripsi: `${barang.nama} telah ditambahkan ke keranjang belanja.`,
      tipe: "alert"
    });
  }
}

function beliLangsung(idBarang) {
  const barang = daftarBarang.find(b => b.id === idBarang);
  if (barang) {
    keranjang.push(barang);
    updateBadgeKeranjang();
    // Langsung arahkan ke halaman checkout
    window.location.href = "checkout.html"; // Ubah sesuai nama file checkout Anda
  }
}

function updateBadgeKeranjang() {
  const badge = document.querySelector(".keranjang-count");
  if (badge) {
    badge.innerText = keranjang.length;
  }
}

// 2. PEMBARUAN VIEW DAN DAFTAR HARGA (NOMOR URUT DIBERSIHKAN: 1, 2, 3...)
function renderTabelHarga() {
  const tbody = document.getElementById("tabelHargaBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  daftarBarang.forEach((barang, index) => {
    const row = document.createElement("tr");

    // Kolom 1 menggunakan (index + 1) agar urut 1, 2, 3, 4, dst.
    row.innerHTML = `
      <td>${index + 1}</td> 
      <td>${barang.nama}</td>
      <td>Rp ${barang.hargaBeli.toLocaleString('id-ID')}</td>
      <td style="color: #ff3385; font-weight: bold;">Rp ${barang.hargaJual.toLocaleString('id-ID')}</td>
      <td>
        <button class="mochi-btn mochi-btn-primary" style="background-color: #ffc107; color: #333;" onclick="bukaModalEditHarga(${barang.id})">
          Edit Harga
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// 3. MODAL CUSTOM (MENGGANTIKAN PROMPT / OK GOOGLE BROWSER)
let currentEditId = null;

function bukaModalEditHarga(idBarang) {
  const barang = daftarBarang.find(b => b.id === idBarang);
  if (!barang) return;

  currentEditId = idBarang;
  
  const modalInput = document.getElementById("modalInput");
  modalInput.style.display = "block";
  modalInput.value = barang.hargaJual;

  tampilkanModalEstetik({
    judul: "Edit Harga Jual",
    deskripsi: `Masukkan harga jual baru untuk ${barang.nama}:`,
    tipe: "prompt",
    onConfirm: () => {
      const hargaBaru = parseInt(modalInput.value);
      if (!isNaN(hargaBaru) && hargaBaru > 0) {
        barang.hargaJual = hargaBaru;
        renderTabelHarga();
        
        // Notifikasi Sukses
        setTimeout(() => {
          tampilkanModalEstetik({
            judul: "Sukses!",
            deskripsi: "Harga berhasil diperbarui.",
            tipe: "alert"
          });
        }, 200);
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

// Inisialisasi awal saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  renderTabelHarga();
});
