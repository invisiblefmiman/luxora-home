export interface QuantityBundle {
  quantity: number;
  title: string;
  price: number;
  originalPrice: number;
  savings: number;
  shippingFee: number;
  badge?: string;
}

export interface OrderBumpConfig {
  title: string;
  description: string;
  price: number;
}

export interface ProductConfig {
  brandName: string;
  name: string;
  subtitle: string;
  tagline: string;
  badge: string;
  pricing: {
    oldPrice: number;
    currentPrice: number;
    currency: string;
    formattedOldPrice: string;
    formattedCurrentPrice: string;
    saveAmount: string;
  };
  bundles: QuantityBundle[];
  orderBump: OrderBumpConfig;
  editableSpecs: {
    autonomy: string;
    chargingTime: string;
    headCount: number;
    waterResistance: string;
    power: string;
    packageContents: string[];
    warranty: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    cui: string;
    regCom?: string;
    companyName: string;
    socialCapital?: string;
  };
  shipping: {
    estimatedDays: string;
    courierName: string;
    deliveryFee: number;
    freeShippingThreshold: number;
  };
  images: {
    hero: string;
    attachments: string;
    before: string;
    after: string;
  };
}

export const PRODUCT_CONFIG: ProductConfig = {
  brandName: "LUXORA HOME",
  name: "Perie electrică rotativă de curățare 5-în-1",
  subtitle: "Peria electrică rotativă care te ajută să cureți mai rapid locurile unde frecatul manual devine obositor.",
  tagline: "Curățenie mai rapidă, cu mai puțin efort.",
  badge: "OFERTĂ DE LANSARE",
  pricing: {
    oldPrice: 149.90,
    currentPrice: 119.90,
    currency: "lei",
    formattedOldPrice: "149,90 lei",
    formattedCurrentPrice: "119,90 lei",
    saveAmount: "30,00 lei",
  },
  bundles: [
    {
      quantity: 1,
      title: "1x Perie Electrică Rotativă 5-în-1",
      price: 119.90,
      originalPrice: 149.90,
      savings: 30.00,
      shippingFee: 15.00,
    },
    {
      quantity: 2,
      title: "2x Perie Electrică Rotativă 5-în-1",
      price: 199.90,
      originalPrice: 299.80,
      savings: 99.90,
      shippingFee: 0.00,
      badge: "CEL MAI POPULAR - TRANSPORT GRATUIT",
    },
    {
      quantity: 3,
      title: "3x Perie Electrică Rotativă 5-în-1",
      price: 269.90,
      originalPrice: 449.70,
      savings: 179.80,
      shippingFee: 0.00,
      badge: "CEL MAI BUN PREȚ - TRANSPORT GRATUIT",
    },
  ],
  orderBump: {
    title: "Set suplimentar de 5 capete interschimbabile de rezervă",
    description: "Prelungește durata de viață a periei tale cu 5 capete suplimentare pentru toate suprafețele din casă.",
    price: 29.90,
  },
  editableSpecs: {
    autonomy: "Până la 60 minute operare continuă",
    chargingTime: "2.5 - 3 ore prin cablu USB-C",
    headCount: 5,
    waterResistance: "IPX7 rezistent la apă și stropi",
    power: "Motor rotativ High-Torque",
    packageContents: [
      "1x Mâner perie electrică rotativă LUXORA HOME",
      "5x Capete perii interschimbabile pentru suprafețe multiple",
      "1x Cablu de încărcare USB",
      "1x Suport / Agățătoare perete",
      "1x Manual de utilizare în limba română"
    ],
    warranty: "24 luni garanție de conformitate"
  },
  contactInfo: {
    email: "contact@luxorahome.ro",
    phone: "0770 123 456",
    address: "Str. Victoriei Nr. 100, Sector 1, București, România",
    cui: "RO48921034",
    regCom: "J40/12345/2023",
    companyName: "LUXORA HOME S.R.L.",
    socialCapital: "200 RON"
  },
  shipping: {
    estimatedDays: "24 - 48 ore lucrătoare",
    courierName: "Curier Rapid (Sameday / Fan Courier)",
    deliveryFee: 15.00,
    freeShippingThreshold: 190.00
  },
  images: {
    hero: "/hero-product.png",
    attachments: "/attachments.png",
    before: "/before-tile.png",
    after: "/after-tile.png"
  }
};
