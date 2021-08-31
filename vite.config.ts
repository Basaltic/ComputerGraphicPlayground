import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import vitePluginString from 'vite-plugin-string';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), vitePluginString()]
});
