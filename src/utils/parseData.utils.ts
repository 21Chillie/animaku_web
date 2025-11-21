export interface ParsedTheme {
	number: number;
	title: string;
	singer: string;
	episodes: string;
}

export function parseSynopsis(synopsis: string | null): string {
	if (!synopsis) return '';

	return synopsis
		.replace(/\\"/g, '"') // Unescape quotes
		.replace(/\n\n/g, '</p><p class="written-by text-sm mb-4">') // Paragraphs for EJS
		.replace(/\n/g, '<br>'); // Single line breaks
}

export function parseThemeString(themeString: string): ParsedTheme {
	// Common formats:
	// "1: \"Song Title\" by Artist Name (eps 1-14)"
	// "1: \"Song Title\" by Artist Name"
	// "Song Title by Artist Name (eps 1-14)"

	const patterns = [
		// Format: "1: "Song" by Artist (eps 1-14)"
		/(\d+):\s*"([^"]+)"\s*by\s*([^(]+)(?:\s*\(eps?\s*([^)]+)\))?/,

		// Format: "Song" by Artist (eps 1-14)
		/"([^"]+)"\s*by\s*([^(]+)(?:\s*\(eps?\s*([^)]+)\))?/,

		// Format: Song by Artist (eps 1-14)
		/([^"]+)\s*by\s*([^(]+)(?:\s*\(eps?\s*([^)]+)\))?/,
	];

	for (const pattern of patterns) {
		const match = themeString.match(pattern);
		if (match) {
			// Pattern 1 has number, pattern 2 & 3 don't
			const hasNumber = pattern.source.includes('(\\d+)');

			return {
				number: hasNumber ? parseInt(match[1]) : 0,
				title: hasNumber ? match[2] : match[1],
				singer: hasNumber ? match[3].trim() : match[2].trim(),
				episodes: (hasNumber ? match[4] : match[3]) || 'N/A',
			};
		}
	}

	// Fallback - return the whole string as title
	return {
		number: 0,
		title: themeString,
		singer: 'N/A',
		episodes: 'N/A',
	};
}
