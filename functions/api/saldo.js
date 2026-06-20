export async function onRequestGet(context) {
    try {
        const API_ID = context.env.SMM_PROVIDER_ID;
        const API_KEY = context.env.SMM_PROVIDER_KEY;
        const API_URL = context.env.SMM_PROVIDER_URL || "https://medanpedia.co.id/api/v2";

        // Jika variabel kosong (pembacaan environment bermasalah di Cloudflare)
        if (!API_KEY || !API_ID) {
            return new Response(JSON.stringify({ 
                status: false, 
                data: `Variabel Cloudflare belum terbaca sempurna. ID: ${!!API_ID}, KEY: ${!!API_KEY}`
            }), { headers: { 'Content-Type': 'application/json' } });
        }

        const params = new URLSearchParams();
        params.append('api_id', String(API_ID).trim());
        params.append('key', String(API_KEY).trim());
        params.append('action', 'profile');

        const providerResponse = await fetch(API_URL, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Ambil respon mentah dalam bentuk teks dulu, untuk menghindari error JSON parsing terputus
        const responseText = await providerResponse.text();
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            // Kalau Medanpedia mengembalikan halaman HTML berisi block/IP error, akan tertangkap di sini
            return new Response(JSON.stringify({ 
                status: false, 
                data: `Respon Medanpedia bukan JSON. Isi respon: ${responseText.substring(0, 100)}` 
            }), { headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ status: false, data: "Crash Server: " + error.message }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
