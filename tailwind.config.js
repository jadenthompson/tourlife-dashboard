/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: "class", // supports dark mode toggle
    theme: {
      extend: {},
    },
    plugins: [],
    theme: {
      extend: {
        animation: {
          "slide-in-up": "slideInUp 0.6s ease-out both",
        },
        keyframes: {
          slideInUp: {
            "0%": { opacity: 0, transform: "translateY(20px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        },
      },
    }
    
  };
  
  