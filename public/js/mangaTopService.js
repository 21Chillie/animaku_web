const limitSelect = document.getElementById('limit-select');
const listContainer = document.getElementById('list-container');
const paginationContainer = document.getElementById('pagination-container');
const pageInfo = document.getElementById('page-info');

// Current state
let currentState = {
	page: 1,
	limit: 25,
	totalPages: 1,
	totalRecords: 0,
};

// Initialize
document.addEventListener('DOMContentLoaded', function () {
	// Set initial limit from select
	currentState.limit = parseInt(limitSelect.value);

	// Load initial data
	fetchTitle(currentState.page, currentState.limit);

	// Set up event listeners
	setupEventListeners();
});

function setupEventListeners() {
	// Limit select change
	limitSelect.addEventListener('change', (e) => {
		currentState.limit = parseInt(e.target.value);
		currentState.page = 1; // Reset to first page when limit changes
		fetchTitle(currentState.page, currentState.limit);
	});

	// Pagination click event (event delegation)
	paginationContainer.addEventListener('click', (e) => {
		if (e.target.classList.contains('page-btn')) {
			const page = parseInt(e.target.dataset.page);
			if (page && page !== currentState.page) {
				currentState.page = page;
				fetchTitle(currentState.page, currentState.limit);
			}
		}
	});
}

async function fetchTitle(page, limit) {
	try {
		showLoading();

		await new Promise((resolve) => setTimeout(resolve, 500));
		const res = await fetch(`/api/top/manga?page=${page}&limit=${limit}`);
		const json = await res.json();

		if (json.success) {
			await new Promise((resolve) => setTimeout(resolve, 500));
			renderTitle(json.data);

			// Update pagination info if available
			if (json.pagination) {
				currentState.totalPages = json.pagination.totalPages;
				currentState.totalRecords = json.pagination.totalRecords;
				renderPagination(json.pagination);
			} else {
				// Fallback if no pagination data
				updatePaginationFromData(json.data, page, limit);
			}
		} else {
			throw new Error(json.error || 'Failed to fetch data');
		}
	} catch (err) {
		console.error('Error fetching data:', err);
		showError('Failed to load manga data');
	} finally {
		hideLoading();
	}
}

function renderTitle(list) {
	if (!list || list.length === 0) {
		listContainer.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-lg opacity-70">No manga found</p>
            </div>
        `;
		return;
	}

	const cards = list
		.map((manga) => {
			return `
                <a href="/overview/manga/${manga.mal_id}" class="group">
                    <div class="title-card group flex flex-col rounded-xl overflow-hidden bg-card border border-transparent transition-all duration-300 hover:shadow-lg hover:border-primary h-full">
                        <div class="relative aspect-3/4 overflow-hidden">
                            <img src="${manga.data.images.webp.image_url}"
                                 alt="${manga.title}"
                                 class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />

                            <!-- Rating + Rank -->
                            <div class="absolute top-2 right-2 rounded-md px-2 py-1 text-xs font-semibold bg-float flex items-center gap-1">
                                <i class="ri-star-fill icon-star"></i>
                                <span>${manga.score || 'N/A'}</span>
                            </div>

                            <div class="absolute top-2 left-2 rounded-md px-2 py-1 text-xs font-semibold bg-float flex items-center gap-1">
                                <span>#${manga.rank || 'N/A'}</span>
                            </div>

                            <!-- Status -->
                            <div class="floating-status absolute bottom-2 left-2 rounded-md px-2 py-1 text-xs font-medium bg-float opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                ${manga.status || 'Unknown'}
                            </div>
                        </div>

                        <!-- Title and Episodes -->
                        <div class="title-card-info p-3 flex flex-col justify-between flex-1">
                            <div>
                                <h3 class="text-base font-bold line-clamp-2 min-h-12">
                                    ${manga.title}
                                </h3>
                                <p class="text-sm opacity-80">
                                    ${manga.type || 'Unknown'} – ${
				manga.data.chapters || '?'
			} chapters
                                </p>
                            </div>
                        </div>
                    </div>
                </a>
            `;
		})
		.join('');

	listContainer.innerHTML = cards;
}

function renderPagination(pagination) {
	const { currentPage, totalPages, totalRecords } = pagination;

	currentState.page = currentPage;
	currentState.totalPages = totalPages;
	currentState.totalRecords = totalRecords;

	let paginationHTML = '';

	// Only show page numbers, no previous/next buttons
	const pages = generatePageNumbers(currentPage, totalPages);

	pages.forEach((page) => {
		if (page === '...') {
			paginationHTML += `
                <span class="px-3 py-2 opacity-50">...</span>
            `;
		} else if (page === currentPage) {
			paginationHTML += `
                <button class="page-btn px-3 py-2 rounded border cursor-default" 
                        data-page="${page}" disabled>
                    ${page}
                </button>
            `;
		} else {
			paginationHTML += `
                <button class="page-btn px-3 py-2 rounded border transition-colors" 
                        data-page="${page}">
                    ${page}
                </button>
            `;
		}
	});

	paginationContainer.innerHTML = paginationHTML;
	updatePageInfo(currentPage, totalPages, totalRecords);
}

function generatePageNumbers(currentPage, totalPages) {
	const pages = [];
	const maxVisiblePages = 7;

	if (totalPages <= maxVisiblePages) {
		// Show all pages
		for (let i = 1; i <= totalPages; i++) {
			pages.push(i);
		}
	} else {
		// Always show first page
		pages.push(1);

		// Calculate start and end of middle pages
		let start = Math.max(2, currentPage - 2);
		let end = Math.min(totalPages - 1, currentPage + 2);

		// Adjust if we're at the beginning
		if (currentPage <= 3) {
			end = 5;
		}
		// Adjust if we're at the end
		else if (currentPage >= totalPages - 2) {
			start = totalPages - 4;
		}

		// Add ellipsis after first page if needed
		if (start > 2) {
			pages.push('...');
		}

		// Add middle pages
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		// Add ellipsis before last page if needed
		if (end < totalPages - 1) {
			pages.push('...');
		}

		// Always show last page
		if (totalPages > 1) {
			pages.push(totalPages);
		}
	}

	return pages;
}

function updatePaginationFromData(data, page, limit) {
	// Fallback function if API doesn't return pagination info
	const totalRecords = data.length * 10; // Rough estimate
	const totalPages = Math.ceil(totalRecords / limit);

	const pagination = {
		currentPage: page,
		totalPages: totalPages,
		totalRecords: totalRecords,
	};

	renderPagination(pagination);
}

function updatePageInfo(currentPage, totalPages, totalRecords) {
	if (!totalRecords || isNaN(totalRecords)) {
		pageInfo.innerHTML = `
					<p class="text-base">
						Page ${currentPage} of ${totalPages}
						| Showing ${currentState.limit} items per page
					</p>
        `;
		return;
	}

	const startItem = (currentPage - 1) * currentState.limit + 1;
	const endItem = Math.min(currentPage * currentState.limit, totalRecords);

	pageInfo.innerHTML = `
       	<p class="text-base">
						Page ${currentPage} of ${totalPages}
						| Showing ${startItem}-${endItem} of ${totalRecords} manga
					</p>
    `;
}

function showLoading() {
	listContainer.innerHTML = `
        <div class="col-span-full text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p class="loading-text mt-2 opacity-80">Loading manga...</p>
        </div>
    `;
}

function hideLoading() {
	// Loading state is cleared when renderTitle is called
}

function showError(message) {
	listContainer.innerHTML = `
        <div class="error-message col-span-full text-center py-8">
            <i class="ri-error-warning-line text-2x"></i>
            <p class="mt-2">${message}</p>
        </div>
    `;
}
