const mediaFilter = document.getElementById('media-filter');
const typeFilter = document.getElementById('type-filter');
const statusFilter = document.getElementById('status-filter');
const sortByFilter = document.getElementById('sort-by-filter');
const sortDirectionFilter = document.getElementById('sort-direction-filter');
const resetButton = document.getElementById('btn-reset-filter');

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

	if (selectedMediaFilter === 'anime') {
		typeFilter.innerHTML = '';
		typeList = animeTypes;
		statusFilter.innerHTML = '';
		statusList = animeStatus;
	} else if (selectedMediaFilter === 'manga') {
		typeFilter.innerHTML = '';
		typeList = mangaTypes;
		statusFilter.innerHTML = '';
		statusList = mangaStatus;
	}

	typeList.forEach((opt) => {
		const option = document.createElement('option');
		option.value = opt.value;
		option.textContent = opt.text;

		if (opt.value === '') {
			option.disabled = true;
			option.selected = true;
		}

		typeFilter.appendChild(option);
	});

	statusList.forEach((opt) => {
		const option = document.createElement('option');
		option.value = opt.value;
		option.textContent = opt.text;

		if (opt.value === '') {
			option.disabled = true;
			option.selected = true;
		}

		statusFilter.appendChild(option);
	});
});

resetButton.addEventListener('click', function (e) {
	e.preventDefault();

	if (typeFilter) {
		typeFilter.selectedIndex = 0;
	}

	if (statusFilter) {
		statusFilter.selectedIndex = 0;
	}

	if (sortByFilter) {
		sortByFilter.value = 'rank';
	}

	if (sortDirectionFilter) {
		sortDirectionFilter.value = 'ASC';
	}

	if (typeFilter) typeFilter.dispatchEvent(new Event('change'));
	if (statusFilter) statusFilter.dispatchEvent(new Event('change'));
	if (sortByFilter) sortByFilter.dispatchEvent(new Event('change'));
	if (sortDirectionFilter) sortDirectionFilter.dispatchEvent(new Event('change'));
});
