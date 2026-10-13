"use client";

import { Frown, Flame, Zap } from "lucide-react";

export function ProblemSection() {
    const problems = [
        {
            icon: Frown,
            title: "Rosturi murdare",
            description: "Murdăria acumulat între plăcile de gresie și faianță este aproape imposibil de curățat doar cu o lavetă standard.",
        },
        {
            icon: Flame,
            title: "Calcar și murdărie persistentă",
            description: "Depunerile dure de calcar de pe baterii, cabine de duș și chiuvete necesită efort fizic considerabil și timp irosit.",
        },
        {
            icon: Zap,
            title: "Curățare obositoare",
            description: "Frecatul manual ore în șir duce la dureri de spate, mâini obosite și frustrare când rezultatele nu sunt pe măsură.",
        },
    ];

    return (
        <section className="py-16 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600">
                        Probleme frecvente în casă
                    </h2>
                    <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Te-ai săturat să freci?
                    </p>
                    <p className="text-slate-600 text-base">
                        Curățenia tradițională necesită presiune mare și timp pierdut pe suprafețe dificile.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {problems.map((prob, idx) => {
                        const Icon = prob.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-slate-200 transition-all hover:shadow-md"
                            >
                                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-6">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{prob.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{prob.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
