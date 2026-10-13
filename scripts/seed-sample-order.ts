import { createClient } from "@supabase/supabase-js";

async function seedSampleOrder() {
    console.log("==================================================");
    console.log("🌱 LUXORA HOME - SCRIPT POPULARE COMANDĂ TEST (SEED)");
    console.log("==================================================\n");

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey =
        process.env.SUPABASE_SECRET_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_PUBLISHABLE_KEY ||
        process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.log("⚠️ AVERTISMENT: Variabilele SUPABASE_URL / SUPABASE_SECRET_KEY nu sunt configurate în .env.local.");
        console.log("  Scriptul seed este pregătit și gata de rulare la conectarea bazei de date Supabase de producție.");
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const sampleOrder = {
        order_number: `LH-SEED-${randomSuffix}`,
        customer_name: "Ion Popescu (Comanda Test Seed)",
        phone: "0722112233",
        email: "test.seed@luxorahome.ro",
        county: "Cluj",
        city: "Cluj-Napoca",
        street: "Strada Avram Iancu",
        number: "15",
        building: "A1",
        entrance: "1",
        apartment: "4",
        postal_code: "400083",
        quantity: 2,
        order_bump_included: true,
        product_name: "Perie electrică rotativă de curățare 5-în-1 (2 buc.) + Set Rezervă 5 Capete",
        unit_price: 99.95,
        total_price: 229.80,
        status: "new",
        notes: "Comanda generata automat din scriptul db:seed pentru testarea panoului Admin",
        created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("orders").insert([sampleOrder]).select();

    if (error) {
        console.error("❌ Eroare la inserarea comenzii de test în Supabase:", error.message);
        process.exit(1);
    } else {
        console.log("✅ Comandă de test inserată cu succes!");
        console.log(`  Cod Comandă: ${sampleOrder.order_number}`);
        console.log(`  Client: ${sampleOrder.customer_name}`);
        console.log(`  Valoare Ramburs: ${sampleOrder.total_price} lei`);
        console.log("\nAccesează /admin pentru a procesa comanda generată.");
    }
}

seedSampleOrder();
