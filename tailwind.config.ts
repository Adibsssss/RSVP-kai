import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shades of blue, baby-blue forward. No gold/blush this time —
        // it's a blue-only palette per the brief.
        ink: "#173259",       // deep navy — body/heading text
        paper: "#f3f9fe",     // near-white, whisper of blue
        line: "#d6ebfa",      // pale blue hairline/border
        muted: "#5c7290",     // blue-grey secondary text
        baby: "#bfe3fa",      // the signature baby blue
        sky: "#8fc7ec",       // mid blue
        cornflower: "#3d84c4",// primary button / action blue
        deep: "#12335e",      // envelope, overlays
        cloud: "#eaf5fd",     // lightest fill
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
        "flap-open": {
          "0%": { transform: "rotateX(0deg)" },
          "100%": { transform: "rotateX(-180deg)" },
        },
        "seal-vanish": {
          "0%": { opacity: "1", transform: "translate(-50%, -50%) scale(1) rotate(0deg)" },
          "20%": { opacity: "1", transform: "translate(-50%, -62%) scale(1.1) rotate(-4deg)" },
          "100%": { opacity: "0", transform: "translate(-50%, -420%) scale(0.72) rotate(18deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 400ms ease-out both",
        "float-in": "float-in 550ms cubic-bezier(0.22,1,0.36,1) both",
        "flap-open": "flap-open 700ms ease-in-out forwards",
        "seal-vanish": "seal-vanish 720ms cubic-bezier(0.2,0.85,0.25,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
