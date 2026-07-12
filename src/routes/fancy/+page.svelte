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
		['ユリウス暦', Calendar.Julian, 'HH:mm'],
		['ロムルス暦', Calendar.Romulus, 'HH:mm'],
		['アマンタ', Calendar.アマンタ, 'HH:mm'],
		['プールニマンタ', Calendar.プールニマンタ, 'HH:mm'],
		['アマンタ tithi', Calendar.アマンタティティ, 'HH:mm'],
		['プールニマンタ tithi', Calendar.プールニマンタティティ, 'HH:mm'],
		['Maya', Calendar.Maya, 'HH:mm'],
		['Beat', Calendar.Beat, 'HH:mm'],
		['エジプト民用暦', Calendar.エジプト民用暦, 'HH:mm'],
		['コプト暦', Calendar.コプト暦, 'HH:mm'],
		['太陽太陰暦（木星、カリスト）', Calendar.Jupiter, 'HH:mm'],
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
	<select bind:value={mode}>
		<option value={1}>1. 差分</option>
		<option value={2}>2. 日時・干支</option>
		<option value={3}>3. 天文</option>
	</select>
</div>

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
