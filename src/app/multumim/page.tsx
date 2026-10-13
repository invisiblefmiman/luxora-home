"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle2, Truck, Home, Box } from "lucide-react";

interface SavedOrder {
    orderNumber: string;
    createdAt: string;
    fullName: string;
    phone: string;
    email?: string;
    county: string;
    city: string;
    deliveryType?: "address" | "easybox";
    street: string;
    number: string;
    building?: string;
    entrance?: string;
    apartment?: string;
    postalCode?: string;
    easyboxId?: string;
    easyboxName?: string;
    quantity: number;
    orderBumpIncluded?: boolean;
    productName: string;
    unitPrice: number;
    shippingFee: number;
    totalPrice: number;
    paymentMethod: string;
}

declare global {
    interface Window {
        fbq?: (
            command: string,
            eventType: string,
            parameters?: Record<string, unknown>,
            options?: { eventID?: string }
        ) => void;
        ttq?: {
            track: (
                eventName: string,
                parameters?: Record<string, unknown>,
                options?: { event_id?: string }
            ) => void;
            page?: () => void;
        };
    }
}

function triggerPixelEvents(ord: SavedOrder) {
    if (typeof window !== "undefined") {
        // Meta Pixel Purchase Event with eventID deduplication
        if (typeof window.fbq === "function") {
            window.fbq("track", "Purchase", {
                value: ord.totalPrice,
                currency: "RON",
                content_name: ord.productName,
                order_id: ord.orderNumber,
            }, { eventID: ord.orderNumber });
        }
        // TikTok Pixel PlaceAnOrder Event
        if (window.ttq && typeof window.ttq.track === "function") {
            window.ttq.track("PlaceAnOrder", {
                value: ord.totalPrice,
                currency: "RON",
                content_name: ord.productName,
                order_id: ord.orderNumber,
            });
        }
    }
}

function ThankYouContent() {
    const searchParams = useSearchParams();
    const orderParam = searchParams.get("order");
    const [order, setOrder] = useState<SavedOrder | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                const cached = localStorage.getItem("luxora_last_order");
                if (cached) {
                    const parsed: SavedOrder = JSON.parse(cached);
                    if (!orderParam || parsed.orderNumber === orderParam) {
                        setOrder(parsed);
                        triggerPixelEvents(parsed);
                    } else if (orderParam) {
                        const fallbackOrder: SavedOrder = {
                            orderNumber: orderParam,
                            createdAt: new Date().toISOString(),
                            fullName: "Client Luxora Home",
                            phone: "",
                            county: "",
                            city: "",
                            street: "",
                            number: "",
                            quantity: 1,
                            productName: "Perie electrică rotativă 5-in-1",
                            unitPrice: 119.9,
                            shippingFee: 0,
                            totalPrice: 119.9,
                            paymentMethod: "cod",
                        };
                        setOrder(fallbackOrder);
                        triggerPixelEvents(fallbackOrder);
                    }
                } else if (orderParam) {
                    const fallbackOrder: SavedOrder = {
                        orderNumber: orderParam,
                        createdAt: new Date().toISOString(),
                        fullName: "Client Luxora Home",
                        phone: "",
                        county: "",
                        city: "",
                        street: "",
                        number: "",
                        quantity: 1,
                        productName: "Perie electrică rotativă 5-in-1",
                        unitPrice: 119.9,
                        shippingFee: 0,
                        totalPrice: 119.9,
                        paymentMethod: "cod",
                    };
                    setOrder(fallbackOrder);
                    triggerPixelEvents(fallbackOrder);
                }
            } catch (e) {
                console.error("Eroare citire local storage order:", e);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [orderParam]);

    return (
        <main className="flex-grow py-12 lg:py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Success Header Icon */}
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-emerald-100 border-4 border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-200">
                        Comandă Plasată cu Succes
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        Îți mulțumim pentru comandă!
                    </h1>
                    <p className="text-slate-600 text-base max-w-lg mx-auto">
                        Comanda ta <span className="font-bold text-blue-600">#{order?.orderNumber || orderParam || "LH-COMANDA"}</span> a fost înregistrată cu succes și se pregătește de expediere.
                    </p>
                </div>

                {/* SMS Delivery Banner */}
                <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl shrink-0">
                        <Truck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-lg leading-snug">
                            Comanda ta a fost înregistrată!
                        </h3>
                        <p className="text-blue-100 text-sm mt-1">
                            Vei primi un SMS în ziua în care curierul livrează coletul. Îți mulțumim că ai ales LUXORA HOME!
                        </p>
                    </div>
                </div>

                {/* Order Details Card */}
                {order && (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Număr comandă</span>
                                <span className="text-lg font-black text-slate-900">{order.orderNumber}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Metodă plată</span>
                                <span className="text-sm font-bold text-emerald-600">Plată la livrare (Ramburs)</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-1 text-sm">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Punct Livrare</span>
                                <p className="font-bold text-slate-900">{order.fullName}</p>

                                {order.deliveryType === "easybox" ? (
                                    <div className="mt-1 bg-blue-50 border border-blue-200 p-3 rounded-xl text-blue-900 space-y-1">
                                        <div className="font-bold text-xs flex items-center gap-1">
                                            <Box className="w-4 h-4 text-blue-600" /> Locker Sameday Easybox
                                        </div>
                                        <p className="text-xs">{order.easyboxName || order.easyboxId || "Easybox Locker"}</p>
                                        <p className="text-[11px] text-blue-700">{order.city}, {order.county}</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-slate-600">
                                            {order.street} Nr. {order.number}
                                            {order.building ? `, Bl. ${order.building}` : ""}
                                            {order.entrance ? `, Sc. ${order.entrance}` : ""}
                                            {order.apartment ? `, Ap. ${order.apartment}` : ""}
                                        </p>
                                        <p className="text-slate-600">{order.city}, {order.county}</p>
                                    </>
                                )}

                                {order.phone && <p className="text-slate-600 font-medium mt-2">Telefon: {order.phone}</p>}
                            </div>

                            <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Sumar Financiar</span>
                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>Produs:</span>
                                    <span className="font-semibold text-slate-800">{order.quantity}x Perie Rotativă</span>
                                </div>
                                {order.orderBumpIncluded && (
                                    <div className="flex justify-between text-xs text-amber-700 font-medium">
                                        <span>+ Set 5 Capete Rezervă:</span>
                                        <span>29.90 lei</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>Livrare:</span>
                                    <span className="font-semibold text-emerald-600">{order.shippingFee === 0 ? "GRATUIT" : `${order.shippingFee.toFixed(2)} lei`}</span>
                                </div>
                                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                                    <span>TOTAL RAMBURS:</span>
                                    <span className="text-blue-600">{order.totalPrice.toFixed(2)} lei</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Primary Home Button */}
                <div className="text-center pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 py-4 px-8 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base rounded-2xl shadow-lg transition-all"
                    >
                        <Home className="w-5 h-5" />
                        <span>Înapoi la pagina principală</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function ThankYouPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <Suspense fallback={<div className="p-12 text-center text-slate-500">Se încarcă detaliile comenzii...</div>}>
                <ThankYouContent />
            </Suspense>
            <Footer />
        </div>
    );
}
