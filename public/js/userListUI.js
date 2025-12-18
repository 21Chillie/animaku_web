// Mobile Element DOM Selector
export const typeSelectMobile = document.getElementById('type-select-mobile');
export const statusSelectMobile = document.getElementById('status-select-mobile');
export const sortByMobile = document.getElementById('sort-by-select-mobile');
export const sortDirectionMobile = document.getElementById('sort-direction-select-mobile');
export const btnApplyFilterMobile = document.getElementById('btn-apply-filter-mobile');
export const btnResetFilterMobile = document.getElementById('btn-reset-filter-mobile');

// Desktop Element DOM Selector
export const typeSelect = document.getElementById('type-select');
export const statusSelect = document.getElementById('status-select');
export const sortBySelect = document.getElementById('sort-by-select');
export const sortDirectionSelect = document.getElementById('sort-direction-select');
export const btnApplyFilter = document.getElementById('btn-apply-filter');
export const btnResetFilter = document.getElementById('btn-reset-filter');

const allStatus = [
	{ value: 'watching', text: 'Watching' },
	{ value: 'plan_watch', text: 'Plan to Watch' },
	{ value: 'reading', text: 'Reading' },
	{ value: 'plan_read', text: 'Plan to read' },
	{ value: 'completed', text: 'Completed' },
	{ value: 'paused', text: 'Paused' },
	{ value: 'dropped', text: 'Dropped' },
];

const animeStatus = [
	{ value: 'watching', text: 'Watching' },
	{ value: 'plan_watch', text: 'Plan to Watch' },
	{ value: 'completed', text: 'Completed' },
	{ value: 'paused', text: 'Paused' },
	{ value: 'dropped', text: 'Dropped' },
];

const mangaStatus = [
	{ value: 'reading', text: 'Reading' },
	{ value: 'plan_read', text: 'Plan to read' },
	{ value: 'completed', text: 'Completed' },
	{ value: 'paused', text: 'Paused' },
	{ value: 'dropped', text: 'Dropped' },
];

function changeFilterByMediaType() {
	const mediaType = typeSelect.value || typeSelectMobile.value;
	let statusList = allStatus;

	if (mediaType === 'anime') {
		statusList = animeStatus;
	} else if (mediaType === 'manga') {
		statusList = mangaStatus;
	}

	statusSelect.innerHTML = '';
	statusSelectMobile.innerHTML = '';

	// Optional default option
	const defaultOption = {
		value: '',
		text: 'Select status',
	};

	[statusSelect, statusSelectMobile].forEach((select) => {
		const opt = document.createElement('option');
		opt.value = defaultOption.value;
		opt.textContent = defaultOption.text;
		opt.disabled = true;
		opt.selected = true;
		select.appendChild(opt);
	});

	// Populate options
	statusList.forEach(({ value, text }) => {
		const desktopOption = document.createElement('option');
		desktopOption.value = value;
		desktopOption.textContent = text;

		const mobileOption = desktopOption.cloneNode(true);

		statusSelect.appendChild(desktopOption);
		statusSelectMobile.appendChild(mobileOption);
	});
}

typeSelect.addEventListener('change', changeFilterByMediaType);
typeSelectMobile.addEventListener('change', changeFilterByMediaType);

function resetFilter() {
	if (typeSelect && typeSelectMobile) {
		typeSelect.value = '';
		typeSelectMobile.value = '';
	}

	if (statusSelect && statusSelectMobile) {
		statusSelect.selectedIndex = 0;
		statusSelectMobile.selectedIndex = 0;
	}

	if (sortBySelect && sortByMobile) {
		sortByMobile.value = 'title';
		sortBySelect.value = 'title';
	}

	if (sortDirectionMobile && sortDirectionSelect) {
		sortDirectionMobile.value = 'asc';
		sortDirectionSelect.value = 'asc';
	}

	if (typeSelect) typeSelect.dispatchEvent(new Event('change'));
	if (typeSelectMobile) typeSelectMobile.dispatchEvent(new Event('change'));
	if (statusSelect) statusSelect.dispatchEvent(new Event('change'));
	if (statusSelectMobile) statusSelectMobile.dispatchEvent(new Event('change'));
	if (sortBySelect) sortBySelect.dispatchEvent(new Event('change'));
	if (sortByMobile) sortByMobile.dispatchEvent(new Event('change'));
	if (sortDirectionSelect) sortDirectionSelect.dispatchEvent(new Event('change'));
	if (sortDirectionMobile) sortDirectionMobile.dispatchEvent(new Event('change'));
}

btnResetFilter.addEventListener('click', (e) => {
	e.preventDefault();

	resetFilter();
});

btnResetFilterMobile.addEventListener('click', (e) => {
	e.preventDefault();

	resetFilter();
});
