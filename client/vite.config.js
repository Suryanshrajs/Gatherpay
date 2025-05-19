import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
// https://vitejs.dev/config/
export default defineConfig({
 plugins: [react(), tsconfigPaths()],
 server: {
    host: true,
    allowedHosts: 'ec2-13-60-18-19.eu-north-1.compute.amazonaws.com'
  }
})
