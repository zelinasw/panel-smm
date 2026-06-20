// ==========================================
// 1. LOGIKA UNTUK PROSES ORDER FOLLOWERS
// ==========================================
document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const service = document.getElementById('service').value;
    const target = document.getElementById('target').value;
    const quantity = document.getElementById('quantity').value;
    const resMsg = document.getElementById('responseMessage');

    // Reset status pesan
    resMsg.classList.remove('hidden', 'bg-green-600', 'bg-red-600');
    resMsg.innerText = "Memproses pesanan...";
    resMsg.classList.add('bg-blue-600');

    try {
        // Mengirim data orderan ke Backend Cloudflare Worker (/api/order)
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ service, target, quantity })
        });

        const result = await response.json();

        resMsg.classList.remove('bg-blue-600');
        
        // Cek status respon dari server Medanpedia (biasanya mengembalikan status: true/false)
        if (response.ok && result.status === true) {
            const orderId = result.data ? result.data.id : 'Berhasil';
            resMsg.innerText = `Sukses! Order ID: ${orderId}`;
            resMsg.classList.add('bg-green-600');
            
            // Refresh saldo otomatis setelah sukses melakukan pemesanan
            getSaldo();
        } else {
            // Tampilkan pesan error bawaan dari Medanpedia jika ada
            resMsg.innerText = `Gagal: ${result.data || result.error || 'Terjadi kesalahan pada server API.'}`;
            resMsg.classList.add('bg-red-600');
        }
    } catch (error) {
        resMsg.innerText = "Gagal terhubung ke server backend.";
        resMsg.classList.add('bg-red-600');
    }
});

// ==========================================
// 2. LOGIKA UNTUK CEK SALDO ADMIN
// ==========================================
async function getSaldo() {
    const saldoEl = document.getElementById('saldoAdmin');
    try {
        const response = await fetch('/api/saldo');
        const result = await response.json();

        if (response.ok && result.status === true) {
            // Ambil saldo dari data profile Medanpedia
            const balance = result.data.balance;
            saldoEl.innerText = "Rp " + Number(balance).toLocaleString('id-ID');
        } else {
            saldoEl.innerText = "Gagal memuat";
            saldoEl.className = "font-bold text-red-400";
        }
    } catch (error) {
        saldoEl.innerText = "Error koneksi";
        saldoEl.className = "font-bold text-red-400";
    }
}

// Jalankan fungsi load saldo otomatis saat halaman web pertama kali dibuka
document.addEventListener('DOMContentLoaded', getSaldo);
