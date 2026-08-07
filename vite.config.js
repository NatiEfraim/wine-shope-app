import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,

    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,

        configure: (proxy) => {
          proxy.on('error', (err, req) => {
            console.error(
              'Proxy error:',
              req.method,
              req.url,
              err.message
            )
          })

          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(
              'Proxy request:',
              req.method,
              req.url,
              '-> http://127.0.0.1:8000'
            )
          })

          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(
              'Proxy response:',
              proxyRes.statusCode,
              req.method,
              req.url
            )
          })
        },
      },
    },
  },
})