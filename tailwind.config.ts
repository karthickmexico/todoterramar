import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ── Brand palette: Navy + Gold ──────────────────────────────
        navy: {
          50:  "#eeedf8",
          100: "#cccbe9",
          200: "#9997d2",
          300: "#6664bb",
          400: "#3d3aa4",
          500: "#2b288d",
          600: "#211f72",
          700: "#17104f",   // primary navy
          800: "#0e0a31",
          900: "#09071f",   // navy dark
          950: "#050413",
        },
        gold: {
          50:  "#fdf8ed",
          100: "#faedd0",
          200: "#f5d98f",   // gold light
          300: "#f0d18a",
          400: "#e8bc5e",
          500: "#d7a84f",   // primary gold
          600: "#c4922c",
          700: "#a47622",
          800: "#835d1b",
          900: "#6b4c17",
          950: "#3d2a09",
        },
        // Keep legacy colors for admin panel backward-compat
        rose: {
          50: "#fff0f4",
          100: "#ffe1e9",
          200: "#ffc2d4",
          300: "#ff93b2",
          400: "#ff5d8a",
          500: "#ff2d64",
          600: "#f20d4a",
          700: "#cc083c",
          800: "#a80b36",
          900: "#8c0f32",
          950: "#4f0016",
        },
        blush: {
          50: "#fdf4f7",
          100: "#fce8f0",
          200: "#f8d0e2",
          300: "#f3a9c8",
          400: "#ec77a9",
          500: "#e0508c",
          600: "#ce316f",
          700: "#b12459",
          800: "#941f4d",
          900: "#7c1e44",
        },
        champagne: {
          50: "#fffbf0",
          100: "#fef5d9",
          200: "#fce8ab",
          300: "#f9d474",
          400: "#f6bc3c",
          500: "#f3a415",
          600: "#d9810a",
          700: "#b5600b",
          800: "#934b11",
          900: "#793e12",
        },
        cream: {
          50: "#fffef9",
          100: "#fffcf0",
          200: "#fff8dc",
          300: "#fff0b8",
          400: "#ffe785",
          500: "#ffdb52",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(215, 168, 79, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(215, 168, 79, 0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        shimmer: "shimmer 2s linear infinite",
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
      },
      backgroundImage: {
        "gradient-navy":
          "linear-gradient(150deg, #09071f 0%, #17104f 50%, #211f72 100%)",
        "gradient-navy-gold":
          "linear-gradient(135deg, #17104f 0%, #2b288d 50%, #d7a84f 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #c4922c 0%, #d7a84f 50%, #f0d18a 100%)",
        "gradient-hero":
          "linear-gradient(150deg, #09071f 0%, #17104f 40%, #211f72 100%)",
        "gradient-luxury":
          "linear-gradient(135deg, #eeedf8 0%, #fdf8ed 100%)",
        "gradient-rose-gold":
          "linear-gradient(135deg, #c82a5a 0%, #d4a030 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(238,237,248,0.8) 0%, rgba(255,255,255,1) 100%)",
      },
      boxShadow: {
        luxury:    "0 8px 40px -8px rgba(23, 16, 79, 0.25)",
        "luxury-lg": "0 20px 60px -12px rgba(23, 16, 79, 0.35)",
        "card-hover": "0 20px 40px -8px rgba(23, 16, 79, 0.18)",
        gold:      "0 8px 24px -4px rgba(215, 168, 79, 0.35)",
        "gold-lg": "0 16px 40px -8px rgba(215, 168, 79, 0.45)",
        inner:     "inset 0 2px 8px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
