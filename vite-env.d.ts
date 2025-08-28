// vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WEB3_MODAL_PROJECT_ID: string;
    // добавь другие переменные, если нужно
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  