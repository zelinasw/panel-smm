export async function onRequestGet(context) {
    try {
        const API_ID = context.env.SMM_PROVIDER_ID;
        const API_KEY = context.env.SMM_PROVIDER_KEY;
        const API_URL = context.env.SMM_PROVIDER_URL || "https://medanpedia.co.id/api/v2";

        // Proteksi jika variabel di Cloudflare belum terbaca atau salah nama
        if (!API_KEY || !API_ID) {
            return new Response(JSON.stringify({ 
                status: false, 
                error: `Kredensial belum lengkap di Cloudflare. ID ada: ${!!API_ID}, KEY ada: ${!!API_KEY}` 
            }), { 
                status: 200, // Kita set 200 dulu agar tidak memicu error 500 keras, jadi teks errornya kelihatan
                headers: { 'Content-Type': 'application/json' } 
            });
        }

        const params = new URLSearchParams();
        params.append('api_id', API_ID.trim()); // pakai .trim() buat jaga-jaga kalau ada spasi gak sengaja
        params.append('key', API_KEY.trim());
        params.append('action', 'profile');

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
        // Jika ada crash kodingan, dia akan memunculkan teks errornya di halaman web bukan error 500 kosong
        return new Response(JSON.stringify({ status: false, error: "Crash Serverless: " + error.message }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
