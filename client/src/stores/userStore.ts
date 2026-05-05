import { create } from "zustand";
import { AxiosError } from "axios";
import api, {
  clearAccessToken,
  getAccessToken,
  refreshAccessToken,
  setAccessToken,
} from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  message?: string;
}

interface UserState {
  user: User | null;
  error: string | null;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  googleAuth: (credential: string) => Promise<boolean>;
  checkToken: () => Promise<void>;
  logoutUser: () => Promise<void>;
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

const applyAuthResponse = (data: AuthResponse, set: (state: Partial<UserState>) => void) => {
  setAccessToken(data.accessToken);
  set({ user: data.user, error: null });
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  error: null,

  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),

  loginUser: async (email, password) => {
    try {
      const { data } = await api.post<AuthResponse>("/users/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      applyAuthResponse(data, set);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      set({ error: getErrorMessage(error, "Login failed") });
      return false;
    }
  },

  registerUser: async (name, email, password) => {
    try {
      const { data } = await api.post<AuthResponse>("/users/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      applyAuthResponse(data, set);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      set({ error: getErrorMessage(error, "Registration failed") });
      return false;
    }
  },

  googleAuth: async (credential) => {
    try {
      const { data } = await api.post<AuthResponse>("/users/google", {
        credential,
      });

      applyAuthResponse(data, set);
      return true;
    } catch (error) {
      console.error("Google auth error:", error);
      set({ error: getErrorMessage(error, "Google authentication failed") });
      return false;
    }
  },

  checkToken: async () => {
    let accessToken = getAccessToken();

    if (!accessToken) {
      try {
        accessToken = await refreshAccessToken();
      } catch (error) {
        set({ user: null, error: null });
        clearAccessToken();
        return;
      }
    }

    try {
      const { data } = await api.get<{ user: User }>("/users/check-token", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      set({ user: data.user, error: null });
    } catch (error) {
      console.error("Token check error:", error);
      set({ user: null, error: getErrorMessage(error, "Invalid session") });
      clearAccessToken();
    }
  },

  logoutUser: async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAccessToken();
      set({ user: null, error: null });
    }
  },
}));
