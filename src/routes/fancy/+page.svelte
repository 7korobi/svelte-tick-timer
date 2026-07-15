<script lang="ts">
	import type { FancyDate, FormatPart } from 'fancy-date';
	// tslib の __exportStar 経由の再エクスポートは Cloudflare Workers の
	// バンドラが named export として静的検出できず undefined になるため、
	// namespace import で実行時の実体を丸ごと受け取る(routes/+page.svelte の
	// to_msec と同じ理由)。
	import * as fancyDate from 'fancy-date';
	const { Calendar, Tempo, hasLunarEvents } = fancyDate;

	const calendars: [string, FancyDate, string][] = [
		['グレゴリオ暦(UTC)', Calendar.UTC, 'HH:mm'],
		['現地グレゴリオ暦', Calendar.LocalGregorian, 'HH:mm'],
		['漢数字グレゴリオ暦', Calendar.漢数字Gregorian, 'HH:mm'],
		['グレゴリオ暦（天文高精度）', Calendar.GregorianAstronomical, 'HH:mm'],
		['定気法 太陽太陰暦（地球、月）', Calendar.定気法, 'Homo'],
		['平気法 太陽太陰暦（地球、月）', Calendar.平気法, 'Homo'],
		['フランス革命暦', Calendar.フランス革命暦, 'HH:mm'],
		['ユリウス暦', Calendar.Julian, 'Ho mo'],
		['ロムルス暦', Calendar.Romulus, 'Ho mo'],
		['アマンタ', Calendar.アマンタ, 'HH:mm'],
		['プールニマンタ', Calendar.プールニマンタ, 'HH:mm'],
		['タイ太陰太陽暦', Calendar.タイ太陰太陽暦, 'HH:mm'],
		['アマンタ tithi', Calendar.アマンタティティ, 'HH:mm'],
		['プールニマンタ tithi', Calendar.プールニマンタティティ, 'HH:mm'],
		['Maya', Calendar.Maya, 'HH:mm'],
		['Beat', Calendar.Beat, '@HHH'],
		['エジプト民用暦', Calendar.エジプト民用暦, 'HH:mm'],
		['コプト暦', Calendar.コプト暦, 'HH:mm'],
		['太陽太陰暦（木星、カリスト）', Calendar.Jupiter, 'HH:mm'],
		['太陽太陰暦（天文高精度）', Calendar.JupiterObserved, 'HH:mm'],
		['太陽暦（火星）', Calendar.MarsGregorian, 'HH:mm']

	];

	type RichText = { parts: FormatPart[] };

	function rich(c: FancyDate, utc: number, fmt: string): RichText {
		if (!Number.isFinite(utc)) return { parts: [] };
		return { parts: c.format_parts(utc, fmt) };
	}

	// C: この暦を使ったどの表現を見るかのモード。
	// 1: リアクティブな「今」との差分(fancy-date の span() は from 省略時
	//    Date.now() を終点にするため、show_at からの相対表現がそのまま使える)。
	// 2: 日時(日付・曜・時刻)+干支。
	// 3: 節気・日の出/南中/日の入(太陽)・月相・月の出/南中/月の入(月、衛星未定義の
	//    暦(火星の太陽暦等)では取得できないため undefined のまま表示を省く)。
	let mode: 1 | 2 | 3 = $state(2);
	let view: 'list' | 'calendar' | 'clock' = $state('list');
	let calendarScale: 'day' | 'week' | 'month' | 'year' = $state('month');
	let clockMode: 'normal' | 'day' | 'week' = $state('normal');
	// A: グループボックス(ラジオボタン群)で選択されている、操作対象の暦。
	let selected = $state(0);

	let since = $state(0);
	let current_at = $state(Date.now());

	const show_at = $derived(current_at + since);
	const target = $derived(calendars[selected][1]);
	const minutes = $derived(calendars.map(([, c]) => c.to_tempos(show_at).m));
	// 月の出/月の入や日の出/日の入は、その暦日の中に該当イベントが
	// 一度も起きない日には NaN になる(実測: 月の出のない日がある)。
	// NaN を format() に渡すと lunisolar() の朔探索が発散し
	// 「failed to resolve lunisolar month」で例外を投げる。results は
	// 16暦をまとめて1つの $derived.by で計算しているため、1暦の1イベント
	// が NaN になっただけで例外が全体に伝播し、テーブル全体が(次に全暦とも
	// 例外を出さない show_at に辿り着くまで)古い表示のまま固まってしまう
	// (「年送りボタンを押しても反映されない/数回分まとめて動く」の実体)。
	// 該当イベントがない場合は空欄にフォールバックし、他の暦・他の行を
	// 巻き込まないようにする。
	function format_event(c: FancyDate, utc: number, fmt: string): RichText {
		return rich(c, utc, fmt);
	}
	const results = $derived.by(() =>
		calendars.map((data) => {
			const [label, c, time_f] = data;
			const solor = c.solor(show_at);
			const moon = hasLunarEvents(c.dic.moony) ? c.lunar(show_at) : undefined;
			return {
				label,
				standard: rich(c, show_at, c.dic.format),
				weekday: rich(c, show_at, 'E'),
				yearCycle: rich(c, show_at, 'yCo'),
				dayCycle: rich(c, show_at, 'dCo'),
				season: rich(c, show_at, 'Zo'),
				phase: rich(c, show_at, 'No'),
				sun: [
					format_event(c, solor.日の出, time_f),
					format_event(c, solor.南中時刻, time_f),
					format_event(c, solor.日の入, time_f)
				],
				moon:
					moon &&
					[
						format_event(c, moon.月の出, time_f),
						format_event(c, moon.南中時刻, time_f),
						format_event(c, moon.月の入, time_f)
					],
				span: c.span(show_at, current_at, { precise: 'm' }),
				data
			} as const;
		})
	);

	type CalendarCell = {
		at: number;
		primary: RichText;
		secondary: RichText;
		current: boolean;
		selected: boolean;
	};

	function cells_between(c: FancyDate, start: number, end: number, token: 'd' | 'H' | 'M') {
		return c.periods([start, end], { step: token, limit: 400 }).map((tempo) => {
			const at = tempo.last_at;
			return {
				at,
				primary: rich(c, at, token === 'H' ? 'HH:mm' : token === 'M' ? 'Mo' : 'do'),
				secondary: rich(c, at, token === 'M' ? 'y年' : token === 'H' ? 'm分' : 'E'),
				current: tempo.is_cover(current_at),
				selected: tempo.is_cover(show_at)
			};
		});
	}

	const calendarCells = $derived.by(() => {
		const c = target;
		const tempos = c.to_tempos(show_at);
		if (calendarScale === 'day') return cells_between(c, tempos.d.last_at, tempos.d.next_at, 'H');
		if (calendarScale === 'week') return cells_between(c, tempos.w.last_at, tempos.w.next_at, 'd');
		if (calendarScale === 'month') return cells_between(c, tempos.M.last_at, tempos.M.next_at, 'd');
		return cells_between(c, tempos.u.last_at, tempos.u.next_at, 'M');
	});

	const calendarTitle = $derived.by(() => {
		const c = target;
		if (calendarScale === 'day') return c.format(show_at, 'Gy年Mo d日(E)');
		if (calendarScale === 'week') return c.format(show_at, 'Gy年 第w週');
		if (calendarScale === 'month') return c.format(show_at, 'Gy年Mo');
		return c.format(show_at, 'Gy年');
	});

	function clock_angle(value: number) {
		return value * 360 - 90;
	}

	const clock = $derived.by(() => {
		const c = target;
		const tempos = c.to_tempos(show_at);
		const hourProgress = tempos.H.now_idx + tempos.H.since / tempos.H.size;
		const minuteProgress = tempos.m.now_idx + tempos.m.since / tempos.m.size;
		const secondProgress = tempos.s.now_idx + tempos.s.since / tempos.s.size;
		const weekProgress = tempos.w.now_idx + tempos.w.since / tempos.w.size;
		const hourDenominator = clockMode === 'normal' ? 12 : c.dic.H.length || 24;
		const hourValue = clockMode === 'normal' ? hourProgress % 12 : hourProgress;
		const mainValue = clockMode === 'week' ? weekProgress : hourValue;
		const mainDenominator = clockMode === 'week' ? c.dic.E.length || 7 : hourDenominator;
		return {
			label:
				clockMode === 'normal'
					? '通常'
					: clockMode === 'day'
						? `${c.dic.H.length || 24}時間`
						: '週間',
			main: clock_angle(mainValue / mainDenominator),
			minute: clock_angle((minuteProgress % c.dic.m.length) / c.dic.m.length),
			second: clock_angle((secondProgress % c.dic.s.length) / c.dic.s.length),
			caption: c.format(show_at, 'Gy年Mo d日(E) HH:mm:ss'),
			ticks: Array.from({ length: mainDenominator }, (_, index) => ({
				angle: clock_angle(index / mainDenominator),
				label: `${index || mainDenominator}`
			}))
		};
	});

	tick();

	async function tick() {
		await Tempo.sleep(minutes);
		if (current_at) current_at = Date.now();
		tick();
	}

	// fancy-date 本体には succ_msec/back_msec 相当のメソッドがないため、
	// succ(utc, diff)/back(utc, diff)(差分適用後の絶対時刻を返す)との差分として
	// ここで薄く再現する。succ(utc, diff)=add(utc, diff)、back(utc, diff)=
	// sub(utc, diff)=add_span(utc, invert_span(diff)) であり、diff の
	// パース結果自体に(後/前による)符号が既に載っているため、sub 側で
	// もう一度符号反転が掛かる。そのため「量」を指定するには succ/back
	// どちらにも同じ「後」を付ける必要があり(実測: back(utc,'1年後')は
	// 正しく1年前に戻り、back(utc,'1年前')は逆に1年後に進んでしまう)、
	// docs/manual.md の `sub(to, '...前')` という記述はこの実装とは
	// 矛盾しているので鵜呑みにしないこと。diff('1年'等)を渡す側では
	// 方向を意識しなくて済むよう、ここで一律「後」を付加する。
	function back_msec(c: FancyDate, utc: number, diff: string) {
		return c.back(utc, `${diff}後`) - utc;
	}
	function succ_msec(c: FancyDate, utc: number, diff: string) {
		return c.succ(utc, `${diff}後`) - utc;
	}

	// ボタン操作は常に、A(グループボックス)で選択されている target に対して行う。
	function back(diff: string) {
		since += back_msec(target, show_at, diff);
	}

	function succ(diff: string) {
		since += succ_msec(target, show_at, diff);
	}

	function reset() {
		since = 0;
	}
</script>

{#snippet richText(value: RichText)}
	{#each value.parts as part}
		{#if part.ruby}
			<ruby data-ruby={part.ruby}>{part.text}<rt>{part.ruby}</rt></ruby>
		{:else}
			{part.text}
		{/if}
	{/each}
{/snippet}

<div class="controls">
	<button onclick={() => reset()}>reset</button>
	<span class="form">
		<button onclick={() => back('1年')}>−</button><span>年</span><button onclick={() => succ('1年')}
			>＋</button
		>
	</span>
	<span class="form">
		<button onclick={() => back('1ヶ月')}>−</button><span>月</span><button
			onclick={() => succ('1ヶ月')}>＋</button
		>
	</span>
	<span class="form">
		<button onclick={() => back('1週')}>−</button><span>週</span><button onclick={() => succ('1週')}
			>＋</button
		>
	</span>
	<span class="form">
		<button onclick={() => back('1日')}>−</button><span>日</span><button onclick={() => succ('1日')}
			>＋</button
		>
	</span>
	<span class="form">
		<button onclick={() => back('1時間')}>−</button><span>時</span><button
			onclick={() => succ('1時間')}>＋</button
		>
	</span>
	<span class="form">
		<button onclick={() => back('1分')}>−</button><span>分</span><button onclick={() => succ('1分')}
			>＋</button
		>
	</span>
	<span class="form">
		<button onclick={() => back('1秒')}>−</button><span>秒</span><button onclick={() => succ('1秒')}
			>＋</button
		>
	</span>
	<span>差分 {since} msec</span>
	<select bind:value={view}>
		<option value="list">一覧</option>
		<option value="calendar">カレンダー</option>
		<option value="clock">時計</option>
	</select>
	<select bind:value={mode}>
		<option value={1}>1. 差分</option>
		<option value={2}>2. 日時・干支</option>
		<option value={3}>3. 天文</option>
	</select>
</div>

{#if view === 'list'}
	<table>
	<thead>
		{#if mode === 1}
			<tr>
				<th></th>
				<th>暦</th>
				<th>差分</th>
			</tr>
		{:else if mode === 2}
			<tr>
				<th></th>
				<th>暦</th>
				<th>標準表記</th>
				<th colspan="2">干支</th>
			</tr>
		{:else if mode === 3}
			<tr>
				<th></th>
				<th>暦</th>
				<th>節気</th>
				<th>月相</th>
				<th>日出</th>
				<th>南中</th>
				<th>日入</th>
				<th>月出</th>
				<th>南中</th>
				<th>月入</th>
			</tr>
		{/if}
	</thead>
	<tbody>
		{#each results as result, index}
			<tr>
				<td class="c">
					<input type="radio" name="target" bind:group={selected} value={index} />
				</td>
				<td class="l">{result.label}</td>
				{#if mode === 1}
					<td class="l"><span>{result.span}</span></td>
				{:else if mode === 2}
					<td class="l">
						{@render richText(result.standard)}
					</td>
					<td class="c">
						{@render richText(result.yearCycle)}年
					</td>
					<td class="c">
						{@render richText(result.dayCycle)}日
					</td>
				{:else if mode === 3}
					<td class="c">{@render richText(result.season)}</td>
					<td class="c">{@render richText(result.phase)}</td>
					<td class="l">{@render richText(result.sun[0])}</td>
					<td class="l">{@render richText(result.sun[1])}</td>
					<td class="l">{@render richText(result.sun[2])}</td>
					{#if result.moon}
						<td class="l">{@render richText(result.moon[0])}</td>
						<td class="l">{@render richText(result.moon[1])}</td>
						<td class="l">{@render richText(result.moon[2])}</td>
					{:else}
						<td class="l" colspan="3"></td>
					{/if}
				{/if}
			</tr>
		{/each}
	</tbody>
	</table>
{:else if view === 'calendar'}
	<section class="panel calendar-panel">
		<header class="panel-header">
			<h2>{calendars[selected][0]} / {calendarTitle}</h2>
			<div class="segmented">
				<button class:active={calendarScale === 'day'} onclick={() => (calendarScale = 'day')}>日</button>
				<button class:active={calendarScale === 'week'} onclick={() => (calendarScale = 'week')}>週</button>
				<button class:active={calendarScale === 'month'} onclick={() => (calendarScale = 'month')}>月</button>
				<button class:active={calendarScale === 'year'} onclick={() => (calendarScale = 'year')}>年</button>
			</div>
		</header>
		<div class:calendar-grid={calendarScale !== 'day'} class:time-grid={calendarScale === 'day'}>
			{#each calendarCells as cell}
				<button class="calendar-cell" class:current={cell.current} class:selected={cell.selected} onclick={() => (since += cell.at - show_at)}>
					<strong>{@render richText(cell.primary)}</strong>
					<small>{@render richText(cell.secondary)}</small>
				</button>
			{/each}
		</div>
	</section>
{:else if view === 'clock'}
	<section class="panel clock-panel">
		<header class="panel-header">
			<h2>{calendars[selected][0]} / {clock.label}時計</h2>
			<div class="segmented">
				<button class:active={clockMode === 'normal'} onclick={() => (clockMode = 'normal')}>通常</button>
				<button class:active={clockMode === 'day'} onclick={() => (clockMode = 'day')}>24時間</button>
				<button class:active={clockMode === 'week'} onclick={() => (clockMode = 'week')}>週間</button>
			</div>
		</header>
		<svg class="clock" viewBox="-120 -120 240 240" role="img" aria-label={clock.caption}>
			<circle class="clock-face" r="104" />
			{#each clock.ticks as tick}
				<g transform={`rotate(${tick.angle + 90}) translate(0 -94)`}>
					<line class="tick" y1="0" y2="8" />
				</g>
			{/each}
			<line class="hand main-hand" x1="0" y1="0" x2="72" y2="0" transform={`rotate(${clock.main})`} />
			{#if clockMode !== 'week'}
				<line class="hand minute-hand" x1="0" y1="0" x2="88" y2="0" transform={`rotate(${clock.minute})`} />
				<line class="hand second-hand" x1="0" y1="0" x2="96" y2="0" transform={`rotate(${clock.second})`} />
			{/if}
			<circle class="pin" r="4" />
		</svg>
		<p class="clock-caption">{clock.caption}</p>
	</section>
{/if}

<style>
	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5em;
		margin-bottom: 0.5em;
	}
	.form {
		flex-wrap: nowrap;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.panel {
		max-width: 980px;
	}
	.panel-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin: 0.5rem 0 0.75rem;
	}
	.panel-header h2 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
	}
	.segmented {
		display: inline-flex;
		gap: 1px;
		border: 1px solid #999;
	}
	.segmented button {
		border: 0;
		border-radius: 0;
		background: #f7f7f7;
		padding: 0.35rem 0.65rem;
	}
	.segmented button.active {
		background: #222;
		color: white;
	}
	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
		gap: 0.35rem;
	}
	.time-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
		gap: 0.35rem;
	}
	.calendar-cell {
		min-height: 3.8rem;
		border: 1px solid #bbb;
		background: white;
		text-align: left;
		padding: 0.45rem;
	}
	.calendar-cell strong,
	.calendar-cell small {
		display: block;
	}
	.calendar-cell small {
		color: #666;
		margin-top: 0.25rem;
	}
	.calendar-cell.current {
		border-color: #0a7;
	}
	.calendar-cell.selected {
		outline: 2px solid #222;
		outline-offset: -2px;
	}
	.clock-panel {
		display: grid;
		justify-items: center;
	}
	.clock {
		width: min(78vw, 24rem);
		aspect-ratio: 1;
	}
	.clock-face {
		fill: #fafafa;
		stroke: #222;
		stroke-width: 2;
	}
	.tick {
		stroke: #333;
		stroke-width: 2;
		stroke-linecap: round;
	}
	.hand {
		stroke-linecap: round;
		transform-origin: 0 0;
	}
	.main-hand {
		stroke: #111;
		stroke-width: 6;
	}
	.minute-hand {
		stroke: #555;
		stroke-width: 3;
	}
	.second-hand {
		stroke: #b22;
		stroke-width: 1.5;
	}
	.pin {
		fill: #222;
	}
	.clock-caption {
		font-variant-numeric: tabular-nums;
		margin: 0.25rem 0 0;
	}
	table {
		border-collapse: collapse;
	}
	td {
		padding: 0.1em 0.4em;
		white-space: nowrap;
	}
	td.l {
		text-align: left;
	}
	td.c {
		text-align: center;
	}
</style>
