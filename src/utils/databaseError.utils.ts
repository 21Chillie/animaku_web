export class DatabaseError extends Error {
	cause?: unknown;
	constructor(message: string, opts?: { cause?: unknown }) {
		super(message);
		this.name = 'DatabaseError';
		this.cause = opts?.cause;
		// Maintain proper prototype chain (for older TS targets)
		Object.setPrototypeOf(this, DatabaseError.prototype);
	}
}
