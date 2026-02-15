import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async ({ mode }) => {
  // loadEnv reads .env/.env.local files; process.env has Vercel dashboard vars
  const fileEnv = loadEnv(mode, __dirname, '');

  const supabaseUrl = fileEnv.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseAnonKey = fileEnv.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

  // Debug: log which env vars are available during Vercel build (remove after confirming)
  const supaRelated = Object.keys(process.env).filter(k =>
    k.includes('SUPA') || k.includes('VITE') || k.includes('SMTP') || k.includes('POSTGRES')
  );
  console.log('[vite-config] All relevant env var KEYS:', supaRelated);
  console.log('[vite-config] Total process.env keys:', Object.keys(process.env).length);
  console.log('[vite-config] resolved supabaseUrl:', supabaseUrl ? 'SET' : 'EMPTY');
  console.log('[vite-config] resolved supabaseAnonKey:', supabaseAnonKey ? 'SET' : 'EMPTY');

  return {
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...(process.env.NODE_ENV !== "production" &&
      process.env.REPL_ID !== undefined
        ? [
            await import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer(),
            ),
          ]
        : []),
    ],
    define: {
      __SUPABASE_URL__: JSON.stringify(supabaseUrl),
      __SUPABASE_ANON_KEY__: JSON.stringify(supabaseAnonKey),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: "dist",
      emptyOutDir: true,
      assetsDir: "assets",
      rollupOptions: {
        output: {
          manualChunks: undefined,
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/[name].[ext]`;
            }
            return `assets/[name]-[hash].[ext]`;
          },
        },
      },
    },
    publicDir: path.resolve(__dirname, "client/public"),
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
      proxy: {
        "/api": {
          target: "http://localhost:5002",
          changeOrigin: true,
        },
      },
    },
  };
});
