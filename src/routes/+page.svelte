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
		tickDecadely,
		to_msec
	} from '$lib';

	$: scales = [
		[$tickSecondly, $tickMinutely],
		[$tickMinutely, $tickHourly],
		[$tickHourly, $tickDaily],
		[$tickDaily, $tickWeekly],
		[$tickWeekly, $tickMonthly],
		[$tickMonthly, $tickQuarterly],
		[$tickQuarterly, $tickYearly],
		[$tickYearly, $tickDecadely]
	];

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
		<meter min={tickL.last_at} max={tickL.next_at} value={tickS.write_at} />
		<Time at={tickL.last_at} /> から <Time at={tickL.next_at} />
	</p>
{/each}
