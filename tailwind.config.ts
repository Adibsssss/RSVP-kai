import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Shades of blue, baby-blue forward. No gold/blush this time —
        // it's a blue-only palette per the brief.
        ink: "#173259", // deep navy — body/heading text
        paper: "#f3f9fe", // near-white, whisper of blue
        line: "#d6ebfa", // pale blue hairline/border
        muted: "#5c7290", // blue-grey secondary text
        baby: "#bfe3fa", // the signature baby blue
        sky: "#8fc7ec", // mid blue
        cornflower: "#3d84c4", // primary button / action blue
        deep: "#12335e", // envelope, overlays
        cloud: "#eaf5fd", // lightest fill
      },
      fontFamily: {
        sans: ["DM Sans Variable", "system-ui", "sans-serif"],
        display: ["Playfair Display Variable", "Georgia", "serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "float-in": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "reveal-up": {
          "0%": { transform: "translateY(36px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "seal-idle": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.12)", opacity: "0.5" },
        },
      },
      animation: {
        "fade-in": "fade-in 400ms ease-out both",
        "float-in": "float-in 550ms cubic-bezier(0.22,1,0.36,1) both",
        "reveal-up": "reveal-up 650ms cubic-bezier(0.22,1,0.36,1) both",
        "seal-idle": "seal-idle 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
