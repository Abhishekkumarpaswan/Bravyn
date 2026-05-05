// src/stores/ecomStore.ts
import { create } from "zustand";
import api from "../lib/api";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface EcomState {
  products: Product[];
  cart: CartItem[];
  notification: {
    message: string;
    isVisible: boolean;
  };
  fetchProducts: () => Promise<void>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  toggleNotification: () => void;
}

export const useEcomStore = create<EcomState>((set, get) => ({
  products: [],
  cart: [],
  notification: {
    message: "LATEST COLLECTION IS LIVE NOW →",
    isVisible: true,
  },

  fetchProducts: async () => {
    try {
      const res = await api.get("/products");
      console.log("Fetched new products:", res.data.data);
      set({ products: res.data.data });
    } catch (error) {
      console.error("Failed to fetch products from backend:", error);
    }
  },

  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
      set({ cart: [...cart] });
    } else {
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
  },

  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    }));
  },

  increaseQuantity: (productId) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    }));
  },

  decreaseQuantity: (productId) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },

  toggleNotification: () => {
    set((state) => ({
      notification: {
        ...state.notification,
        isVisible: !state.notification.isVisible,
      },
    }));
  },
}));
