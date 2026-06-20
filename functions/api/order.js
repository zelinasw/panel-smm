export async function onRequestPost(context) {
    try {
        // 1. Ambil data input dari frontend
        const { service, target, quantity } = await context.request.json();

        // 2. Ambil Kredensial dari Environment Variables Cloudflare
        const API_ID = context.env.SMM_PROVIDER_ID;
        const API_KEY = context.env.SMM_PROVIDER_KEY;
        // Mengubah fallback URL langsung ke endpoint /api/json milik Medanpedia
        const API_URL = context.env.SMM_PROVIDER_URL || "https://medanpedia.co.id/api/json";

        if (!API_KEY || !API_ID) {
            return new Response(JSON.stringify({ error: "API ID atau API Key belum di-config di Cloudflare" }), { status: 500 });
        }

        // 3. Oper pesanan ke Medanpedia (menggunakan api_id dan key)
        const params = new URLSearchParams();
        params.append('api_id', String(API_ID).trim());
        params.append('key', String(API_KEY).trim());
        params.append('action', 'order'); // Untuk Medanpedia, action-nya adalah 'order'
        params.append('service', service);
        params.append('target', target);   // Medanpedia menggunakan parameter 'target'
        params.append('quantity', quantity);

        const providerResponse = await fetch(API_URL, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Ambil respon mentah teks dulu untuk keamanan parsing JSON
        const responseText = await providerResponse.text();
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            return new Response(JSON.stringify({ 
                status: false, 
                error: `Respon server bukan JSON valid. Isi: ${responseText.substring(0, 100)}` 
            }), { headers: { 'Content-Type': 'application/json' } });
        }

        // 4. Kembalikan respon dari provider ke frontend
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
