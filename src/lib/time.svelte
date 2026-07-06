<script lang="ts">
	// tslib の __exportStar 経由の再エクスポートは Cloudflare Workers の
	// バンドラが named export として静的検出できず undefined になるため、
	// namespace import で実行時の実体を丸ごと受け取る(tick.svelte.ts と同じ理由)。
	import * as fancyDate from 'fancy-date';
	import type { SpanOptions } from 'fancy-date';
	import { TickDistance } from './distance.svelte.js';

	const { Calendar } = fancyDate;
	const { LocalGregorian } = Calendar;

	let {
		at = Date.now(),
		precise,
		format = 'yyyy-MM-dd(E) HH:mm'
	}: {
		at?: number | Date;
		precise?: SpanOptions['precise'];
		format?: string;
	} = $props();

	let timer = $state<TickDistance>();
	$effect(() => {
		const instance = new TickDistance(at, { precise });
		timer = instance;
		return () => instance.destroy();
	});
	const iso = $derived(new Date(at).toISOString());
	const title = $derived(LocalGregorian.format(Number(at), format));
</script>

<time dateTime={iso} {title}>
	{timer?.current.label}
</time>
