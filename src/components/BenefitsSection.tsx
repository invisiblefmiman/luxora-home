"use client";

import { PRODUCT_CONFIG } from "@/config/product";
import { Zap, Clock, Layers, Home, Wifi, Smile } from "lucide-react";

export function BenefitsSection() {
    const benefits = [
        {
            icon: Zap,
            title: "Mai puțin efort",
            description: "Motorul rotativ face treaba grea în locul tău, fără a fi nevoie de presiune fizică dură.",
            isConfigurable: false,
        },
        {
            icon: Clock,
            title: "Curățare mai rapidă",
            description: "Reduce timpul petrecut curățând baia sau bucătăria cu până la jumătate.",
            isConfigurable: false,
        },
        {
            icon: Layers,
            title: "Capete interschimbabile",
            description: `Include ${PRODUCT_CONFIG.editableSpecs.headCount} capete speciale pentru colțuri, suprafețe plane și delicate.`,
            isConfigurable: true,
            configKey: "număr exact de capete",
        },
        {
            icon: Home,
            title: "Utilă în mai multe zone",
            description: "Potrivită pentru baie, cadă, chiuvetă, rosturi, bucătărie și gresie.",
            isConfigurable: false,
        },
        {
            icon: Wifi,
            title: "Design wireless",
            description: `Funcționează pe baterie reîncărcabilă. ${PRODUCT_CONFIG.editableSpecs.autonomy}`,
            isConfigurable: true,
            configKey: "autonomie & încărcare",
        },
        {
            icon: Smile,
            title: "Ușor de folosit",
            description: "Pornire printr-un singur buton și schimbare rapidă a accesoriilor.",
            isConfigurable: false,
        },
    ];

    return (
        <section className="py-16 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                    <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600">
                        De ce să o alegi
                    </h2>
                    <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Beneficiile principale
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((b, i) => {
                        const Icon = b.icon;
                        return (
                            <div
                                key={i}
                                className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-blue-200 transition-all hover:shadow-md relative group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{b.description}</p>

                                {b.isConfigurable && (
                                    <span className="mt-3 inline-block text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono">
                                        Editable: {b.configKey}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
