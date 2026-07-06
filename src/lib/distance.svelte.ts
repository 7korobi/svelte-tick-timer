// tslib の __exportStar 経由の再エクスポートは Cloudflare Workers の
// バンドラが named export として静的検出できず undefined になるため、
// namespace import で実行時の実体を丸ごと受け取る(tick.svelte.ts と同じ理由)。
import * as fancyDate from 'fancy-date';
import type { Span, SpanOptions } from 'fancy-date';
import { INTERVAL_MAX } from './tick.svelte.js';

const { Calendar } = fancyDate;
const { LocalGregorian } = Calendar;

/**
 * TickDistance: 指定した時点(at)から現在までの相対表現(Span)を Svelte5 Runes
 * でリアクティブ化したもの。current.timeout(次に表示が変わるまでの時間)で
 * タイマーを再設定する。
 *
 * 旧実装は DISTANCES/TIMERS という独自の近似値テーブルを持っていたが、これは
 * fancy-date.ts 本体の span_obj()(暦の実際の境界に基づく、より正確な実装)と
 * 完全に重複していた。LocalGregorian.span_obj(at) は from を省略すると
 * Date.now() を起点にするため、まさに「at から現在まで」の相対表現が得られる。
 */
export class TickDistance {
	current: Span = $state() as Span;

	#timer?: ReturnType<typeof setTimeout>;
	#at: number;
	#options: SpanOptions;

	constructor(at: number | Date, options: SpanOptions = {}) {
		this.#at = Number(at);
		this.#options = options;
		this.current = LocalGregorian.span_obj(this.#at, undefined, options);
		this.#schedule();
	}

	#schedule() {
		const timeout = this.current.timeout;
		if (timeout === undefined) return; // next_at が無い(遠い過去・未来など)場合は更新不要
		const msec = Math.min(timeout, INTERVAL_MAX);
		this.#timer = setTimeout(() => {
			this.current = LocalGregorian.span_obj(this.#at, undefined, this.#options);
			this.#schedule();
		}, msec);
	}

	/** タイマーを止める。コンポーネント側の $effect のクリーンアップから呼ぶ。 */
	destroy() {
		clearTimeout(this.#timer);
	}
}

/** at から現在までの相対表現(Span)をリアクティブに追跡する TickDistance を作る。 */
export function tickDistance(at: number | Date, options?: SpanOptions): TickDistance {
	return new TickDistance(at, options);
}
