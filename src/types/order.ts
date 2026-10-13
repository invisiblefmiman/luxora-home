export type OrderStatus = "new" | "confirmed" | "shipped" | "delivered" | "returned" | "cancelled";
export type DeliveryType = "address" | "easybox";

export interface OrderFormData {
    fullName: string;
    phone: string;
    email?: string;
    county: string;
    city: string;
    deliveryType: DeliveryType;
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
    paymentMethod: "cod";
    notes?: string;
    idempotencyKey?: string;
    billingType?: "individual" | "company";
    companyName?: string;
    cui?: string;
    regCom?: string;
}

export interface OrderRecord {
    id: string;
    order_number: string;
    created_at: string;
    customer_name: string;
    phone: string;
    email?: string | null;
    county: string;
    city: string;
    delivery_type: DeliveryType;
    street: string;
    number: string;
    building?: string | null;
    entrance?: string | null;
    apartment?: string | null;
    postal_code?: string | null;
    easybox_id?: string | null;
    easybox_name?: string | null;
    quantity: number;
    order_bump_included: boolean;
    product_name: string;
    unit_price: number;
    total_price: number;
    payment_method: string;
    status: OrderStatus;
    billing_type?: "individual" | "company" | null;
    company_name?: string | null;
    cui?: string | null;
    reg_com?: string | null;
    awb_number?: string | null;
    carrier_name?: string | null;
    invoice_number?: string | null;
    awb_error?: string | null;
    invoice_error?: string | null;
    idempotency_key?: string | null;
    client_ip?: string | null;
    notes?: string | null;
}
