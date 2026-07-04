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
	import { to_msec } from 'fancy-date';

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
