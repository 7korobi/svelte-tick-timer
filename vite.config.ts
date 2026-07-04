import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	// fancy-date は file: ローカルリンク(シンボリックリンク)参照のため、
	// Vite の SSR 自動外部化(node_modules 内の通常依存関係を Node.js の
	// require に委ねる仕組み)の対象から漏れ、CJS(lib/index.js、
	// package.json の "type":"commonjs")のまま ESM 評価コンテキストで
	// インライン化・評価されてしまい `exports is not defined` になる。
	// ssr.external で明示的に外部化(require させる)ことで回避する。
	ssr: {
		external: ['fancy-date']
	}
};

export default config;
