// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://parampreetsingh.dev',
  integrations: [mdx()],
  devToolbar: { enabled: false }, // overlaps the OS dock
  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare({ imageService: 'compile' })
});
