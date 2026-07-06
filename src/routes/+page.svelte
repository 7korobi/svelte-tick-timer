<script lang="ts">
	import {
		Time,
		tickSecondly,
		tickMinutely,
		tickHourly,
		tickDaily,
		tickWeekly,
		tickMonthly,
		tickQuarterly,
		tickYearly,
		tickDecadely
	} from '$lib';
	// tslib の __exportStar (fancy-date の src/index.ts が export * を使っているため
	// 生成される) は関数呼び出しで再エクスポートするため、Cloudflare Workers の
	// バンドラ(静的な named export 解析に依存)が to_msec を検出できず undefined
	// になる(実測: Node/Vite dev では動くが、Workers 上のみ
	// "Cannot read properties of undefined (reading 'to_msec')" で落ちた)。
	// namespace import なら実行時の実体を丸ごと受け取るため回避できる。
	import * as fancyDate from 'fancy-date';
	const { to_msec } = fancyDate;

	const scales = $derived([
		[tickSecondly.current, tickMinutely.current],
		[tickMinutely.current, tickHourly.current],
		[tickHourly.current, tickDaily.current],
		[tickDaily.current, tickWeekly.current],
		[tickWeekly.current, tickMonthly.current],
		[tickMonthly.current, tickQuarterly.current],
		[tickQuarterly.current, tickYearly.current],
		[tickYearly.current, tickDecadely.current]
	]);

	console.log(to_msec('1d2h3m4s'));
	console.log(to_msec('3h10m'));
	console.log(to_msec('5分間'));
	console.log(to_msec('2分半'));
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#each scales as [tickS, tickL]}
	<p>
		<meter min={tickL.last_at} max={tickL.next_at} value={tickS.write_at}></meter>
		{tickL.label} :
		<Time at={tickL.last_at} /> から <Time at={tickL.next_at} />
	</p>
{/each}
