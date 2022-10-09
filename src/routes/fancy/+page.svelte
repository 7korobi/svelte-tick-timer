<script lang="ts">
	import type { FancyDate } from '$lib/fancy/date';

	import { Calendar } from '$lib/fancy/sample';
	import { Tempo } from '$lib/tempo';

	const calendars: [string, FancyDate, string][] = [
		[
			'グレゴリオ暦',
			Calendar.Gregorian,
			'Gyyyy/MM/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		],
		[
			'太陽太陰暦（地球、月）',
			Calendar.平気法,
			'Gyy年Modd日 Homo Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		],
		[
			'フランス革命歴',
			Calendar.フランス革命暦,
			'Gyyy年Modd日 HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		],
		[
			'ロムルス歴',
			Calendar.Romulus,
			'Gyyyy/MM/dd HH:mm Hrmr ao ar Ao Ar Eo Er Fo Fr J No Nr Zo Zr'
		],
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

	let since = 0;
	let current_at = Date.now();

	$: show_at = current_at + since;
	$: minutes = calendars.map(([, c]) => c.to_tempos(show_at).m);
	$: results = calendars.map((data) => {
		const [label, c, date_f] = data;
		const [, time_fo, time_fr] = date_f.split(/\s/);
		const time_f = `${time_fo} ${time_fr}`;
		const { 日の出, 南中時刻, 日の入 } = c.solor(show_at);
		return [
			label,
			c.format(show_at, date_f).split(/\s/),
			c.format(日の出, time_f).split(/\s/),
			c.format(南中時刻, time_f).split(/\s/),
			c.format(日の入, time_f).split(/\s/),
			c.precision(),
			data
		] as const;
	});

	tick();

	async function tick() {
		await Tempo.sleep(minutes);
		if (current_at) current_at = Date.now();
		tick();
	}

	function back(c: FancyDate, diff: string) {
		since += c.back_msec(show_at, diff);
		console.warn({ c, diff });
	}

	function succ(c: FancyDate, diff: string) {
		since += c.succ_msec(show_at, diff);
		console.warn({ c, diff });
	}

	function reset() {
		since = 0;
	}
</script>

<p>差分 {since} msec</p>
<table>
	{#each results as [label, [yMd, Hm, Hrmr, ao, ar, Ao, Ar, Eo, Er, Fo, Fr, J, No, Nr, Zo, Zr], 日出, 南中, 日入, { year, day, leap }, data]}
		<tbody>
			<tr>
				<th class="c" colspan="7">{label}</th>
			</tr>
			<tr>
				<th class="r note" colspan="4">日付</th>
				<th class="c note">曜</th>
				<th class="l note">時刻</th>
				<th class="c" rowspan="7">
					<div class="form"><button on:click={() => reset()}>reset</button></div>
					<div class="form">
						<button on:click={() => back(data[1], '1年')}>−</button>
						年
						<button on:click={() => succ(data[1], '1年')}>＋</button>
					</div>
					<div class="form">
						<button on:click={() => back(data[1], '1月')}>−</button>
						月
						<button on:click={() => succ(data[1], '1月')}>＋</button>
					</div>
					<div class="form">
						<button on:click={() => back(data[1], '1週')}>−</button>
						週
						<button on:click={() => succ(data[1], '1週')}>＋</button>
					</div>
					<div class="form">
						<button on:click={() => back(data[1], '1日')}>−</button>
						日
						<button on:click={() => succ(data[1], '1日')}>＋</button>
					</div>
					<div class="form">
						<button on:click={() => back(data[1], '1時')}>−</button>
						時
						<button on:click={() => succ(data[1], '1時')}>＋</button>
					</div>
					<div class="form">
						<button on:click={() => back(data[1], '1分')}>−</button>
						分
						<button on:click={() => succ(data[1], '1分')}>＋</button>
					</div>
					<div class="form">
						<button on:click={() => back(data[1], '1秒')}>−</button>
						秒
						<button on:click={() => succ(data[1], '1秒')}>＋</button>
					</div>
				</th>
			</tr>
			<tr>
				<td class="r" colspan="4">{yMd}</td>
				<td class="c"><ruby data-ruby={Er}>{Eo}<rt>{Er}</rt></ruby></td>
				<td class="l"><ruby data-ruby={Hrmr}>{Hm}<rt>{Hrmr}</rt></ruby></td>
			</tr>
			<tr>
				<th class="c note" colspan="6" />
			</tr>
			<tr>
				<td />
				<th class="r note" colspan="1">月相</th>
				<td class="l"><ruby data-ruby={Nr}>{No}<rt>{Nr}</rt></ruby></td>
				<th class="r note" colspan="2">日出</th>
				<td class="l"><ruby data-ruby={日出[1]}>{日出[0]}<rt>{日出[1]}</rt></ruby></td>
			</tr>
			<tr>
				<td />
				<th class="r note" colspan="1">節気</th>
				<td class="l"><ruby data-ruby={Zr}>{Zo}<rt>{Zr}</rt></ruby></td>
				<th class="r note" colspan="2">南中</th>
				<td class="l"><ruby data-ruby={南中[1]}>{南中[0]}<rt>{南中[1]}</rt></ruby></td>
			</tr>
			<tr>
				<td />
				<th class="r note" colspan="1">九星</th>
				<td class="l"><ruby data-ruby={Fr}>{Fo}<rt>{Fr}</rt></ruby></td>
				<th class="r note" colspan="2">日入</th>
				<td class="l"><ruby data-ruby={日入[1]}>{日入[0]}<rt>{日入[1]}</rt></ruby></td>
			</tr>
			<tr>
				<td />
				<th class="r note" colspan="1">干支</th>
				<td class="l" colspan="3">
					<ruby data-ruby={ar}>{ao}<rt>{ar}</rt>年</ruby>&nbsp;<ruby data-ruby={Ar}
						>{Ao}<rt>{Ar}</rt>日</ruby
					>
				</td>
			</tr>
			<tr>
				<td class="r form" colspan="7"><input class="w9" bind:value={data[2]} /></td>
			</tr>
			<tr>
				<td class="r" colspan="7">時間:分:秒</td>
			</tr>
			<tr>
				<td class="r" colspan="7">{day.join(':')}</td>
			</tr>
		</tbody>
	{/each}
</table>
<table class="text">
	<thead>
		<tr>
			<th>書式</th>
		</tr>
	</thead>
	<tbody>
		{#each calendars as data}
			<tr>
				<td><input class="w9" bind:value={data[2]} /></td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.form {
		white-space: nowrap;
	}
	td.l {
		text-align: left;
	}
	td.r {
		text-align: right;
	}
	td.c {
		text-align: center;
	}
</style>
