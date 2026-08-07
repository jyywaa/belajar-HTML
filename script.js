const produkKomentar={
 1:[{nama:"Karina",text:"Pedesnya nampol! Sambalnya enak banget"}],
 2:[{nama:"Ata",text:"Nasi gorengnya gurih, porsi banyak"}],
 5:[{nama:"Carmen",text:"Matchanya creamy, gak kemanisan"}],
 7:[{nama:"Karel",text:"Es krim mochinya lumer, enak!"}],
 9:[{nama:"Sinta",text:"Bahannya lembut tebal bagus banget"}],
 10:[{nama:"Budi",text:"Sweaternya hangat, cocok buat malem"}],
 14:[{nama:"Lia",text:"Jeansnya tebal, jahitannya rapi"}]
};

const products=[
{id:1,nama:"Ayam Geprek",harga:18000,old:22000,diskon:"18% OFF",rating:4.8,img:"https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80",kat:"food",sub:"berat",desc:"Ayam geprek enak pedas gurih mantap! Daging empuk, sambal nampol bikin nagih."},
{id:2,nama:"Nasi Goreng",harga:20000,old:24000,diskon:"15% OFF",rating:4.7,img:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80",kat:"food",sub:"berat",desc:"Nasi goreng enak spesial MochiShop. Bumbu meresap, wangi, porsi jumbo + telur & kerupuk"},
{id:5,nama:"Matcha Latte",harga:22000,diskon:"Promo",rating:4.8,img:"https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80",kat:"food",sub:"minuman",desc:"Matcha latte creamy premium."},
{id:7,nama:"Es Krim Mochi",harga:15000,old:18000,diskon:"B1G1",rating:4.9,img:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80",kat:"food",sub:"dessert",desc:"Es krim isi mochi lembut lumer."},
{id:9,nama:"Cardigan Pink",harga:120000,old:150000,diskon:"20% OFF",rating:4.8,img:"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=400&q=80",kat:"outfit",sub:"cardigan",desc:"Cardigan bahan lembut, tebal, bagus."},
{id:10,nama:"Sweater Oversize",harga:135000,diskon:"Terlaris",rating:4.7,img:"https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80",kat:"outfit",sub:"sweater",desc:"Sweater oversize bahan fleece tebal hangat."},
{id:14,nama:"Jeans Biru",harga:160000,old:200000,diskon:"20% OFF",rating:4.8,img:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80",kat:"outfit",sub:"jeans",desc:"Jeans biru slimfit bahan denim tebal."}];

let cart=JSON.parse(localStorage.getItem('mochiCart')||'[]');
let barang=JSON.parse(localStorage.getItem('barang')||'[]');
let pesanan=JSON.parse(localStorage.getItem('pesanan')||'[{"id":1,"pembeli":"Syera","total":36000,"status":"dikemas","tgl":"2026-08-06"}]');

function toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1500)}
function login(){let u=document.getElementById('username').value;let p=document.getElementById('password').value;if(u=='meila' && p=='meila123'){showPage('adminPage');refreshAdmin()}else if(u=='customer' && p=='123'){showPage('customerPage');init()}else toast('Username/Password salah')}
function logout(){showPage('loginPage')}
function showPage(id){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(id).classList.add('active')}
function showAdmin(id,el){document.querySelectorAll('.main > div').forEach(t=>t.style.display='none');document.getElementById(id).style.display='block';document.querySelectorAll('.sidebar div').forEach(d=>d.classList.remove('active'));if(el)el.classList.add('active')}
function refreshAdmin(){document.getElementById('totalBarang').innerText=barang.length;document.getElementById('totalStok').innerText=barang.reduce((a,b)=>a+(b.stok||0),0);document.getElementById('totalPesanan').innerText=pesanan.length;document.getElementById('tabelBarang').innerHTML=barang.map(b=>`<tr><td>${b.nama}</td><td>Rp${b.harga.toLocaleString()}</td><td>${b.stok}</td><td><button onclick="hapus(${b.id})">Hapus</button></td></tr>`).join('');document.getElementById('tabelPesanan').innerHTML=pesanan.map(p=>`<tr><td>#MCH00${p.id}</td><td>${p.pembeli}</td><td>Rp${p.total.toLocaleString()}</td><td><span class="status ${p.status}">${p.status}</span></td><td><select onchange="ubahStatus(${p.id},this.value)"><option>Dikemas</option><option>Dikirim</option><option>Selesai</option></select></td></tr>`).join('')}
function tambahBarang(){barang.push({id:Date.now(),nama:document.getElementById('namaBarang').value,harga:+document.getElementById('hargaBarang').value,stok:+document.getElementById('stokBarang').value});localStorage.setItem('barang',JSON.stringify(barang));toast('Barang tersimpan');refreshAdmin()}
function hapus(id){barang=barang.filter(b=>b.id!=id);localStorage.setItem('barang',JSON.stringify(barang));refreshAdmin()}
function ubahStatus(id,val){pesanan.find(x=>x.id==id).status=val.toLowerCase();localStorage.setItem('pesanan',JSON.stringify(pesanan));refreshAdmin()}
function buatLaporan(){let jenis=document.getElementById('jenisLaporan').value;let awal=new Date(document.getElementById('tglAwal').value);let akhir=new Date(document.getElementById('tglAkhir').value);let data=pesanan.filter(p=>{let t=new Date(p.tgl);if(jenis=='harian')return t>=awal&&t<=akhir;if(jenis=='bulanan')return t.getMonth()==awal.getMonth()&&t.getFullYear()==awal.getFullYear();if(jenis=='tahunan')return t.getFullYear()==awal.getFullYear()});document.getElementById('tabelLaporan').innerHTML=data.map(p=>`<tr><td>${p.tgl}</td><td>#MCH00${p.id}</td><td>Rp${p.total.toLocaleString()}</td></tr>`).join('')||'<tr><td colspan=3>Data kosong</td></tr>'}
function render(list,target){const el=document.getElementById(target);if(el)el.innerHTML=list.map(p=>`<div class="card-cus" onclick="showDetail(${p.id})"><span class="badge">${p.diskon}</span><img src="${p.img}"><div class="info"><div style="font-weight:700">${p.nama}</div><div><span class="price">Rp${p.harga.toLocaleString()}</span> <span class="old">Rp${p.old?.toLocaleString()}</span></div><div>★ ${p.rating}</div><div class="card-actions"><span class="btn-icon" onclick="event.stopPropagation();addCart(${p.id})">🛒</span><button class="btn-beli" onclick="event.stopPropagation();addCart(${p.id})">Beli</button></div></div></div>`).join('')}
function init(){render(products,'homeGrid');render(products.filter(p=>p.kat=='food'),'foodGrid');render(products.filter(p=>p.kat=='outfit'),'outfitGrid');render(products.filter(p=>p.old),'promoGrid');renderCart();updateCount()}
function showDetail(id){const p=products.find(x=>x.id==id);const kom=produkKomentar[id]||[];document.getElementById('detailContent').innerHTML=`<img src="${p.img}" style="width:100%;border-radius:18px;margin-top:10px"><h2>${p.nama}</h2><p style="color:#555;margin:8px 0">${p.desc}</p><div class="price" style="font-size:20px">Rp${p.harga.toLocaleString()}</div><button class="btn" onclick="addCart(${p.id})">🛒 Beli Sekarang</button><h4 style="margin-top:16px">Komentar Pembeli</h4>${kom.map(k=>`<div class="comment"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" class="avatar-sm"><b>${k.nama}:</b> ${k.text}</div>`).join('')}`;setCusTab('detail')}
function addCart(id){cart.push(products.find(x=>x.id==id));localStorage.setItem('mochiCart',JSON.stringify(cart));updateCount();toast('Masuk keranjang 🛒');renderCart()}
function renderCart(){if(cart.length==0){document.getElementById('cartList').innerHTML="<p style='text-align:center'>Keranjang kosong</p>";document.getElementById('total').innerText="";return}document.getElementById('cartList').innerHTML=cart.map((c,i)=>`<div class="cart-item"><img src="${c.img}" style="width:70px;height:70px;border-radius:12px"><div><div style="font-weight:700">${c.nama}</div><div class="price">Rp${c.harga.toLocaleString()}</div><button onclick="hapusCart(${i})" style="color:red;border:none;background:none">Hapus</button></div></div>`).join('');document.getElementById('total').innerText="Total: Rp"+cart.reduce((a,b)=>a+b.harga,0).toLocaleString()}
function hapusCart(i){cart.splice(i,1);localStorage.setItem('mochiCart',JSON.stringify(cart));renderCart();updateCount()}
function checkout(){if(cart.length==0)return toast('Keranjang kosong');pesanan.push({id:Date.now(),pembeli:"Syera",total:cart.reduce((a,b)=>a+b.harga,0),status:"dikemas",tgl:new Date().toISOString().split('T')[0]});localStorage.setItem('pesanan',JSON.stringify(pesanan));toast('Checkout berhasil!');cart=[];localStorage.setItem('mochiCart','[]');renderCart();updateCount();navCus('home')}
function updateCount(){const el=document.getElementById('cartCount');if(el)el.innerText=cart.length}
function search(){const q=document.getElementById('searchInput').value.toLowerCase();render(products.filter(p=>p.nama.toLowerCase().includes(q)),'homeGrid')}
function setCusTab(tab,el){document.querySelectorAll('.cus-tab').forEach(t=>t.style.display='none');document.getElementById(tab).style.display='block';if(el){document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));el.classList.add('active')}}
function navCus(tab,e){setCusTab(tab);document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));if(e&&e.currentTarget)e.currentTarget.classList.add('active')}
function back(){setCusTab('home')}
function filterFood(sub){if(sub=='semua')render(products.filter(p=>p.kat=='food'),'foodGrid');else render(products.filter(p=>p.kat=='food'&&p.sub==sub),'foodGrid')}
function filterOutfit(sub){render(products.filter(p=>p.kat=='outfit'&&p.sub==sub),'outfitGrid')}
function searchFood(){const q=document.getElementById('searchFood').value.toLowerCase();render(products.filter(p=>p.kat=='food'&&p.nama.toLowerCase().includes(q)),'foodGrid')}
function searchOutfit(){const q=document.getElementById('searchOutfit').value.toLowerCase();render(products.filter(p=>p.kat=='outfit'&&p.nama.toLowerCase().includes(q)),'outfitGrid')}
