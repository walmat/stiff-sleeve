// <reference types="@sveltejs/kit" />
interface ImportMetaEnv {
  VITE_SHOPIFY_STOREFRONT_API_TOKEN: string;
  VITE_SHOPIFY_API_ENDPOINT: string;
  VITE_SANITY_DATASET: string;
  VITE_SANITY_PROJECT_ID: string;

  VITE_SHOPIFY_ADMIN_API_ACCESS_TOKEN: string;
  VITE_RECAPTCHA_SECRET_KEY: string;
  VITE_ENCRYPTION_KEY: string;
  VITE_JWT_SECRET: string;
  VITE_PINATA_API_KEY: string;
  VITE_PINATA_SECRET_API_KEY: string;
  VITE_PINATA_JWT: string;
}
