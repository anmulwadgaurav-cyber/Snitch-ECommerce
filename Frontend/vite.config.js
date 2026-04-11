import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

//jo bhi request /api se shuru hoti hai wo http://localhost:5000 pe forward ho jayegi
//ise ham proxy karna kahte hai isse hota ye hai ki browser direct backed se contact nahi karega
//browser frontend se contact karega and frontend use backend ko forward kar dega.
//proxy ki help se ham CORS policy se bach sakte hai.
