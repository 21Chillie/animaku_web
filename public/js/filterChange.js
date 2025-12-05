const searchInput = document.getElementById('search-filter');
const mediaFilter = document.getElementById('media-filter');

// Desktop DOM Selector
const typeFilter = document.querySelector('#type-select');
const statusFilter = document.querySelector('#status-select');
const sortByFilter = document.querySelector('#sort-by-select');
const sortDirectionFilter = document.querySelector('#sort-direction-select');

const btnApplyFilter = document.querySelector('#btn-apply-filter');
const btnResetFilter = document.querySelector('#btn-reset-filter');

// Mobile DOM Selector
const typeFilterMobile = document.querySelector('#type-select-mobile');
const statusFilterMobile = document.querySelector('#status-select-mobile');
const sortByFilterMobile = document.querySelector('#sort-by-select-mobile');
const sortDirectionFilterMobile = document.querySelector('#sort-direction-select-mobile');

const btnApplyFilterMobile = document.querySelector('#btn-apply-filter-mobile');
const btnResetFilterMobile = document.querySelector('#btn-reset-filter-mobile');

const animeTypes = [
	{ value: '', text: 'Select types' },
	{ value: 'tv', text: 'TV' },
	{ value: 'movie', text: 'Movie' },
	{ value: 'ova', text: 'OVA' },
	{ value: 'special', text: 'Special' },
	{ value: 'ona', text: 'ONA' },
	{ value: 'pv', text: 'PV' },
	{ value: 'tv_special', text: 'TV Special' },
];

const animeStatus = [
	{ value: '', text: 'Select status' },
	{ value: 'finished', text: 'Finished Airing' },
	{ value: 'airing', text: 'Currently Airing' },
];

const mangaTypes = [
	{ value: '', text: 'Select types' },
	{ value: 'manga', text: 'Manga' },
	{ value: 'novel', text: 'Novel' },
	{ value: 'lightnovel', text: 'Light Novel' },
	{ value: 'oneshot', text: 'One-shot' },
	{ value: 'doujin', text: 'Doujinshi' },
	{ value: 'manhwa', text: 'Manhwa' },
	{ value: 'manhua', text: 'Manhua' },
];

const mangaStatus = [
	{ value: '', text: 'Select status' },
	{ value: 'finished', text: 'Finished' },
	{ value: 'publishing', text: 'Publishing' },
	{ value: 'hiatus', text: 'On Hiatus' },
	{ value: 'discontinued', text: 'Discontinued' },
];

mediaFilter.addEventListener('change', () => {
	const selectedMediaFilter = mediaFilter.value;
	let typeList = [];
	let statusList = [];

	// Clear all filter option
	typeFilter.innerHTML = '';
	statusFilter.innerHTML = '';
	typeFilterMobile.innerHTML = '';
	statusFilterMobile.innerHTML = '';

	if (selectedMediaFilter === 'anime') {
		typeList = animeTypes;
		statusList = animeStatus;
	} else if (selectedMediaFilter === 'manga') {
		typeList = mangaTypes;
		statusList = mangaStatus;
	}

	// Fill the filter
	typeList.forEach((opt) => {
		const optionDesktop = document.createElement('option');
		optionDesktop.value = opt.value;
		optionDesktop.textContent = opt.text;

		const optionMobile = optionDesktop.cloneNode(true);

		if (opt.value === '') {
			optionDesktop.disabled = true;
			optionDesktop.selected = true;
			optionMobile.disabled = true;
			optionMobile.selected = true;
		}

		typeFilter.appendChild(optionDesktop);
		typeFilterMobile.appendChild(optionMobile);
	});

	// Fill the filter
	statusList.forEach((opt) => {
		const optionDesktop = document.createElement('option');
		optionDesktop.value = opt.value;
		optionDesktop.textContent = opt.text;

		const optionMobile = optionDesktop.cloneNode(true);

		if (opt.value === '') {
			optionDesktop.disabled = true;
			optionDesktop.selected = true;
			optionMobile.disabled = true;
			optionMobile.selected = true;
		}

		statusFilter.appendChild(optionDesktop);
		statusFilterMobile.appendChild(optionMobile);
	});
});

btnResetFilter.addEventListener('click', function (e) {
	e.preventDefault();

	if (typeFilter) {
		typeFilter.selectedIndex = 0;
	}

	if (statusFilter) {
		statusFilter.selectedIndex = 0;
	}

	if (sortByFilter) {
		sortByFilter.value = 'score';
	}

	if (sortDirectionFilter) {
		sortDirectionFilter.value = 'desc';
	}

	if (mediaFilter) {
		mediaFilter.value = 'anime';
	}

	if (typeFilter) typeFilter.dispatchEvent(new Event('change'));
	if (typeFilter) typeFilter.dispatchEvent(new Event('change'));
	if (statusFilter) statusFilter.dispatchEvent(new Event('change'));
	if (sortByFilter) sortByFilter.dispatchEvent(new Event('change'));
	if (sortDirectionFilter) sortDirectionFilter.dispatchEvent(new Event('change'));
});

btnResetFilterMobile.addEventListener('click', (e) => {
	e.preventDefault();

	if (typeFilterMobile) {
		typeFilterMobile.selectedIndex = 0;
	}

	if (statusFilterMobile) {
		statusFilterMobile.selectedIndex = 0;
	}

	if (sortByFilterMobile) {
		sortByFilterMobile.value = 'score';
	}

	if (sortDirectionFilterMobile) {
		sortDirectionFilterMobile.value = 'desc';
	}

	if (mediaFilter) {
		mediaFilter.value = 'anime';
	}

	if (typeFilter) typeFilter.dispatchEvent(new Event('change'));
	if (typeFilterMobile) typeFilterMobile.dispatchEvent(new Event('change'));
	if (statusFilterMobile) statusFilterMobile.dispatchEvent(new Event('change'));
	if (sortByFilterMobile) sortByFilterMobile.dispatchEvent(new Event('change'));
	if (sortDirectionFilterMobile) sortDirectionFilterMobile.dispatchEvent(new Event('change'));
});
