import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import type { UserConfig } from 'vite';
import { loadEnv } from './src/utils/viteBuild';

const pathResolve = (dir: string): any => {
	return resolve(__dirname, '.', dir);
};

const { VITE_PORT, VITE_OPEN, VITE_PUBLIC_PATH } = loadEnv();

const alias: Record<string, string> = {
	'/@': pathResolve('./src/'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
};

const viteConfig: UserConfig = {
	plugins: [vue()],
	root: process.cwd(),
	resolve: { alias },
	base: process.env.NODE_ENV === 'production' ? VITE_PUBLIC_PATH : './',
	optimizeDeps: {
		include: ['element-plus/lib/locale/lang/zh-cn', 'element-plus/lib/locale/lang/en', 'element-plus/lib/locale/lang/zh-tw'],
	},
	server: {
		host: '0.0.0.0',
		port: VITE_PORT,
		open: VITE_OPEN,
		proxy: {
			'/main': {
				target: 'http://localhost:82/',
				// target: 'http://1.117.50.21:89/',
				changeOrigin: true,
				ws: false,  // 开启 websockets 代理
				secure: false, // 验证 SSL 证书
				rewrite: (path) => path.replace(/^\/main/, 'api/3d'),
			},
			// '/worker': {
			// 	// target: 'http://localhost:9529/',
			// 	target: 'http://1.117.50.21:89/',
			// 	changeOrigin: true,
			// 	ws: false,  // 开启 websockets 代理
			// 	secure: false, // 验证 SSL 证书
			// 	// rewrite: (path) => path.replace(/^\/main/, 'api'),
			// },
		},
	},
	build: {
		outDir: 'dist',
		minify: 'esbuild',
		sourcemap: false,
		chunkSizeWarningLimit: 1500,
	},
	define: {
		__VUE_I18N_LEGACY_API__: JSON.stringify(false),
		__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
		__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
	},
};

export default viteConfig;
