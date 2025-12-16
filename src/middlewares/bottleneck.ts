import Bottleneck from 'bottleneck';

// Limit 3 request per second
export const jikanLimiter = new Bottleneck({
	maxConcurrent: 3,
	minTime: 1300,
});
