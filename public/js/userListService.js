import {
	btnApplyFilter,
	sortBySelect,
	sortByMobile,
	sortDirectionSelect,
	sortDirectionMobile,
	statusSelect,
	statusSelectMobile,
	typeSelect,
	typeSelectMobile,
	btnResetFilter,
	btnApplyFilterMobile,
	btnResetFilterMobile,
} from './userListUI.js';

// * DOM REFERENCES
const limitSelect = document.getElementById('limit-select');
const tableBody = document.getElementById('table-body');
const totalRecordsInfo = document.getElementById('total-records-info');

const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const currentPageInput = document.getElementById('input-current-page');
const maxPageInput = document.getElementById('input-max-page');

// * PAGINATION STATE
let currentDataPage = 1;
let dataMaxPages = 1;

// * QUERY PARAM BUILDER
function buildFilterParams() {
	const params = new URLSearchParams();
	const mediaType = typeSelect?.value || typeSelectMobile?.value || '';
	const status = statusSelect?.value || statusSelectMobile?.value || '';
	const orderBy = sortBySelect?.value || sortByMobile?.value || 'title';
	const orderDirection = sortDirectionSelect?.value || sortDirectionMobile?.value || 'asc';
	const limitValue = limitSelect?.value || 50;

	params.append('page', currentDataPage);
	params.append('limit', limitValue);
	params.append('order_by', orderBy);
	params.append('order_direction', orderDirection);

	if (mediaType) params.append('type', mediaType);
	if (status) params.append('status', status);

	return params;
}

// * FETCH DATA
async function fetchUserList() {
	showLoading();

	await new Promise((resolve) => setTimeout(resolve, 500));

	try {
		const params = buildFilterParams();
		const response = await fetch(`/api/user/list?${params}`);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		const result = await response.json();

		// Pagination state
		currentDataPage = result.pagination.currentPage;
		dataMaxPages = result.pagination.totalPages;

		renderHeader(result);
		renderTable(result);
		updatePaginationUI();
	} catch (error) {
		console.error(error);
		tableBody.innerHTML = `
			<tr>
				<td colspan="7" class="text-center py-6 text-red-500">
					Failed to load data
				</td>
			</tr>
		`;
	}
}

// * HEADER RENDER
function renderHeader(result) {
	totalRecordsInfo.textContent = `${result.pagination.totalRecords} records`;
}

// * TABLE RENDER
function renderTable(result) {
	const STATUS_LABELS = {
		watching: 'Watching',
		plan_watch: 'Plan to watch',
		reading: 'Reading',
		plan_read: 'Plan to read',
		completed: 'Completed',
		paused: 'Paused',
		dropped: 'Dropped',
	};

	tableBody.innerHTML = result.list
		.map((media) => {
			const {
				media_mal_id,
				title,
				status,
				score,
				progress_episodes,
				progress_chapters,
				progress_volumes,
				start_date,
				finish_date,
				episodes,
				chapters,
				volumes,
				media_type,
				image_url,
				sub_type,
				notes,
			} = media;

			const statusLabel = STATUS_LABELS[status] ?? status;

			return `
<tr
   data-mal-id="${media_mal_id}"
	 data-title="${title}"
   data-type="${media_type}"
	 data-episodes="${episodes || ''}"
	 data-chapters="${chapters || ''}"
	 data-volumes="${volumes || ''}"
	 data-episode-progress="${progress_episodes || ''}"
	 data-chapter-progress="${progress_chapters || ''}"
	 data-volume-progress="${progress_volumes || ''}"
	 data-score="${score || ''}"
   data-status="${status}"
   data-start-date="${start_date ? start_date.split('T')[0] : ''}"
   data-finish-date="${finish_date ? finish_date.split('T')[0] : ''}"
	 data-notes="${notes || ''}"
   >
   <th>
      <button class="btn-edit-list px-2 py-1 rounded-md">
      <i class="ri-pencil-line"></i>
      </button>
   </th>
   <td>
      <div class="flex items-center gap-3">
         <div class="media-poster">
            <div class="w-16 aspect-2/3">
               <img class="object-cover rounded-md"
                  src="${image_url}"
                  alt="${title} poster" />
            </div>
         </div>
         <div class="max-sm:w-32">
            <a class="title-link hover:underline font-bold" href="#">${title}</a>
         </div>
      </div>
   </td>
   <td>${sub_type}</td>
   <td>
      <div class="flex items-center gap-1">
         <i class="ri-star-fill"></i>
         <span>${score || 0}</span>		
      </div>
   </td>
   <td>
      <div class="flex flex-col gap-1">
         <p>${progress_episodes || progress_chapters}/${episodes || chapters} ${
				media_type === 'anime' ? 'eps' : 'ch'
			}</p>
         <progress class="progress max-w-28 rounded-full" value="${
						progress_episodes || progress_chapters || 0
					}" max="${episodes || chapters || 0}"></progress>
      </div>
   </td>
   <td><span class="${status}">${statusLabel}</span></td>
</tr>
`;
		})
		.join('');
}

// * PAGINATION UI
function updatePaginationUI() {
	currentPageInput.value = currentDataPage;
	maxPageInput.value = dataMaxPages;

	btnPrev.classList.toggle('hide-button-pagination', currentDataPage <= 1);

	btnNext.classList.toggle('hide-button-pagination', currentDataPage >= dataMaxPages);
}

// * LOADING STATE
function showLoading() {
	tableBody.innerHTML = `
		<tr>
			<td colspan="7" class="text-center py-8">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2"></div>
				<p class="mt-2 opacity-80">Loading...</p>
			</td>
		</tr>
	`;
}

// * EVENTS
btnNext.addEventListener('click', () => {
	if (currentDataPage < dataMaxPages) {
		currentDataPage++;
		fetchUserList();
	}
});

btnPrev.addEventListener('click', () => {
	if (currentDataPage > 1) {
		currentDataPage--;
		fetchUserList();
	}
});

limitSelect?.addEventListener('change', () => {
	currentDataPage = 1;
	fetchUserList();
});

btnApplyFilter?.addEventListener('click', () => {
	currentDataPage = 1;
	fetchUserList();
});

btnApplyFilterMobile?.addEventListener('click', () => {
	currentDataPage = 1;
	fetchUserList();
});

btnResetFilter?.addEventListener('click', () => {
	currentDataPage = 1;
	fetchUserList();
});

btnResetFilterMobile?.addEventListener('click', () => {
	currentDataPage = 1;
	fetchUserList();
});

typeSelectMobile?.addEventListener('change', () => {
	currentDataPage = 1;
	fetchUserList();
});

// * INITIAL LOAD
document.addEventListener('DOMContentLoaded', fetchUserList);
