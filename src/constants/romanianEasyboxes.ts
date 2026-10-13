export interface EasyboxLocker {
    id: string;
    name: string;
    address: string;
    city: string;
    county: string;
}

export const POPULAR_EASYBOXES: EasyboxLocker[] = [
    // București
    { id: "EBX-B-001", name: "Easybox Petrom Piața Victoriei", address: "Bulevardul Aviatorilor 2, București", city: "București", county: "București" },
    { id: "EBX-B-002", name: "Easybox Kaufland Mihai Bravu", address: "Șoseaua Mihai Bravu 455, București", city: "București", county: "București" },
    { id: "EBX-B-003", name: "Easybox OMV Iuliu Maniu", address: "Bulevardul Iuliu Maniu 120, București", city: "București", county: "București" },
    { id: "EBX-B-004", name: "Easybox Rompetrol Unirii", address: "Bulevardul Unirii 35, București", city: "București", county: "București" },
    { id: "EBX-B-005", name: "Easybox Carrefour Orhideea", address: "Calea Plevnei 210, București", city: "București", county: "București" },

    // Cluj
    { id: "EBX-CJ-001", name: "Easybox Kaufland Mănăștur", address: "Strada Câmpului 9, Cluj-Napoca", city: "Cluj-Napoca", county: "Cluj" },
    { id: "EBX-CJ-002", name: "Easybox OMV Calea Turzii", address: "Calea Turzii 178, Cluj-Napoca", city: "Cluj-Napoca", county: "Cluj" },
    { id: "EBX-CJ-003", name: "Easybox Iulius Mall Cluj", address: "Strada Alexandru Vaida Voevod 53B, Cluj-Napoca", city: "Cluj-Napoca", county: "Cluj" },

    // Timiș
    { id: "EBX-TM-001", name: "Easybox Iulius Town Timișoara", address: "Strada Aristide Demetriade 1, Timișoara", city: "Timișoara", county: "Timiș" },
    { id: "EBX-TM-002", name: "Easybox Kaufland Gheorghe Lazăr", address: "Strada Gheorghe Lazăr 26, Timișoara", city: "Timișoara", county: "Timiș" },

    // Iași
    { id: "EBX-IS-001", name: "Easybox Palas Mall Iași", address: "Strada Palas 7A, Iași", city: "Iași", county: "Iași" },
    { id: "EBX-IS-002", name: "Easybox Kaufland Pacurari", address: "Șoseaua Păcurari 86, Iași", city: "Iași", county: "Iași" },

    // Brașov
    { id: "EBX-BV-001", name: "Easybox Coresi Shopping Resort", address: "Strada Zaharia Stancu 1, Brașov", city: "Brașov", county: "Brașov" },
    { id: "EBX-BV-002", name: "Easybox OMV Calea București", address: "Calea București 102, Brașov", city: "Brașov", county: "Brașov" },

    // Constanța
    { id: "EBX-CT-001", name: "Easybox City Park Mall Constanța", address: "Bulevardul Alexandru Lăpușneanu 116, Constanța", city: "Constanța", county: "Constanța" },
    { id: "EBX-CT-002", name: "Easybox Kaufland Tomis Nord", address: "Bulevardul Tomis 391, Constanța", city: "Constanța", county: "Constanța" },

    // Prahova (Ploiești)
    { id: "EBX-PH-001", name: "Easybox Afi Ploiești", address: "Strada Calomfirescu 2, Ploiești", city: "Ploiești", county: "Prahova" },

    // Bihor (Oradea)
    { id: "EBX-BH-001", name: "Easybox Lotus Center Oradea", address: "Nufărului 30, Oradea", city: "Oradea", county: "Bihor" },

    // Dolj (Craiova)
    { id: "EBX-DJ-001", name: "Easybox Electroputere Parc Craiova", address: "Calea București 80, Craiova", city: "Craiova", county: "Dolj" },

    // Sibiu
    { id: "EBX-SB-001", name: "Easybox Shopping City Sibiu", address: "Soseaua Sibiului 5, Șelimbăr / Sibiu", city: "Sibiu", county: "Sibiu" },
];

export function getEasyboxesForLocation(county: string, city?: string): EasyboxLocker[] {
    const normCounty = county.trim().toLowerCase();
    const normCity = city ? city.trim().toLowerCase() : "";

    return POPULAR_EASYBOXES.filter((box) => {
        const matchCounty = box.county.toLowerCase() === normCounty;
        const matchCity = normCity ? box.city.toLowerCase().includes(normCity) || normCity.includes(box.city.toLowerCase()) : true;
        return matchCounty && matchCity;
    });
}
