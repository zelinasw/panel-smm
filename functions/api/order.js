export async function onRequestPost(context) {
    try {
        // 1. Ambil data input dari frontend
        const { service, target, quantity } = await context.request.json();

        // 2. Ambil API Key & URL dari Environment Variables Cloudflare
        const API_KEY = context.env.SMM_PROVIDER_KEY;
        const API_URL = context.env.SMM_PROVIDER_URL || "https://api-provider-smm.com/v2";

        if (!API_KEY) {
            return new Response(JSON.stringify({ error: "API Key belum di-config di Cloudflare" }), { status: 500 });
        }

        // 3. Oper pesanan ke SMM Provider menggunakan format URLSearchParams (standar API SMM)
        const params = new URLSearchParams();
        params.append('key', API_KEY);
        params.append('action', 'add');
        params.append('service', service);
        params.append('link', target);
        params.append('quantity', quantity);

        const providerResponse = await fetch(API_URL, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const data = await providerResponse.json();

        // 4. Balikin respon dari provider ke frontend kamu
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
