<script lang="ts">
	import { Calendar, type SpanOptions } from 'fancy-date';
	import { TickDistance } from './distance.svelte.js';

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

<time dateTime={iso} title={title}>
	{timer?.current.label}
</time>
