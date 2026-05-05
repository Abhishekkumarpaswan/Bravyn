import { create } from "zustand";
import { AxiosError } from "axios";
import api from "../lib/api";

interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

interface Pricing {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

interface PaymentDetails {
  method: "cod" | "stripe";
  status: "pending" | "completed" | "failed";
  stripePaymentIntentId?: string;
}

interface Order {
  _id?: string;
  orderId: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  mobileNumber?: string;
  pricing: Pricing;
  paymentDetails: PaymentDetails;
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  orderDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PlaceOrderInput {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  mobileNumber?: string;
  paymentMethod: "cod" | "stripe";
}

interface OrderApiResponse {
  message: string;
  order: Order;
}

interface PlaceOrderResponse extends OrderApiResponse {
  clientSecret?: string;
}

interface OrderState {
  currentOrder: Order | null;
  orderHistory: Order[];
  loading: boolean;
  error: string | null;

  placeOrder: (
    orderData: PlaceOrderInput,
    userId: string,
  ) => Promise<PlaceOrderResponse | null>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  getUserOrders: (userId: string) => Promise<void>;
  confirmPayment: (
    paymentIntentId: string,
    orderId: string,
  ) => Promise<boolean>;
  setCurrentOrder: (order: Order | null) => void;
  clearOrderHistory: () => void;
  setError: (error: string | null) => void;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const useOrderStore = create<OrderState>((set) => ({
  currentOrder: null,
  orderHistory: [],
  loading: false,
  error: null,

  placeOrder: async (orderData, userId) => {
    set({ loading: true, error: null });
    try {
      const payload = {
        ...orderData,
        userId,
      };
      const { data } = await api.post<PlaceOrderResponse>("/orders/place", payload);
      set({ currentOrder: data.order, loading: false });
      return data;
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to place order");
      set({ error: errorMessage, loading: false });
      console.error("Order placement error:", error);
      return null;
    }
  },

  getOrderById: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get<Order>(`/orders/${orderId}`);
      set({ currentOrder: data, loading: false });
      return data;
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to fetch order");
      set({ error: errorMessage, loading: false });
      console.error("Get order error:", error);
      return null;
    }
  },

  getUserOrders: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get<Order[]>(`/orders/user/${userId}`);
      set({ orderHistory: data, loading: false });
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to fetch orders");
      set({ error: errorMessage, loading: false });
      console.error("Get user orders error:", error);
    }
  },

  confirmPayment: async (paymentIntentId, orderId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post<OrderApiResponse>("/orders/confirm-payment", {
        paymentIntentId,
        orderId,
      });
      set({ currentOrder: data.order, loading: false });
      return true;
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Failed to confirm payment");
      set({ error: errorMessage, loading: false });
      console.error("Payment confirmation error:", error);
      return false;
    }
  },

  setCurrentOrder: (order) => set({ currentOrder: order }),

  clearOrderHistory: () => set({ orderHistory: [] }),

  setError: (error) => set({ error }),
}));

export type { Order };
