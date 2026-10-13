"use client";

import { useState, useEffect, useCallback } from "react";
import { OrderRecord, OrderStatus } from "@/types/order";
import { Lock, Search, RefreshCw, Save, LogOut, FileText, Truck, Download, FileCheck, Info, MessageSquare, PhoneCall, AlertTriangle, Box, Building2 } from "lucide-react";

export default function AdminDashboardPage() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState("");
    const [orders, setOrders] = useState<OrderRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingAwbs, setEditingAwbs] = useState<Record<string, string>>({});
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchOrders = useCallback(async (authToken: string) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/orders", {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setOrders(data.orders);
                setIsAuthenticated(true);
                localStorage.setItem("luxora_admin_token", authToken);
            } else {
                setAuthError(data.error || "Parolă incorectă.");
                setIsAuthenticated(false);
            }
        } catch {
            setAuthError("A apărut o eroare la conectare.");
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const savedToken = localStorage.getItem("luxora_admin_token");
        if (savedToken) {
            const timer = setTimeout(() => {
                setPassword(savedToken);
                fetchOrders(savedToken);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [fetchOrders]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError("");
        fetchOrders(password);
    };

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        setUpdatingId(orderId);
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${password}`,
                },
                body: JSON.stringify({
                    id: orderId,
                    status: newStatus,
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setOrders((prev) =>
                    prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
                );
            } else {
                alert("Eroare la actualizarea statusului: " + data.error);
            }
        } catch {
            alert("Eroare la actualizarea statusului.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleGenerateAwbSameday = async (orderId: string) => {
        setUpdatingId(orderId);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/generate-awb`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${password}`,
                },
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setOrders((prev) =>
                    prev.map((o) =>
                        o.id === orderId
                            ? { ...o, awb_number: data.awbNumber, carrier_name: "sameday", awb_error: null, status: (data.status as OrderStatus) || "shipped" }
                            : o
                    )
                );
                alert(`AWB Sameday generat cu succes: ${data.awbNumber}`);
            } else {
                alert("Eroare generare AWB Sameday: " + (data.error || "A apărut o eroare"));
                fetchOrders(password);
            }
        } catch {
            alert("A apărut o eroare la generarea AWB Sameday.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleGenerateInvoice = async (orderId: string) => {
        setUpdatingId(orderId);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/invoice`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${password}`,
                },
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setOrders((prev) =>
                    prev.map((o) => (o.id === orderId ? { ...o, invoice_number: data.invoiceNumber, invoice_error: null } : o))
                );
                alert(`Factură emisă cu succes: ${data.invoiceNumber}`);
            } else {
                alert("Eroare emitere factură: " + (data.error || "A apărut o eroare"));
                fetchOrders(password);
            }
        } catch {
            alert("A apărut o eroare la emiterea facturii.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleSaveAwb = async (orderId: string) => {
        const awbVal = editingAwbs[orderId];
        if (awbVal === undefined) return;

        setUpdatingId(orderId);
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${password}`,
                },
                body: JSON.stringify({
                    id: orderId,
                    awbNumber: awbVal,
                    carrierName: "sameday",
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setOrders((prev) =>
                    prev.map((o) => (o.id === orderId ? { ...o, awb_number: awbVal, awb_error: null } : o))
                );
                alert("AWB salvat cu succes!");
            } else {
                alert("Eroare la salvarea AWB-ului: " + data.error);
            }
        } catch {
            alert("Eroare la salvarea AWB-ului.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("luxora_admin_token");
        setIsAuthenticated(false);
        setPassword("");
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl text-white space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/30">
                            <Lock className="w-7 h-7" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">LUXORA HOME Admin</h1>
                        <p className="text-slate-400 text-xs">Introduceți parola de administrator pentru a accesa comenzi.</p>
                    </div>

                    {authError && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-xl text-xs text-center font-medium">
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Parolă Admin</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-blue-600/30"
                        >
                            {isLoading ? "Se conectează..." : "Autentificare Admin"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = filterStatus === "all" || order.status === filterStatus;
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            order.order_number.toLowerCase().includes(search) ||
            order.customer_name.toLowerCase().includes(search) ||
            order.phone.includes(search) ||
            (order.city && order.city.toLowerCase().includes(search));
        return matchesStatus && matchesSearch;
    });

    const statusBadge = (status: OrderStatus) => {
        switch (status) {
            case "new":
                return <span className="bg-blue-100 text-blue-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase">Nouă</span>;
            case "confirmed":
                return <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase">Confirmată</span>;
            case "shipped":
                return <span className="bg-purple-100 text-purple-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase">Expediată</span>;
            case "delivered":
                return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase">Livrată</span>;
            case "returned":
                return <span className="bg-orange-100 text-orange-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase">Returnată</span>;
            case "cancelled":
                return <span className="bg-red-100 text-red-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase">Anulată</span>;
        }
    };

    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total_price || 0), 0);

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-12">
            {/* Header */}
            <header className="bg-slate-900 text-white border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-black text-xl tracking-tight text-blue-500">LUXORA HOME</span>
                        <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2.5 py-0.5 rounded-md border border-blue-500/30">Admin Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => fetchOrders(password)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                            title="Reîmprospătează comenzi"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-red-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-all cursor-pointer"
                        >
                            <LogOut className="w-3.5 h-3.5" /> Deconectare
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Fallback Notice Banner */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center gap-3 text-blue-800 text-xs font-medium">
                    <Info className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>
                        <strong>Logistică & Facturare:</strong> Generarea AWB Sameday și emiterea Facturilor funcționează direct cu mecanism de retry manual și fail-safe. Dacă cheile API nu sunt configurate, sistemul generează automat documente PDF de producție.
                    </span>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Comenzi</span>
                        <div className="text-2xl font-black text-slate-900 mt-1">{orders.length}</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Comenzi Noi</span>
                        <div className="text-2xl font-black text-blue-600 mt-1">
                            {orders.filter((o) => o.status === "new").length}
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Comenzi Expediate</span>
                        <div className="text-2xl font-black text-purple-600 mt-1">
                            {orders.filter((o) => o.status === "shipped" || o.status === "delivered").length}
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Valoare Totală Ramburs</span>
                        <div className="text-2xl font-black text-emerald-600 mt-1">
                            {totalRevenue.toFixed(2)} lei
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {[
                            { id: "all", label: "Toate" },
                            { id: "new", label: "Noi" },
                            { id: "confirmed", label: "Confirmate" },
                            { id: "shipped", label: "Expediate" },
                            { id: "delivered", label: "Livrate" },
                            { id: "cancelled", label: "Anulate" },
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => setFilterStatus(btn.id)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${filterStatus === btn.id
                                    ? "bg-blue-600 text-white shadow-xs"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                                    }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                            type="text"
                            placeholder="Caută comandă, nume, telefon..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="p-4">Cod Comandă / Data</th>
                                    <th className="p-4">Client & Adresă</th>
                                    <th className="p-4">Pachet & Livrare</th>
                                    <th className="p-4">Total Ramburs</th>
                                    <th className="p-4">Status & Acțiuni Rapid</th>
                                    <th className="p-4">AWB Sameday Logistică</th>
                                    <th className="p-4">Factură Fiscală</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400">
                                            Nu au fost găsite comenzi.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => {
                                        const currentAwbs = editingAwbs[order.id] !== undefined ? editingAwbs[order.id] : (order.awb_number || "");
                                        const formattedPhone = order.phone.startsWith("0") ? `4${order.phone}` : order.phone;
                                        const waText = encodeURIComponent(`Buna ziua! Comanda dvs. LUXORA HOME #${order.order_number} in valoare de ${order.total_price.toFixed(2)} lei a fost confirmata si se pregateste de expediere prin Sameday. Va multumim!`);

                                        return (
                                            <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="p-4 font-mono font-bold text-slate-900">
                                                    <div>{order.order_number}</div>
                                                    <div className="text-[10px] text-slate-400 font-normal font-sans mt-0.5">
                                                        {new Date(order.created_at).toLocaleString("ro-RO")}
                                                    </div>
                                                </td>

                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900">{order.customer_name}</div>
                                                    <div className="text-blue-600 font-semibold">{order.phone}</div>
                                                    {order.billing_type === "company" && (
                                                        <div className="mt-1 p-1.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900">
                                                            <div className="font-bold flex items-center gap-1 text-amber-800">
                                                                <Building2 className="w-3 h-3 text-amber-600 shrink-0" />
                                                                <span>PJ / B2B:</span> {order.company_name || "Companie nespecificată"}
                                                            </div>
                                                            {order.cui && <div className="text-[10px] text-amber-800 font-mono">CUI: {order.cui}</div>}
                                                            {order.reg_com && <div className="text-[10px] text-slate-500 font-mono">Reg. Com: {order.reg_com}</div>}
                                                        </div>
                                                    )}
                                                    <div className="text-[11px] text-slate-500 mt-1 max-w-xs">
                                                        {order.delivery_type === "easybox" ? (
                                                            <span className="text-blue-700 font-semibold flex items-center gap-1">
                                                                <Box className="w-3 h-3 text-blue-600 shrink-0" />
                                                                Locker Easybox: {order.easybox_name || order.easybox_id || "Sameday Easybox"} ({order.city})
                                                            </span>
                                                        ) : (
                                                            <>
                                                                Str. {order.street} nr. {order.number}
                                                                {order.building ? `, Bl. ${order.building}` : ""}
                                                                , {order.city}, {order.county}
                                                            </>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="p-4 space-y-1">
                                                    <div className="font-bold text-slate-800">{order.quantity}x Perie Rotativă</div>
                                                    {order.order_bump_included && (
                                                        <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                                                            + Set 5 Capete Rezervă
                                                        </span>
                                                    )}
                                                    <div className="text-[10px] text-slate-400">
                                                        Tip: {order.delivery_type === "easybox" ? "Locker Easybox" : "Curier Adresă"}
                                                    </div>
                                                </td>

                                                <td className="p-4 font-black text-slate-900 text-sm">
                                                    {order.total_price.toFixed(2)} lei
                                                </td>

                                                <td className="p-4 space-y-2">
                                                    <div className="space-y-1">
                                                        <div>{statusBadge(order.status)}</div>
                                                        <select
                                                            value={order.status}
                                                            disabled={updatingId === order.id}
                                                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                                            className="bg-slate-100 border border-slate-300 text-[11px] font-bold rounded-lg px-2 py-1 focus:outline-hidden"
                                                        >
                                                            <option value="new">Nouă</option>
                                                            <option value="confirmed">Confirmată</option>
                                                            <option value="shipped">Expediată</option>
                                                            <option value="delivered">Livrată</option>
                                                            <option value="returned">Returnată</option>
                                                            <option value="cancelled">Anulată</option>
                                                        </select>
                                                    </div>

                                                    {/* WhatsApp & SMS Quick Actions */}
                                                    <div className="flex items-center gap-1.5 pt-1">
                                                        <a
                                                            href={`https://wa.me/${formattedPhone}?text=${waText}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs transition-all"
                                                            title="Trimite mesaj WhatsApp de confirmare"
                                                        >
                                                            <MessageSquare className="w-3 h-3" /> WhatsApp
                                                        </a>
                                                        <a
                                                            href={`sms:${order.phone}?body=${waText}`}
                                                            className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs transition-all"
                                                            title="Trimite SMS client"
                                                        >
                                                            <PhoneCall className="w-3 h-3" /> SMS
                                                        </a>
                                                    </div>
                                                </td>

                                                {/* Sameday AWB Logistics UI */}
                                                <td className="p-4 space-y-2">
                                                    {order.awb_error && (
                                                        <div className="bg-red-50 border border-red-200 text-red-700 text-[10px] p-1.5 rounded-lg flex items-center gap-1">
                                                            <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
                                                            <span className="truncate">{order.awb_error}</span>
                                                        </div>
                                                    )}

                                                    {order.awb_number ? (
                                                        <div className="space-y-1">
                                                            <div className="font-mono font-bold text-emerald-700 text-xs flex items-center gap-1">
                                                                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                                                                {order.awb_number}
                                                            </div>
                                                            <a
                                                                href={`/api/admin/orders/${order.id}/awb-pdf?token=${password}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition-all"
                                                            >
                                                                <Download className="w-3 h-3" /> Descarcă AWB (PDF)
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-1.5">
                                                            <button
                                                                onClick={() => handleGenerateAwbSameday(order.id)}
                                                                disabled={updatingId === order.id}
                                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-2.5 py-1.5 rounded-lg shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                                                            >
                                                                <Truck className="w-3.5 h-3.5" /> Reîncearcă AWB Sameday
                                                            </button>
                                                            <div className="flex items-center gap-1">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Sau AWB manual..."
                                                                    value={currentAwbs}
                                                                    onChange={(e) =>
                                                                        setEditingAwbs((prev) => ({
                                                                            ...prev,
                                                                            [order.id]: e.target.value,
                                                                        }))
                                                                    }
                                                                    className="w-24 px-1.5 py-0.5 bg-slate-50 border border-slate-300 rounded-md text-[10px] font-mono"
                                                                />
                                                                <button
                                                                    onClick={() => handleSaveAwb(order.id)}
                                                                    disabled={updatingId === order.id}
                                                                    className="p-1 bg-slate-700 text-white rounded-md cursor-pointer"
                                                                    title="Salvează manual"
                                                                >
                                                                    <Save className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Invoice UI */}
                                                <td className="p-4 space-y-2">
                                                    {order.invoice_error && (
                                                        <div className="bg-red-50 border border-red-200 text-red-700 text-[10px] p-1.5 rounded-lg flex items-center gap-1">
                                                            <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
                                                            <span className="truncate">{order.invoice_error}</span>
                                                        </div>
                                                    )}

                                                    {order.invoice_number ? (
                                                        <div className="space-y-1">
                                                            <div className="font-mono font-bold text-blue-700 text-xs flex items-center gap-1">
                                                                <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                                                                {order.invoice_number}
                                                            </div>
                                                            <a
                                                                href={`/api/admin/orders/${order.id}/invoice-pdf?token=${password}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition-all"
                                                            >
                                                                <FileText className="w-3 h-3" /> Factură PDF
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleGenerateInvoice(order.id)}
                                                            disabled={updatingId === order.id}
                                                            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[11px] px-2.5 py-1.5 rounded-lg shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                                                        >
                                                            <FileText className="w-3.5 h-3.5" /> Reîncearcă Factură SmartBill
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
