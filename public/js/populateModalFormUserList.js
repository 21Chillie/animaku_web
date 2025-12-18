const modalFormList = document.getElementById('modalFormList');
const deleteListConfirm = document.getElementById('deleteListConfirm');

const formList = document.getElementById('formList');

// Inputs
const inputTitle = document.getElementById('inputTitle');
const inputMalId = document.getElementById('inputMalId');
const inputType = document.getElementById('inputType');
const selectStatus = document.getElementById('selectStatus');
const inputScore = formList.querySelector('[name="inputScore"]');
const inputEpisode = formList.querySelector('[name="inputEpisode"]');
const inputChapter = formList.querySelector('[name="inputChapter"]');
const inputVolume = formList.querySelector('[name="inputVolume"]');
const inputStartDate = formList.querySelector('[name="inputStartDate"]');
const inputFinishDate = formList.querySelector('[name="inputFinishDate"]');
const inputNotes = formList.querySelector('[name="inputNotes"]');

// Fieldsets (for show / hide)
const episodeFieldset = inputEpisode.closest('fieldset');
const chapterFieldset = inputChapter.closest('fieldset');
const volumeFieldset = inputVolume.closest('fieldset');

// Delete modal hidden inputs
const deleteMalIdInput = deleteListConfirm.querySelector('[name="deleteListMalId"]');
const deleteTypeInput = deleteListConfirm.querySelector('[name="deleteListMediaType"]');

// Edit button handler
document.addEventListener('click', (e) => {
	const btn = e.target.closest('.btn-edit-list');
	if (!btn) return;

	const row = btn.closest('tr');
	const data = row.dataset;

	// Populate common fields

	inputTitle.value = data.title || '';
	inputMalId.value = data.malId || '';
	inputType.value = data.type || '';
	selectStatus.value = data.status || '';
	inputScore.value = data.score || '';
	inputStartDate.value = data.startDate;
	inputFinishDate.value = data.finishDate;
	inputNotes.value = data.notes || '';

	// Type-based logic
	if (data.type === 'anime') {
		episodeFieldset.classList.remove('hidden-form');
		chapterFieldset.classList.add('hidden-form');
		volumeFieldset.classList.add('hidden-form');

		inputEpisode.value = data.episodeProgress || '';
		inputEpisode.max = data.episodes || '';

		const animeStatus = [
			{ value: 'watching', text: 'Watching' },
			{ value: 'plan_watch', text: 'Plan to Watch' },
			{ value: 'completed', text: 'Completed' },
			{ value: 'paused', text: 'Paused' },
			{ value: 'dropped', text: 'Dropped' },
		];

		selectStatus.innerHTML = '';

		animeStatus.forEach(({ value, text }) => {
			const selectOption = document.createElement('option');
			selectOption.value = value;
			selectOption.textContent = text;
			selectStatus.appendChild(selectOption);
		});

		selectStatus.value = data.status || '';
	}

	if (data.type === 'manga') {
		episodeFieldset.classList.add('hidden-form');
		chapterFieldset.classList.remove('hidden-form');
		volumeFieldset.classList.remove('hidden-form');

		inputChapter.value = data.chapterProgress || '';
		inputChapter.max = data.chapters || '';
		inputVolume.value = data.volumeProgress || '';
		inputVolume.max = data.volumes || '';

		const mangaStatus = [
			{ value: 'reading', text: 'Reading' },
			{ value: 'plan_read', text: 'Plan to read' },
			{ value: 'completed', text: 'Completed' },
			{ value: 'paused', text: 'Paused' },
			{ value: 'dropped', text: 'Dropped' },
		];

		selectStatus.innerHTML = '';

		mangaStatus.forEach(({ value, text }) => {
			const selectOption = document.createElement('option');
			selectOption.value = value;
			selectOption.textContent = text;
			selectStatus.appendChild(selectOption);
		});

		selectStatus.value = data.status || '';
	}

	// Populate delete modal
	deleteMalIdInput.value = data.malId || '';
	deleteTypeInput.value = data.type || '';

	modalFormList.showModal();
});
