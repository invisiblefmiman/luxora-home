"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ConfirmationRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const order = searchParams.get("order");

    useEffect(() => {
        if (order) {
            router.replace(`/multumim?order=${order}`);
        } else {
            router.replace("/multumim");
        }
    }, [order, router]);

    return (
        <div className="p-12 text-center text-slate-500 font-medium">
            Se redirecționează către pagina de mulțumire...
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-slate-500">Se încarcă...</div>}>
            <ConfirmationRedirect />
        </Suspense>
    );
}
