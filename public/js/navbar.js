const htmlEl = document.documentElement;

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

// Theme toggle (desktop and mobile)
const themeToggle = document.getElementById("themeToggle");
const sunIcon = document.getElementById("sunIcon");
const moonIcon = document.getElementById("moonIcon");

const themeToggleMobile = document.getElementById("themeToggleMobile");
const sunIconMobile = document.getElementById("sunIconMobile");
const moonIconMobile = document.getElementById("moonIconMobile");

const navbarBrand = document.getElementById("navbarBrand");

function toggleTheme() {
	const currentTheme = htmlEl.getAttribute("data-theme");
	const isDark = currentTheme === "dark";
	htmlEl.setAttribute("data-theme", isDark ? "light" : "dark");

	if (currentTheme === "dark") {
		navbarBrand.src = "/images/animaku-logo-light.webp";
	} else {
		navbarBrand.src = "/images/animaku-logo-dark.webp";
	}

	[sunIcon, sunIconMobile].forEach((el) => el.classList.toggle("hidden", !isDark));
	[moonIcon, moonIconMobile].forEach((el) => el.classList.toggle("hidden", isDark));
}

themeToggle.addEventListener("click", toggleTheme);
themeToggleMobile.addEventListener("click", toggleTheme);
