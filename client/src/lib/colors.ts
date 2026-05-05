// Global Color Variables for consistency across the app
export const COLORS = {
  // Primary Colors
  primary: "#2563EB", // Blue-600
  primaryDark: "#1D4ED8", // Blue-700
  primaryLight: "#3B82F6", // Blue-500

  // Secondary Colors
  secondary: "#6B7280", // Gray-500
  secondaryLight: "#9CA3AF", // Gray-400
  secondaryDark: "#4B5563", // Gray-700

  // Background Colors
  bgLight: "#F3F4F6", // Gray-100
  bgLighter: "#F9FAFB", // Gray-50
  bgDark: "#111827", // Gray-900

  // Accent Colors
  success: "#10B981", // Green-500
  error: "#EF4444", // Red-500
  warning: "#F59E0B", // Amber-500
  info: "#06B6D4", // Cyan-500

  // Text Colors
  textPrimary: "#111827", // Gray-900
  textSecondary: "#6B7280", // Gray-500
  textLight: "#D1D5DB", // Gray-300
  textWhite: "#FFFFFF",

  // Border Colors
  border: "#E5E7EB", // Gray-200
  borderLight: "#F3F4F6", // Gray-100

  // Gradient
  gradient: "linear-gradient(to right, #2563EB, #1D4ED8)",
} as const;

// Tailwind class helpers
export const TAILWIND_COLORS = {
  primary: "text-blue-600 hover:text-blue-700",
  primaryBg: "bg-blue-600 hover:bg-blue-700",
  primaryGradient: "bg-gradient-to-r from-blue-600 to-blue-700",
  secondary: "text-gray-600 hover:text-gray-700",
  error: "text-red-600 hover:text-red-700",
  errorBg: "bg-red-50 border border-red-200 text-red-700",
  success: "text-green-600 hover:text-green-700",
  successBg: "bg-green-50 border border-green-200 text-green-700",
} as const;
