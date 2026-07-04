import { Calendar, to_tempo_bare, type Tempo } from 'fancy-date';

const { LocalGregorian } = Calendar;

// setTimeout の上限(31bit)。timeout がこれを超える場合はこの値でクランプする。
export const INTERVAL_MAX = 0x7fffffff;

/**
 * TickTempo: fancy-date の Tempo(next_at/timeout付き)を Svelte5 Runes で
 * リアクティブ化したもの。current が変わるたびに、次回変化時刻(timeout)で
 * タイマーを再設定する(旧 svelte-tick-timer の readable ストア+timeoutOn
 * パターンを Runes のクラスに置き換えたもの)。
 *
 * $effect には依存しない(モジュールトップレベルの tickSecondly 等が
 * コンポーネント外で常時稼働する共有時計として使われるため)。コンポーネント側で
 * 個別に生成したインスタンス(tickDistance 等)は、使い終わったら destroy() を
 * 呼んでタイマーを解除する。
 */
export class TickTempo {
	current: Tempo = $state() as Tempo;

	#timer?: ReturnType<typeof setTimeout>;
	#resolve: (now: number) => Tempo;

	constructor(resolve: (now: number) => Tempo) {
		this.#resolve = resolve;
		this.current = resolve(Date.now());
		this.#schedule();
	}

	#schedule() {
		const msec = Math.min(this.current.timeout, INTERVAL_MAX);
		this.#timer = setTimeout(() => {
			this.current = this.#resolve(Date.now());
			this.#schedule();
		}, msec);
	}

	/** タイマーを止める。コンポーネント側の $effect のクリーンアップから呼ぶ。 */
	destroy() {
		clearTimeout(this.#timer);
	}
}

/**
 * tickFixed: 固定周期(size)でtickする TickTempo を作る。zero(基準点)は
 * LocalGregorian.calc.zero.{day,week,...} のような、暦定義から導出された
 * 値を渡す(秒・分・時は暦上のzero点を持たないため 0 でよい)。
 */
function tickFixed(size: number, zero: number, label: string): TickTempo {
	return new TickTempo((now) => {
		const tempo = to_tempo_bare(size, zero, now);
		tempo.label = label;
		return tempo;
	});
}

export const tickSecondly = tickFixed(LocalGregorian.calc.msec.second, 0, '1秒');
export const tickMinutely = tickFixed(LocalGregorian.calc.msec.minute, 0, '1分');
export const tickHourly = tickFixed(LocalGregorian.calc.msec.hour, 0, '1時間');
export const tickDaily = tickFixed(LocalGregorian.calc.msec.day, LocalGregorian.calc.zero.day, '1日');
export const tickWeekly = tickFixed(
	LocalGregorian.calc.msec.week,
	LocalGregorian.calc.zero.week,
	'1週',
);

/**
 * tickTempoByCalendar: fancy-date の暦計算(現地グレゴリオ暦)を使い、月・四半期・
 * 年のような可変長の周期でtickする。旧実装は date-fns の startOfXxx()/endOfXxx()
 * を使っていたが、同じ役割を fancy-date の to_tempos() の M/Q/y token で
 * 代替できるため、date-fns への依存を排除する。
 */
function tickTempoByCalendar(
	label: string,
	range: (now: number) => { last_at: number; next_at: number },
): TickTempo {
	return new TickTempo((now) => {
		const { last_at, next_at } = range(now);
		const tempo = to_tempo_bare(next_at - last_at, last_at, now);
		tempo.label = label;
		return tempo;
	});
}

export const tickMonthly = tickTempoByCalendar('1ヶ月間', (now) => LocalGregorian.to_tempos(now).M);
export const tickQuarterly = tickTempoByCalendar('四半期間', (now) => LocalGregorian.to_tempos(now).Q);
export const tickYearly = tickTempoByCalendar('1年間', (now) => LocalGregorian.to_tempos(now).y);
export const tickDecadely = tickTempoByCalendar('10年間', (now) => {
	const { y } = LocalGregorian.to_tempos(now);
	const offset = ((y.now_idx % 10) + 10) % 10;
	const first = offset ? y.slide(-offset) : y;
	const last = first.slide(10);
	return { last_at: first.last_at, next_at: last.last_at };
});
