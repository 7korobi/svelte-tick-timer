import {
	endOfDecade,
	endOfMonth,
	endOfQuarter,
	endOfYear,
	startOfDecade,
	startOfMonth,
	startOfQuarter,
	startOfYear
} from 'date-fns';
import { tickTempo, tickTempoBy } from './tempo.js';

export const tickSecondly = tickTempo('1秒');
export const tickMinutely = tickTempo('1分');
export const tickHourly = tickTempo('1時間');
export const tickDaily = tickTempo('1日');
export const tickWeekly = tickTempo('1週');

export const tickMonthly = tickTempoBy([
	(now) => startOfMonth(now).getTime(),
	(now) => endOfMonth(now).getTime() + 1
]);

export const tickQuarterly = tickTempoBy([
	(now) => startOfQuarter(now).getTime(),
	(now) => endOfQuarter(now).getTime() + 1
]);

export const tickYearly = tickTempoBy([
	(now) => startOfYear(now).getTime(),
	(now) => endOfYear(now).getTime() + 1
]);

export const tickDecadely = tickTempoBy([
	(now) => startOfDecade(now).getTime(),
	(now) => endOfDecade(now).getTime() + 1
]);
