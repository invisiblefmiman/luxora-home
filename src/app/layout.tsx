import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://luxorahome.ro";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "LUXORA HOME | Perie Electrică Rotativă Multifuncțională 5-în-1",
    template: "%s | LUXORA HOME",
  },
  description: "Curățenie fără efort cu noua perie electrică rotativă LUXORA 5-în-1. Reduceri de până la 40%, livrare rapidă 24h și plată ramburs la curier.",
  keywords: ["perie electrica rotativa", "luxora home", "curatenie baie bucatarie", "perie curatat depuneri", "magazin online electrocasnice"],
  authors: [{ name: "LUXORA HOME" }],
  openGraph: {
    title: "LUXORA HOME | Perie Electrică Rotativă 5-în-1",
    description: "Economisește timp și efort la curățenie cu peria rotativă LUXORA. Livrare rapidă și plată la livrare.",
    url: baseUrl,
    siteName: "LUXORA HOME",
    locale: "ro_RO",
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "LUXORA HOME 5-in-1 Electric Cleaning Scrubber",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LUXORA HOME | Perie Electrică Rotativă 5-în-1",
    description: "Curățenie fără efort cu noua perie electrică rotativă LUXORA. Comandă cu plată la livrare.",
    images: [`${baseUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "LUXORA HOME",
        "url": baseUrl,
        "logo": `${baseUrl}/hero-product.png`,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+40770123456",
          "contactType": "customer service",
          "areaServed": "RO",
          "availableLanguage": "Romanian",
        },
      },
      {
        "@type": "Product",
        "@id": `${baseUrl}/#product`,
        "name": "Perie electrică rotativă de curățare 5-în-1 LUXORA HOME",
        "description": "Peria electrică rotativă reîncărcabilă cu 5 capete interschimbabile pentru curățarea fără efort a băii, bucătăriei, faianței și aragazului.",
        "brand": {
          "@type": "Brand",
          "name": "LUXORA HOME",
        },
        "image": [
          `${baseUrl}/hero-product.png`,
          `${baseUrl}/attachments.png`,
          `${baseUrl}/after-tile.png`
        ],
        "sku": "LXH-SCRUB-5IN1",
        "offers": {
          "@type": "Offer",
          "url": `${baseUrl}/comanda`,
          "priceCurrency": "RON",
          "price": "119.90",
          "priceValidUntil": "2027-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@id": `${baseUrl}/#organization`
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "128"
        }
      }
    ]
  };

  return (
    <html lang="ro" className={`${inter.variable} h-full antialiased scroll-smooth overflow-x-hidden`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans transition-colors duration-300 overflow-x-hidden w-full">
        <Analytics />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
