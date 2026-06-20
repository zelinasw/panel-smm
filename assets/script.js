document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const service = document.getElementById('service').value;
    const target = document.getElementById('target').value;
    const quantity = document.getElementById('quantity').value;
    const resMsg = document.getElementById('responseMessage');

    resMsg.classList.remove('hidden', 'bg-green-600', 'bg-red-600');
    resMsg.innerText = "Memproses pesanan...";
    resMsg.classList.add('bg-blue-600');

    try {
        // Nembak ke fungsi backend Cloudflare Pages kita nanti
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ service, target, quantity })
        });

        const result = await response.json();

        resMsg.classList.remove('bg-blue-600');
        if (response.ok && !result.error) {
            resMsg.innerText = `Sukses! Order ID: ${result.order}`;
            resMsg.classList.add('bg-green-600');
        } else {
            resMsg.innerText = `Gagal: ${result.error || 'Terjadi kesalahan'}`;
            resMsg.classList.add('bg-red-600');
        }
    } catch (error) {
        resMsg.innerText = "Gagal terhubung ke server.";
        resMsg.classList.add('bg-red-600');
    }
});
