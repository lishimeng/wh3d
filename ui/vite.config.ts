import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
		host: '0.0.0.0',
		port: 5173,
		open: true,
		proxy: {
			'/main': {
				// target: 'http://ows.thingplecloud.com:82', // 测试环境
				target: 'http://localhost:81', // 本地环境
				ws: true,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/main/, '/api'), // 本地环境
			}
		}
  }
})
