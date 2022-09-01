import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginString from 'vite-plugin-string';
import ObjFileImport from 'unplugin-obj/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ObjFileImport(),
    vitePluginString({
      include: ['**/*.vs', '**/*.fs', '**/*.vert', '**/*.frag', '**/*.glsl', '**/*.wgsl']
    })
  ]
});
