// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const menuIcon = document.getElementById("menuIcon");
const closeIcon = document.getElementById("closeIcon");

menuToggle.addEventListener("click", () => {
	const isOpen = mobileMenu.classList.contains("open");

	if (isOpen) {
		menuIcon.classList.remove("hidden");
		closeIcon.classList.add("hidden");
		mobileMenu.classList.remove("open");
		setTimeout(() => {
			mobileMenu.classList.add("hidden");
		}, 200); // matches CSS transition
	} else {
		menuIcon.classList.add("hidden");
		closeIcon.classList.remove("hidden");
		mobileMenu.classList.remove("hidden");
		setTimeout(() => {
			mobileMenu.classList.add("open");
		}, 5); // small delay for smooth transition
	}
});
