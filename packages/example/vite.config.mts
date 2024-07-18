import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  optimizeDeps:{
    include:["@emotion/react/jsx-dev-runtime"]
  },
  plugins: [react()],
});