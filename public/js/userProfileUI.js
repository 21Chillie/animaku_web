// Profile Info
const profileInfo = document.getElementById('profile-info');
const btnEdit = document.getElementById('btn-edit');

// Profile Edit
const profileEdit = document.getElementById('profile-edit');
const btnClose = document.getElementById('btn-close');

btnEdit.addEventListener('click', () => {
	profileEdit.classList.remove('hidden');
	profileInfo.classList.add('hidden');
});

btnClose.addEventListener('click', () => {
	profileInfo.classList.remove('hidden');
	profileEdit.classList.add('hidden');
});

document.getElementById('toggle-old-password').addEventListener('click', () => {
	const input = document.getElementById('old-password');
	const eye = document.getElementById('old-password-eye');

	if (input.type === 'password') {
		input.type = 'text';
		eye.classList.replace('ri-eye-line', 'ri-eye-off-line');
	} else {
		input.type = 'password';
		eye.classList.replace('ri-eye-off-line', 'ri-eye-line');
	}
});

document.getElementById('toggle-new-password').addEventListener('click', () => {
	const input = document.getElementById('new-password');
	const eye = document.getElementById('new-password-eye');

	if (input.type === 'password') {
		input.type = 'text';
		eye.classList.replace('ri-eye-line', 'ri-eye-off-line');
	} else {
		input.type = 'password';
		eye.classList.replace('ri-eye-off-line', 'ri-eye-line');
	}
});

setTimeout(() => {
	const toast = document.getElementById('toast');
	if (!toast) return;

	toast.classList.add('opacity-0');

	setTimeout(() => toast.remove(), 300);
}, 5000);
