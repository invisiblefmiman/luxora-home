"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PRODUCT_CONFIG } from "@/config/product";
import { ROMANIAN_COUNTIES } from "@/constants/romanianCounties";
import { getEasyboxesForLocation, POPULAR_EASYBOXES } from "@/constants/romanianEasyboxes";
import { DeliveryType } from "@/types/order";
import { trackEvent } from "@/components/Analytics";
import { ShieldCheck, Truck, Banknote, ArrowRight, Lock, CheckCircle2, Sparkles, Plus, Box } from "lucide-react";

function generateUUID(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `tx-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQtyParam = parseInt(searchParams.get("qty") || "1", 10);
    const initialQty = [1, 2, 3].includes(initialQtyParam) ? initialQtyParam : 1;

    const [selectedQuantity, setSelectedQuantity] = useState<number>(initialQty);
    const [orderBumpIncluded, setOrderBumpIncluded] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [idempotencyKey, setIdempotencyKey] = useState<string>("");

    const [deliveryType, setDeliveryType] = useState<DeliveryType>("address");

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        county: "",
        city: "",
        street: "",
        number: "",
        building: "",
        entrance: "",
        apartment: "",
        postalCode: "",
        easyboxId: "",
        easyboxName: "",
        notes: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const txId = generateUUID();
        setIdempotencyKey(txId);
        // Trimitere eveniment de initiere checkout catre Google Analytics, Meta Pixel si TikTok Pixel
        trackEvent("InitiateCheckout", {
            content_name: PRODUCT_CONFIG.name,
            currency: "RON",
            value: PRODUCT_CONFIG.bundles[0].price,
        }, txId);
    }, []);

    const availableEasyboxes = getEasyboxesForLocation(formData.county, formData.city);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        if (submitError) setSubmitError(null);
    };

    const handleEasyboxSelect = (easyboxId: string) => {
        const selected = POPULAR_EASYBOXES.find((b) => b.id === easyboxId);
        if (selected) {
            setFormData((prev) => ({
                ...prev,
                easyboxId: selected.id,
                easyboxName: `${selected.name} (${selected.address})`,
                street: selected.address,
                number: "Locker",
            }));
            if (errors.easyboxId) {
                setErrors((prev) => ({ ...prev, easyboxId: "" }));
            }
        } else {
            setFormData((prev) => ({ ...prev, easyboxId, easyboxName: easyboxId }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
            newErrors.fullName = "Introduceți numele complet (minim 3 caractere)";
        }

        const cleanPhone = formData.phone.replace(/[\s\-\+\(\)]/g, "");
        if (!cleanPhone || !/^07\d{8}$/.test(cleanPhone)) {
            newErrors.phone = "Număr de telefon nevalid (ex: 07xx xxx xxx)";
        }

        if (!formData.county.trim()) newErrors.county = "Selectați județul";
        if (!formData.city.trim() || formData.city.trim().length < 2) newErrors.city = "Introduceți localitatea";

        if (deliveryType === "address") {
            if (!formData.street.trim() || formData.street.trim().length < 2) newErrors.street = "Introduceți strada";
            if (!formData.number.trim()) newErrors.number = "Introduceți numărul";
        } else {
            if (!formData.easyboxId && !formData.easyboxName) {
                newErrors.easyboxId = "Selectați un Easybox Locker din listă sau introduceți numele lockerului.";
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setSubmitError(null);
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                deliveryType,
                street: deliveryType === "easybox" ? (formData.street || "Locker Easybox") : formData.street,
                number: deliveryType === "easybox" ? (formData.number || "Locker") : formData.number,
                quantity: selectedQuantity,
                orderBumpIncluded,
                idempotencyKey,
            };

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "A apărut o eroare la trimiterea comenzii.");
            }

            if (data.order) {
                localStorage.setItem("luxora_last_order", JSON.stringify(data.order));
            }

            router.push(`/multumim?order=${data.orderNumber}`);
        } catch (err: unknown) {
            console.error("Submission error:", err);
            const message = err instanceof Error ? err.message : "A apărut o eroare neașteptată. Vă rugăm să încercați din nou.";
            setSubmitError(message);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedBundle = PRODUCT_CONFIG.bundles.find((b) => b.quantity === selectedQuantity) || PRODUCT_CONFIG.bundles[0];
    const baseBundlePrice = selectedBundle.price;
    const bumpPrice = orderBumpIncluded ? PRODUCT_CONFIG.orderBump.price : 0;
    const shippingFee = selectedBundle.shippingFee;
    const grandTotal = baseBundlePrice + bumpPrice + shippingFee;

    return (
        <main className="flex-grow py-8 lg:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                    <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest flex items-center justify-center gap-1.5 bg-blue-50 py-1.5 px-4 rounded-full w-fit mx-auto border border-blue-100">
                        <Lock className="w-3.5 h-3.5 text-blue-600" /> Plasare comandă securizată - Plată la livrare
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Finalizare Comandă
                    </h1>
                    <p className="text-slate-600 text-sm">
                        Comanzi în mai puțin de 1 minut. Plătești doar când primești coletul.
                    </p>
                </div>

                {submitError && (
                    <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl text-center font-medium shadow-xs">
                        {submitError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Bundles & Customer Details */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Quantity Bundles Selector */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                    1. Alege Pachetul Promoțional
                                </h2>
                                <span className="text-xs text-slate-500 font-medium">Economisești transportul de la 2 bucăți</span>
                            </div>

                            <div className="space-y-3">
                                {PRODUCT_CONFIG.bundles.map((bundle) => {
                                    const isSelected = selectedQuantity === bundle.quantity;
                                    return (
                                        <div
                                            key={bundle.quantity}
                                            onClick={() => setSelectedQuantity(bundle.quantity)}
                                            className={`relative p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${isSelected
                                                ? "border-blue-600 bg-blue-50/40 shadow-sm"
                                                : "border-slate-200 hover:border-slate-300 bg-white"
                                                }`}
                                        >
                                            {bundle.badge && (
                                                <div className="absolute -top-3 right-4 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                                                    {bundle.badge}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="bundle"
                                                    checked={isSelected}
                                                    onChange={() => setSelectedQuantity(bundle.quantity)}
                                                    className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-extrabold text-slate-900 text-base">
                                                            {bundle.title}
                                                        </span>
                                                        <div className="text-right">
                                                            <span className="text-xs text-slate-400 line-through mr-2">
                                                                {bundle.originalPrice.toFixed(2)} lei
                                                            </span>
                                                            <span className="font-black text-blue-600 text-lg">
                                                                {bundle.price.toFixed(2)} lei
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1 text-xs">
                                                        <span className="text-emerald-600 font-bold">
                                                            {bundle.shippingFee === 0 ? "✓ Transport GRATUIT" : `+ ${bundle.shippingFee.toFixed(2)} lei livrare`}
                                                        </span>
                                                        {bundle.savings > 30 && (
                                                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                                                                Economisești {bundle.savings.toFixed(2)} lei
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Bump Checkbox */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-3xl border-2 border-amber-300 shadow-sm relative overflow-hidden">
                            <div className="flex items-start gap-4">
                                <input
                                    type="checkbox"
                                    id="orderBump"
                                    checked={orderBumpIncluded}
                                    onChange={(e) => setOrderBumpIncluded(e.target.checked)}
                                    className="mt-1 w-6 h-6 text-amber-600 border-amber-400 rounded-md focus:ring-amber-500 cursor-pointer shrink-0"
                                />
                                <label htmlFor="orderBump" className="cursor-pointer flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-amber-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                                            OFERTĂ SPECIALĂ LIMITATĂ
                                        </span>
                                        <span className="font-black text-amber-900 text-sm">
                                            + {PRODUCT_CONFIG.orderBump.price.toFixed(2)} lei
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-base mt-1">
                                        {PRODUCT_CONFIG.orderBump.title}
                                    </h3>
                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                        {PRODUCT_CONFIG.orderBump.description}
                                    </p>
                                </label>
                            </div>
                        </div>

                        {/* Delivery Method Selector (Address vs Sameday Easybox Locker) */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-blue-600" />
                                2. Modalitate de Livrare
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDeliveryType("address")}
                                    className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${deliveryType === "address"
                                        ? "border-blue-600 bg-blue-50/50 text-blue-900 font-extrabold"
                                        : "border-slate-200 text-slate-700 font-medium hover:border-slate-300"
                                        }`}
                                >
                                    <Truck className={`w-5 h-5 shrink-0 mt-0.5 ${deliveryType === "address" ? "text-blue-600" : "text-slate-400"}`} />
                                    <div>
                                        <div className="text-sm">Curier Rapid la Adresă</div>
                                        <div className="text-xs text-slate-500 font-normal mt-0.5">Livrare la ușă în 24-48 ore</div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setDeliveryType("easybox")}
                                    className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${deliveryType === "easybox"
                                        ? "border-blue-600 bg-blue-50/50 text-blue-900 font-extrabold"
                                        : "border-slate-200 text-slate-700 font-medium hover:border-slate-300"
                                        }`}
                                >
                                    <Box className={`w-5 h-5 shrink-0 mt-0.5 ${deliveryType === "easybox" ? "text-blue-600" : "text-slate-400"}`} />
                                    <div>
                                        <div className="text-sm flex items-center gap-1.5">
                                            Locker Sameday Easybox
                                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded">NOU</span>
                                        </div>
                                        <div className="text-xs text-slate-500 font-normal mt-0.5">Ridicare 24/7 fără așteptat curier</div>
                                    </div>
                                </button>
                            </div>

                            {/* Customer Contact & Address Info */}
                            <div className="space-y-4 pt-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Nume și Prenume *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Ion Popescu"
                                        className={`w-full px-4 min-h-[48px] py-3 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${errors.fullName ? "border-red-500 bg-red-50" : "border-slate-300"
                                            }`}
                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                            Număr de Telefon *
                                        </label>
                                        <input
                                            type="tel"
                                            inputMode="tel"
                                            autoComplete="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="07xx xxx xxx"
                                            className={`w-full px-4 min-h-[48px] py-3 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${errors.phone ? "border-red-500 bg-red-50" : "border-slate-300"
                                                }`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                            Email (Opțional)
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="nume@exemplu.ro"
                                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${errors.email ? "border-red-500 bg-red-50" : "border-slate-300"
                                                }`}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Romanian Counties Selector & City */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                            Județ *
                                        </label>
                                        <select
                                            name="county"
                                            value={formData.county}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white ${errors.county ? "border-red-500 bg-red-50" : "border-slate-300"
                                                }`}
                                        >
                                            <option value="">Alege Județul...</option>
                                            {ROMANIAN_COUNTIES.map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.county && <p className="text-red-500 text-xs mt-1">{errors.county}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                            Localitate *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="București / Cluj-Napoca / etc."
                                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${errors.city ? "border-red-500 bg-red-50" : "border-slate-300"
                                                }`}
                                        />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                    </div>
                                </div>

                                {deliveryType === "easybox" ? (
                                    <div className="space-y-3 p-4 bg-blue-50/70 border border-blue-200 rounded-2xl">
                                        <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider">
                                            Selectează Lockerul Easybox *
                                        </label>
                                        {availableEasyboxes.length > 0 ? (
                                            <select
                                                name="easyboxId"
                                                value={formData.easyboxId}
                                                onChange={(e) => handleEasyboxSelect(e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white ${errors.easyboxId ? "border-red-500 bg-red-50" : "border-slate-300"
                                                    }`}
                                            >
                                                <option value="">Alege un locker Easybox din {formData.city || formData.county}...</option>
                                                {availableEasyboxes.map((box) => (
                                                    <option key={box.id} value={box.id}>
                                                        {box.name} - {box.address}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : null}

                                        <div>
                                            <input
                                                type="text"
                                                name="easyboxName"
                                                value={formData.easyboxName}
                                                onChange={handleInputChange}
                                                placeholder="Sau introdu numele/adresa Easybox (ex: Easybox Kaufland...)"
                                                className={`w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${errors.easyboxId ? "border-red-500 bg-red-50" : "border-slate-300"
                                                    }`}
                                            />
                                        </div>
                                        {errors.easyboxId && <p className="text-red-500 text-xs mt-1">{errors.easyboxId}</p>}
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                                    Stradă *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="street"
                                                    value={formData.street}
                                                    onChange={handleInputChange}
                                                    placeholder="Strada Victoriei"
                                                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${errors.street ? "border-red-500 bg-red-50" : "border-slate-300"
                                                        }`}
                                                />
                                                {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                                    Număr *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="number"
                                                    value={formData.number}
                                                    onChange={handleInputChange}
                                                    placeholder="12A"
                                                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${errors.number ? "border-red-500 bg-red-50" : "border-slate-300"
                                                        }`}
                                                />
                                                {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bloc</label>
                                                <input
                                                    type="text"
                                                    name="building"
                                                    value={formData.building}
                                                    onChange={handleInputChange}
                                                    placeholder="B1"
                                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Scară</label>
                                                <input
                                                    type="text"
                                                    name="entrance"
                                                    value={formData.entrance}
                                                    onChange={handleInputChange}
                                                    placeholder="A"
                                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ap.</label>
                                                <input
                                                    type="text"
                                                    name="apartment"
                                                    value={formData.apartment}
                                                    onChange={handleInputChange}
                                                    placeholder="14"
                                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cod poștal</label>
                                                <input
                                                    type="text"
                                                    name="postalCode"
                                                    value={formData.postalCode}
                                                    onChange={handleInputChange}
                                                    placeholder="010101"
                                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Observații comandă (Opțional)
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        placeholder="Instrucțiuni speciale..."
                                        rows={2}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Options (Cash on Delivery default) */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                                3. Metodă de plată
                            </h2>
                            <div className="flex items-start gap-4 p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50">
                                <Banknote className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-extrabold text-slate-900 text-base">
                                        Plată la livrare (Ramburs)
                                    </div>
                                    <p className="text-xs text-slate-600 mt-0.5">
                                        Fără riscuri! Plătești numerar sau cu cardul direct la curier / automat când primești coletul.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dynamic Price Summary Sticky Box */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 sticky top-24">
                            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                                <span>Sumar Comandă</span>
                                <span className="text-xs font-normal text-slate-500">Pasul final</span>
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                                    <div className="w-16 h-16 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center font-black text-blue-700 text-sm shrink-0">
                                        {selectedQuantity}x
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 text-sm leading-tight">
                                            {PRODUCT_CONFIG.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Pachet selectat: <span className="font-bold text-slate-700">{selectedBundle.title}</span>
                                        </p>
                                        <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                                            Livrare: {deliveryType === "easybox" ? "Locker Sameday Easybox" : "Curier Rapid la Adresă"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-slate-900 text-base">
                                            {baseBundlePrice.toFixed(2)} lei
                                        </span>
                                    </div>
                                </div>

                                {orderBumpIncluded && (
                                    <div className="flex items-center justify-between text-xs py-2 px-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-bold">
                                        <span className="flex items-center gap-1.5">
                                            <Plus className="w-4 h-4 text-amber-600" />
                                            Set 5 Capete Rezervă
                                        </span>
                                        <span>+{PRODUCT_CONFIG.orderBump.price.toFixed(2)} lei</span>
                                    </div>
                                )}
                            </div>

                            {/* Dynamic transparent breakdown */}
                            <div className="space-y-2 text-xs text-slate-600 border-b border-slate-100 pb-4">
                                <div className="flex justify-between">
                                    <span>Preț bază pachet:</span>
                                    <span className="font-semibold text-slate-800">{baseBundlePrice.toFixed(2)} lei</span>
                                </div>
                                {selectedBundle.savings > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Reducere pachet:</span>
                                        <span className="font-bold">-{selectedBundle.savings.toFixed(2)} lei</span>
                                    </div>
                                )}
                                {orderBumpIncluded && (
                                    <div className="flex justify-between text-amber-800">
                                        <span>Set suplimentar capete:</span>
                                        <span className="font-semibold">+{PRODUCT_CONFIG.orderBump.price.toFixed(2)} lei</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Cost Livrare ({deliveryType === "easybox" ? "Easybox" : "Curier"}):</span>
                                    <span className={`font-bold ${shippingFee === 0 ? "text-emerald-600" : "text-slate-800"}`}>
                                        {shippingFee === 0 ? "GRATUIT" : `${shippingFee.toFixed(2)} lei`}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-baseline justify-between pt-1">
                                <span className="text-base font-extrabold text-slate-900">Total Ramburs la Livrare:</span>
                                <span className="text-3xl font-black text-blue-600">{grandTotal.toFixed(2)} lei</span>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full min-h-[48px] inline-flex items-center justify-center gap-3 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-blue-500/25 active:scale-95 touch-manipulation select-none transition-transform uppercase tracking-wide cursor-pointer ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
                            >
                                <span>{isSubmitting ? "SE PROCESEAZĂ..." : "TRIMITE COMANDA RAMBURS"}</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <div className="space-y-2.5 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Verificare colet la livrare permisă.</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>24 luni garanție + 14 zile drept de retur.</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-slate-600 shrink-0" />
                                    <span>Livrare rapidă în {PRODUCT_CONFIG.shipping.estimatedDays}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />
            <Suspense fallback={<div className="p-12 text-center text-slate-500">Se încarcă formularul de comandă...</div>}>
                <CheckoutContent />
            </Suspense>
            <Footer />
        </div>
    );
}
