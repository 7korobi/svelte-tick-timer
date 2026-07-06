<script lang="ts">
	import type { FancyDate } from 'fancy-date';
	// tslib の __exportStar 経由の再エクスポートは Cloudflare Workers の
	// バンドラが named export として静的検出できず undefined になるため、
	// namespace import で実行時の実体を丸ごと受け取る(routes/+page.svelte の
	// to_msec と同じ理由)。
	import * as fancyDate from 'fancy-date';
	const { Calendar, Tempo, hasLunarEvents } = fancyDate;

	const calendars: [string, FancyDate, string][] = [
		[
			'グレゴリオ暦(UTC)',
			Calendar.UTC,
			'Gyyyy/MM/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		],
		[
			'現地グレゴリオ暦',
			Calendar.LocalGregorian,
			'Gyyyy/MM/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		],
		[
			'グレゴリオ暦（天文高精度）',
			Calendar.GregorianAstronomical,
			'Gyyyy/MM/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		],
		[
			'定気法 太陽太陰暦（地球、月）',
			Calendar.定気法,
			'Gyy年Modd日 Homo Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		],
		[
			'平気法 太陽太陰暦（地球、月）',
			Calendar.平気法,
			'Gyy年Modd日 Homo Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		],
		[
			'フランス革命暦',
			Calendar.フランス革命暦,
			'Gyyy年Modd日 HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		],
		['ユリウス暦', Calendar.Julian, 'Gyyyy/Mo/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'],
		[
			'ロムルス暦',
			Calendar.Romulus,
			'Gyyyy/Mo/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		],
		['アマンタ', Calendar.アマンタ, 'Gyyyy/MM/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'],
		[
			'プールニマンタ',
			Calendar.プールニマンタ,
			'Gyyyy/MM/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		],
		['Maya', Calendar.Maya, 'Gyyyy/MM/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'],
		['Beat', Calendar.Beat, 'Gyyyy/MM/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'],
		[
			'エジプト民用暦',
			Calendar.エジプト民用暦,
			'Gyyyy/MM/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		],
		['コプト暦', Calendar.コプト暦, 'Gyyyy/MM/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'],
		[
			'太陽太陰暦（木星、カリスト）',
			Calendar.Jupiter,
			'Gyyyy/MM/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		],
		[
			'太陽暦（火星）',
			Calendar.MarsGregorian,
			'Gyyyy/MM/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		]
	];

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
	function format_event(c: FancyDate, utc: number, fmt: string): string[] {
		if (!Number.isFinite(utc)) return fmt.split(/\s/).map(() => '');
		return c.format(utc, fmt).split(/\s/);
	}
	const results = $derived.by(() =>
		calendars.map((data) => {
			const [label, c, date_f] = data;
			const [, time_fo, time_fr] = date_f.split(/\s/);
			const time_f = `${time_fo} ${time_fr}`;
			const solor = c.solor(show_at);
			const moon = hasLunarEvents(c.dic.moony) ? c.lunar(show_at) : undefined;
			return [
				label,
				c.format(show_at, date_f).split(/\s/),
				[
					format_event(c, solor.日の出, time_f),
					format_event(c, solor.南中時刻, time_f),
					format_event(c, solor.日の入, time_f)
				],
				moon && [
					format_event(c, moon.月の出, time_f),
					format_event(c, moon.南中時刻, time_f),
					format_event(c, moon.月の入, time_f)
				],
				c.span(show_at, current_at, { precise: 'm' }),
				data
			] as const;
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
				<th colspan="2">日</th>
				<th>時</th>
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
		{#each results as [label, [yMd, Hm, Hrmr, ao, ar, Ao, Ar, Eo, Er, Fo, Fr, J, No, Nr, Zo, Zr], 日, 月, span], index}
			<tr>
				<td class="c">
					<input type="radio" name="target" bind:group={selected} value={index} />
				</td>
				<td class="l">{label}</td>
				{#if mode === 1}
					<td class="l"><span>{span}</span></td>
				{:else if mode === 2}
					<td class="l">
						<span>{yMd}</span>
					</td>
					<td class="c">
						<ruby data-ruby={Er}>{Eo}<rt>{Er}</rt></ruby>
					</td>
					<td class="c">
						<ruby data-ruby={Hrmr}>{Hm}<rt>{Hrmr}</rt></ruby>
					</td>
					<td class="c">
						<ruby data-ruby={ar}>{ao}<rt>{ar}</rt></ruby>年
					</td>
					<td class="c">
						<ruby data-ruby={Ar}>{Ao}<rt>{Ar}</rt></ruby>日
					</td>
				{:else if mode === 3}
					<td class="c"><ruby data-ruby={Zr}>{Zo}<rt>{Zr}</rt></ruby></td>
					<td class="c"><ruby data-ruby={Nr}>{No}<rt>{Nr}</rt></ruby></td>
					<td class="l"><ruby>{日[0][0]}<rt>{日[0][1]}</rt></ruby></td>
					<td class="l"><ruby>{日[1][0]}<rt>{日[1][1]}</rt></ruby></td>
					<td class="l"><ruby>{日[2][0]}<rt>{日[2][1]}</rt></ruby></td>
					{#if 月}
						<td class="l"><ruby>{月[0][0]}<rt>{月[0][1]}</rt></ruby></td>
						<td class="l"><ruby>{月[1][0]}<rt>{月[1][1]}</rt></ruby></td>
						<td class="l"><ruby>{月[2][0]}<rt>{月[2][1]}</rt></ruby></td>
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
