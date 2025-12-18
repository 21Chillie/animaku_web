const searchInput = document.getElementById('search-filter');
const mediaFilter = document.getElementById('media-filter');

// Desktop DOM Selector
const typeFilter = document.querySelector('#type-select');
const statusFilter = document.querySelector('#status-select');
const sortByFilter = document.querySelector('#sort-by-select');
const sortDirectionFilter = document.querySelector('#sort-direction-select');

const btnApplyFilter = document.querySelector('#btn-apply-filter');
const btnResetFilter = document.querySelector('#btn-reset-filter');

const listContainer = document.getElementById('list-container');

let timeoutId;
let searchValue;

searchInput.addEventListener('input', (e) => {
	searchValue = e.target.value.trim().toLowerCase();

	// Clear the previous timeout
	clearTimeout(timeoutId);

	// Set a new timeout
	timeoutId = setTimeout(() => {
		fetchTitle();
	}, 1000);
});

searchInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		searchValue = e.target.value.trim().toLowerCase();
		fetchTitle();
		e.preventDefault();
	}
});

btnApplyFilter.addEventListener('click', () => {
	fetchTitle();
});

btnResetFilter.addEventListener('click', () => {
	fetchTitle();
});

mediaFilter.addEventListener('change', () => {
	fetchTitle();
});

function buildSearchParams() {
	const params = new URLSearchParams();

	// List parameters
	const searchParams = searchValue;
	const typeParams = typeFilter ? typeFilter.value : '';
	const statusParams = statusFilter ? statusFilter.value : '';
	const sortByParams = sortByFilter ? sortByFilter.value : 'rank';
	const sortDirectionParams = sortDirectionFilter ? sortDirectionFilter.value : 'asc';
	const page = 1;
	const limit = 30;

	if (searchParams) {
		params.append('search', searchParams);
	}

	if (typeParams) {
		params.append('type', typeParams);
	}

	if (statusParams) {
		params.append('status', statusParams);
	}

	if (sortByParams) {
		params.append('order_by', sortByParams);
	}

	if (sortDirectionParams) {
		params.append('order_direction', sortDirectionParams);
	}

	if (page) {
		params.append('page', `${page}`);
	}

	if (limit) {
		params.append('limit', `${limit}`);
	}

	return params;
}

async function fetchTitle() {
	showLoading();

	await new Promise((resolve) => setTimeout(resolve, 500));

	const params = buildSearchParams();
	const mediaType = mediaFilter.value;
	const url = `/api/${mediaType}?${params}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const result = await response.json();
		renderTitle(result, mediaType);
	} catch (error) {
		console.error(error.message);
	} finally {
		hideLoading();
	}
}

function renderTitle(result, mediaType) {
	const totalRecords = result.pagination.totalRecords;

	if (!result || result.length === 0) {
		listContainer.innerHTML = `
    	<header class="header-list-title col-span-2 md:col-span-4 lg:col-span-6">
					<p class="text-result text-base">Found 30 results</p>
				</header>
    `;

		return;
	}

	const header = `
  <header class="header-list-title col-span-2 md:col-span-4 lg:col-span-6">
					<p class="text-result text-base">Found ${result.data.length} results</p>
				</header>
  `;

	const cards = result.data
		.map((title) => {
			return `
        <a href="/overview/${mediaType}/${title.data.mal_id}">
					<div
							class="title-card group flex flex-col rounded-xl overflow-hidden bg-card border border-transparent transition-all duration-300 hover:shadow-lg hover:border-primary h-full">
						<!-- Image container -->
						<div class="relative aspect-3/4 overflow-hidden">
							<img src="${title.data.images.webp?.image_url || title.data.data.images.jpg?.image_url}"
									alt="${title.data.title}"
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />

						<div
								class="absolute top-2 right-2 rounded-md px-2 py-1 text-xs font-semibold bg-float flex items-center gap-1">
							<i class="ri-star-fill icon-star"></i>
							<span>${title.data.score || 'N/A'}</span>
						</div>

						<div
								class="absolute top-2 left-2 rounded-md px-2 py-1 text-xs font-semibold bg-float flex items-center gap-1">
							<i class="ri-heart-fill icon-love"></i>
							<span>#${title.data.popularity || 'N/A'}</span>
						</div>

							<div
									class="floating-status absolute bottom-2 left-2 rounded-md px-2 py-1 text-xs font-medium bg-float opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
								${title.data.status}
							</div>
						</div>

						<div class="title-card-info p-3 flex flex-col justify-between flex-1">
							<div>
								<h3 class="text-base font-bold line-clamp-2 min-h-12">
                ${title.data.title}
                </h3>
								<p class="text-sm opacity-80">
									${title.data.type} - 
                ${
									(title.data.episodes ?? title.data.chapters ?? 'N/A') +
									(title.data.episodes != null
										? ' Episodes'
										: title.data.chapters != null
										? ' Chapters'
										: '')
								}

								</p>
							</div>
						</div>
					</div>
				</a>
    `;
		})
		.join('');

	listContainer.innerHTML = header + cards;
}

function showLoading() {
	listContainer.innerHTML = `
        <div class="col-span-full text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p class="loading-text mt-2 opacity-80">Loading anime...</p>
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
