import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/main/servers/**/*.mjs',
          dest: 'servers'
        }
      ]
    })
  ],
  resolve: {
    conditions: ['node'],
    mainFields: ['module', 'jsnext:main', 'jsnext']
  },
  build: {
    rollupOptions: {
      external: ['openai', 'zod']
    }
  }
});
