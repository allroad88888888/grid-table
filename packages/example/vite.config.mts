import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  // resolve:{
  //   alias:{
  //     "einfach-state":"./src/sb/es/index.js",
  //      "einfach-utils":"./src/sb2/src/index.ts"
  //   }
  // },
  // optimizeDeps:{
  //   include:["@emotion/react/jsx-dev-runtime"],
  // },
  plugins: [react()],
});