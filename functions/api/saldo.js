export async function onRequestGet(context) {
    try {
        const API_ID = context.env.SMM_PROVIDER_ID;
        const API_KEY = context.env.SMM_PROVIDER_KEY;
        const API_URL = context.env.SMM_PROVIDER_URL || "https://medanpedia.co.id/api/v2";

        if (!API_KEY || !API_ID) {
            return new Response(JSON.stringify({ error: "Kredensial belum lengkap di Cloudflare" }), { status: 500 });
        }

        // Siapkan parameter sesuai dokumentasi Medanpedia untuk cek saldo
        const params = new URLSearchParams();
        params.append('api_id', API_ID);
        params.append('key', API_KEY);
        params.append('action', 'profile'); // Action 'profile' digunakan untuk cek saldo/profil

        const providerResponse = await fetch(API_URL, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const data = await providerResponse.json();

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
