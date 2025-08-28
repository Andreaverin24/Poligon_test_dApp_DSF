// vite.config.ts 

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import fs from 'fs';
import bundleObfuscator from 'vite-plugin-bundle-obfuscator';
import { createHtmlPlugin } from 'vite-plugin-html';
import dotenv from 'dotenv';
dotenv.config();

const { version } = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  plugins: [
    react(),
    bundleObfuscator({
      enable: true,
      log: false,
      autoExcludeNodeModules: true,
      threadPool: true,
      options: {
        stringArray: true,
        stringArrayEncoding: [],
        stringArrayThreshold: 0.05,
        rotateStringArray: false,

        compact: true,
        simplify: false,
        
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        selfDefending: false,
      },
    }),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: 'named',
      }
    }),
    createHtmlPlugin({
      inject: {
        data: {
          APP_VERSION: version,
          APP_DOMAIN: process.env.VITE_APP_DOMAIN,
        },
      },
    }),
  ],
  server: {
    port: 3000,
    fs: {
      allow: ['.'], 
    },
  },
  build: {
    sourcemap: false,
    minify: 'terser',
    outDir: 'dist',
    manifest: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: '/index.html',
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(version),
    'process.env.VITE_APP_DOMAIN': JSON.stringify(process.env.VITE_APP_DOMAIN),
    // 'process.env': {},
  },
});
