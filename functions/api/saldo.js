export async function onRequestGet(context) {
    try {
        const API_ID = context.env.SMM_PROVIDER_ID;
        const API_KEY = context.env.SMM_PROVIDER_KEY;
        const API_URL = context.env.SMM_PROVIDER_URL || "https://medanpedia.co.id/api/json";

        if (!API_KEY || !API_ID) {
            return new Response(JSON.stringify({ 
                status: false, 
                data: "Kredensial belum lengkap di Cloudflare."
            }), { headers: { 'Content-Type': 'application/json' } });
        }

        const params = new URLSearchParams();
        // Kita kirim dua versi parameter yang sering dipakai Medanpedia biar tidak salah paham
        params.append('api_id', String(API_ID).trim());
        params.append('api_key', String(API_KEY).trim()); // Beberapa dokumentasi minta api_key
        params.append('key', String(API_KEY).trim());     // Beberapa dokumentasi minta key saja
        params.append('action', 'profile');

        const providerResponse = await fetch(API_URL, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const responseText = await providerResponse.text();
        return new Response(responseText, {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ status: false, data: error.message }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
