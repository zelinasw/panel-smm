export async function onRequestPost(context) {
    try {
        // 1. Ambil data input dari frontend
        const { service, target, quantity } = await context.request.json();

        // 2. Ambil Kredensial dari Environment Variables Cloudflare
        const API_ID = context.env.SMM_PROVIDER_ID;
        const API_KEY = context.env.SMM_PROVIDER_KEY;
        const API_URL = context.env.SMM_PROVIDER_URL || "https://medanpedia.co.id/api/v2";

        if (!API_KEY || !API_ID) {
            return new Response(JSON.stringify({ error: "API ID atau API Key belum di-config di Cloudflare" }), { status: 500 });
        }

        // 3. Oper pesanan ke Medanpedia (menggunakan api_id dan key)
        const params = new URLSearchParams();
        params.append('api_id', API_ID);
        params.append('key', API_KEY);
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

        const data = await providerResponse.json();

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
