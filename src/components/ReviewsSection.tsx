"use client";

import { MessageSquare, Star } from "lucide-react";

export function ReviewsSection() {
    return (
        <section className="py-16 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                    <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600">
                        Opinia cumpărătorilor
                    </h2>
                    <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Recenzii clienți
                    </p>
                </div>

                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-4">
                    <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6" />
                    </div>

                    <p className="text-slate-700 font-bold text-lg">
                        Recenziile clienților vor apărea aici.
                    </p>

                    <p className="text-slate-500 text-xs leading-relaxed">
                        Respectăm transparența totală. Secțiunea de recenzii este configurată și pregătită din punct de vedere tehnic pentru a fi populată doar cu evaluări verificate ale cumpărătorilor reali după lansare.
                    </p>

                    <div className="flex justify-center text-slate-300 gap-1 pt-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-slate-200 text-slate-200" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
