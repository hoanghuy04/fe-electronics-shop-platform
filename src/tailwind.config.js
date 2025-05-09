/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{ts,tsx}",
      "./**/*.{js,ts,jsx,tsx}", // Ensure all files are scanned
    ],
    theme: {
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
          "tech-blue": {
            DEFAULT: "#0066ff",
            50: "#e6f0ff",
            100: "#cce0ff",
            200: "#99c2ff",
            300: "#66a3ff",
            400: "#3385ff",
            500: "#0066ff",
            600: "#0052cc",
            700: "#003d99",
            800: "#002966",
            900: "#001433",
          },
          "tech-red": {
            DEFAULT: "#ff3366",
            50: "#ffe6ec",
            100: "#ffccd9",
            200: "#ff99b3",
            300: "#ff668c",
            400: "#ff3366",
            500: "#ff0040",
            600: "#cc0033",
            700: "#990026",
            800: "#66001a",
            900: "#33000d",
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        animation: {
          float: "float 6s ease-in-out infinite",
          "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        },
        keyframes: {
          float: {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-10px)" },
          },
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  }
  