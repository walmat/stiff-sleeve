// <reference types="@sveltejs/kit" />
interface ImportMetaEnv {
  VITE_SHOPIFY_STOREFRONT_API_TOKEN: string;
  VITE_SHOPIFY_API_ENDPOINT: string;
  VITE_SANITY_DATASET: string;
  VITE_SANITY_PROJECT_ID: string;

  SHOPIFY_ADMIN_API_ACCESS_TOKEN: string;
  RECAPTCHA_SECRET_KEY: string;
  ENCRYPTION_KEY: string;
  JWT_SECRET: string;
  PINATA_API_KEY: string;
  PINATA_SECRET_API_KEY: string;
  PINATA_JWT: string;
}
