// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio.parampreetsingh.dev',
  integrations: [mdx()],
  devToolbar: { enabled: false }, // overlaps the OS dock

  adapter: cloudflare({ imageService: 'compile' })
});
