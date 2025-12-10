document.getElementById('toggle-password').addEventListener('click', () => {
	const input = document.getElementById('password');
	const eye = document.getElementById('password-eye');

	if (input.type === 'password') {
		input.type = 'text';
		eye.classList.replace('ri-eye-line', 'ri-eye-off-line');
	} else {
		input.type = 'password';
		eye.classList.replace('ri-eye-off-line', 'ri-eye-line');
	}
});
