/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#03070f",
        panel: "#060d1a",
        raised: "#0b1526",
        border: "#1a2d4a",
        gold: "#d4af37",
        goldsoft: "#e8c766",
        brand: {
          cyan: "#3ec1ff",
          blue: "#3b6ef6",
          violet: "#8b5cf6",
          deep: "#5a3cf5",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(212,175,55,0.35)",
        glowsm: "0 0 24px -8px rgba(212,175,55,0.4)",
        card: "0 8px 30px -12px rgba(0,0,0,0.6)",
        "glow-brand": "0 6px 26px -6px rgba(90,108,255,0.55)",
        "glow-brand-sm": "0 4px 18px -6px rgba(90,108,255,0.45)",
      },
      backgroundImage: {
        "radial-fade": "radial-gradient(circle at top, rgba(212,175,55,0.08), transparent 60%)",
        "grid-fade": "linear-gradient(to bottom, transparent, #03070f)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.35s ease-out",
        shimmer: "shimmer 1.6s infinite linear",
      },
    },
  },
  plugins: [],
};
