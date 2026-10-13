"use client";

export function HowItWorksSection() {
    const steps = [
        {
            num: "01",
            title: "Alegi capătul potrivit",
            desc: "Selectezi peria conică pentru colțuri/rosturi, peria lată pentru suprafețe mari sau buretele pentru zone delicate.",
        },
        {
            num: "02",
            title: "Pornești peria",
            desc: "Apeși butonul de pornire și lași motorul să atingă turația optimă de rotire.",
        },
        {
            num: "03",
            title: "Cureți mai ușor",
            desc: "Ghidezi peria ușor peste suprafața dorită. Murdăria și calcarul sunt îndepărtate fără presiune fizică dură.",
        },
    ];

    return (
        <section id="cum-functioneaza" className="py-16 bg-slate-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                    <h2 className="text-xs uppercase tracking-widest font-bold text-blue-600">
                        Utilizare simplă
                    </h2>
                    <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Cum funcționează în 3 pași
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-8 rounded-3xl border border-slate-200 relative space-y-4 hover:shadow-md transition-shadow"
                        >
                            <span className="text-4xl font-black text-blue-600/20 block font-mono">
                                {step.num}
                            </span>
                            <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
