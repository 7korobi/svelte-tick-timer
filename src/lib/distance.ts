import { readable } from 'svelte/store';
import { __BROWSER__, timeoutOn } from 'svelte-petit-utils';
import { to_msec, DAY, HOUR, MINUTE, MONTH, SECOND, WEEK, YEAR } from './msec.js';
import { Tempo, to_tempo_bare } from './tempo.js';

type LIMIT = number;
type UNITSIZE = number;

type TIMER = readonly [string, string, UNITSIZE];
type DISTANCE = readonly [LIMIT, UNITSIZE, string];

export const INTERVAL_MAX = 0x7fffffff; // 31bits.
const VALID = 0xfffffffffffff; // 52bits.

const format = new Intl.DateTimeFormat('ja-JP', {
	calendar: 'japanese',
	era: 'long',
	weekday: 'short',
	hourCycle: 'h11',
	hour: 'numeric'
});
const distanceDefaultOption = {
	limit: '10年',
	format(at: Date) {
		const [era, , weekday, , dayPeriod] = format.formatToParts(at);
		return at
			.toISOString()
			.replace(/(.{10})T(.{8}).(.{3})Z/, (_match, date, time, msec) => `${date} ${time}`);
	}
};

const TIMERS: readonly TIMER[] = [
	['週', 'w', WEEK],
	['日', 'd', DAY],
	['時', 'h', HOUR],
	['分', 'm', MINUTE],
	['秒', 's', SECOND]
] as const;

const DISTANCE_NAN = [-VALID, YEAR, '？？？'] as const;
const DISTANCE_LONG_AGO = [Infinity, VALID, '？？？'] as const;
const DISTANCES: readonly DISTANCE[] = [
	DISTANCE_NAN,
	[-YEAR, YEAR, '%s年後'],
	[-MONTH, MONTH, '%sヶ月後'],
	[-WEEK, WEEK, '%s週間後'],
	[-DAY, DAY, '%s日後'],
	[-HOUR, HOUR, '%s時間後'],
	[-MINUTE, MINUTE, '%s分後'],
	[-25000, SECOND, '%s秒後'],
	[25000, 25000, '今'],
	[MINUTE, SECOND, '%s秒前'],
	[HOUR, MINUTE, '%s分前'],
	[DAY, HOUR, '%s時間前'],
	[WEEK, DAY, '%s日前'],
	[MONTH, WEEK, '%s週間前'],
	[YEAR, MONTH, '%sヶ月前'],
	[VALID, YEAR, '%s年前'],
	DISTANCE_LONG_AGO
] as const;

export function to_timer(msec: number, unit_mode: 0 | 1 = 1) {
	let timer = '';
	const _limit = TIMERS.length;
	for (let at = 0; at < _limit; ++at) {
		const unit = TIMERS[at][unit_mode];
		const base = TIMERS[at][2];
		const idx = Math.floor(msec / base);
		if (idx) {
			msec = msec % base;
			timer += `${idx}${unit}`;
		}
	}
	return timer;
}

function to_distance(msec: number): DISTANCE {
	if (msec < -VALID || VALID < msec || isNaN(msec - 0)) {
		return DISTANCE_NAN;
	}
	const _limit = DISTANCES.length;
	for (let at = 0; at < _limit; ++at) {
		const o = DISTANCES[at];
		const limit = o[0];
		if (msec < limit) {
			return o;
		}
	}
	return DISTANCE_LONG_AGO;
}

export function tickDistance(
	at: number | string | Date,
	{ limit, format } = distanceDefaultOption
) {
	const timestamp = new Date(at);
	const timelimit = to_msec(limit);
	let bye: undefined | (() => void);

	return readable<Tempo>(undefined, (set) => {
		if (undefined === at) return;

		tick();
		return () => {
			bye && bye();
		};

		function tick() {
			const now = Date.now();
			const since = now - timestamp.getTime();
			const [_limit, unit_size, template] = to_distance(since);
			const tempo = to_tempo_bare(unit_size, 0, since);
			const { now_idx } = tempo;
			const msec = Math.min(tempo.timeout, INTERVAL_MAX);

			if (timelimit < since) {
				bye = undefined;
				tempo.label = format(timestamp);
				set(tempo);
				return;
			}
			if (since < -timelimit) {
				bye = timeoutOn(tick, msec);
				tempo.label = format(timestamp);
				set(tempo);
				return;
			}
			tempo.label = template.replace('%s', String(Math.abs(now_idx)));
			bye = timeoutOn(tick, msec);
			set(tempo);
			return;
		}
	});
}
