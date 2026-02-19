// tailwind.config.ts
import type { Config } from "tailwindcss"

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                main: {
                    50: "#fef2f2",
                    100: "#fee2e2",
                    200: "#fecaca",
                    300: "#fca5a5",
                    400: "#f87171",
                    500: "#ef4444",
                    600: "#dc2626",
                    700: "#b91c1c",
                    800: "#991b1b",
                    900: "#7f1d1d",
                    950: "#450a0a",
                },

                neutral: {
                    50: "#f9fafb",
                    100: "#f3f4f6",
                    200: "#e5e7eb",
                    300: "#d1d5db",
                    400: "#9ca3af",
                    500: "#6b7280",
                    600: "#4b5563",
                    700: "#374151",
                    800: "#1f2937",
                    900: "#111827",
                },

                success: {
                    400: "#4ade80",
                    500: "#22c55e",
                    600: "#16a34a", 
                },

                info: {
                    500: "#3b82f6",
                    600: "#2563eb",
                },

                warning: {
                    100: "#fef3c7",
                    500: "#f59e0b",
                    600: "#d97706",
                },

                danger: {
                    500: "#ef4444",
                    600: "#dc2626",
                    700: "#b91c1c",
                },
            },
        },

    },
    plugins: [],
} satisfies Config
