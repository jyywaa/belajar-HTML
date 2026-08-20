// DATA BARANG DENGAN NOMOR DAN HARGA ASLI
let daftarBarang = [
  { id: 1, nama: "Ayam Geprek", hargaBeli: 14400, hargaJual: 18000 },
  { id: 2, nama: "Nasi Goreng", hargaBeli: 16000, hargaJual: 20000 },
  { id: 5, nama: "Matcha Latte", hargaBeli: 17600, hargaJual: 22000 },
  { id: 7, nama: "Es Krim Mochi", hargaBeli: 11000, hargaJual: 15000 },
  { id: 9, nama: "Cardigan Pink", hargaBeli: 96000, hargaJual: 120000 },
  { id: 10, nama: "Sweater", hargaBeli: 80000, hargaJual: 100000 }
];

let keranjang = [];

// 1. RENDERING TABEL HARGA DENGAN NOMOR URUT RAPI (1, 2, 3, DST)
function renderTabelHarga() {
  const tbody = document.getElementById("tabelHargaBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  daftarBarang.forEach((barang, index) => {
    const row = document.createElement("tr");

    // Menggunakan (index + 1) agar penomoran urut dari 1, 2, 3, dst.
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${barang.nama}</td>
      <td>Rp ${barang.hargaBeli.toLocaleString('id-ID')}</td>
      <td style="color: #ff3385; font-weight: bold;">Rp ${barang.hargaJual.toLocaleString('id-ID')}</td>
      <td>
        <button class="btn-edit-harga" onclick="bukaModalEditHarga(${barang.id})">
          Edit Harga
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// 2. FUNGSI BELI DAN TAMPILAN KERANJANG
function tambahKeKeranjang(idBarang) {
  const barang = daftarBarang.find(b => b.id === idBarang);
  if (barang) {
    keranjang.push(barang);
    tampilkanModalEstetik({
      judul: "Berhasil!",
      deskripsi: `${barang.nama} berhasil masuk ke keranjang.`,
      tipe: "alert"
    });
  }
}

function beliLangsung(idBarang) {
  const barang = daftarBarang.find(b => b.id === idBarang);
  if (barang) {
    keranjang.push(barang);
    // Langsung menuju ke halaman checkout
    window.location.href = "checkout.html";
  }
}

// 3. LOGIKA MODAL CUSTOM UNTUK EDIT HARGA (GANTI ALERTS/PROMPT GOOGLE)
function bukaModalEditHarga(idBarang) {
  const barang = daftarBarang.find(b => b.id === idBarang);
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
        
        setTimeout(() => {
          tampilkanModalEstetik({
            judul: "Berhasil!",
            deskripsi: "Harga barang telah diperbarui.",
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

// EKSEKUSI DATA SETELAH SEMUA ELEMENT DILUAT
window.onload = function() {
  renderTabelHarga();
};
