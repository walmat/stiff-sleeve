import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    alias: {
      $components: './src/components',
      $utils: './src/lib/utils',
      $lib: './src/lib'
    }
  },
  preprocess: [
    preprocess({
      postcss: true
    }),
    vitePreprocess({})
  ]
};

export default config;
