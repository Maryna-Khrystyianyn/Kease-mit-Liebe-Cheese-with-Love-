export const ORDER_STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-200 text-gray-800",
  };
  
  export const PAYMENT_STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    invoice_sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    refunded: "bg-red-100 text-red-800",
  };