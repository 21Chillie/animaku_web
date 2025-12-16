const mediaFetchTask = new Map<number, Promise<any>>();

// Prevent multiple request with same id, other request will wait until the first fetch to finish
export async function mediaLocks<T>(mal_id: number, fn: () => Promise<T>): Promise<T> {
	// Check if there is already running fetch task with the mal id, then wait until it finish
	const existingTask = mediaFetchTask.get(mal_id);
	if (existingTask) {
		return existingTask;
	}

	// Remove the lock if the task is finish
	const task = (async () => {
		try {
			return await fn();
		} finally {
			// Always release the lock, even if fn throws
			mediaFetchTask.delete(mal_id);
		}
	})();

	mediaFetchTask.set(mal_id, task);
	return task;
}

let mediaBatchTask: Promise<void> | null = null;

export async function batchMediaLocks(fn: () => Promise<void>) {
	if (mediaBatchTask) {
		// Another request is already fetching → wait
		return mediaBatchTask;
	}

	mediaBatchTask = (async () => {
		try {
			await fn();
		} finally {
			// Always release lock
			mediaBatchTask = null;
		}
	})();

	return mediaBatchTask;
}
