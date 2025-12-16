import Bottleneck from 'bottleneck';

export const jikanLimiter = new Bottleneck({
	maxConcurrent: 3,
	minTime: 1500,
});
