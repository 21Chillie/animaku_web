// Theme toggle (desktop and mobile)
// Selectors
const htmlEl = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const sunIcon = document.getElementById("sunIcon");
const moonIcon = document.getElementById("moonIcon");
const themeToggleMobile = document.getElementById("themeToggleMobile");
const sunIconMobile = document.getElementById("sunIconMobile");
const moonIconMobile = document.getElementById("moonIconMobile");
const navbarBrand = document.getElementById("navbarBrand");

// Apply saved theme on load
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
	htmlEl.setAttribute("data-theme", savedTheme);

	const isDark = savedTheme === "dark";

	if (isDark) {
		navbarBrand.src = "/images/animaku-logo-dark.webp";
	} else {
		navbarBrand.src = "/images/animaku-logo-light.webp";
	}

	[sunIcon, sunIconMobile].forEach((el) => el.classList.toggle("hidden", isDark));
	[moonIcon, moonIconMobile].forEach((el) => el.classList.toggle("hidden", !isDark));
}

// Theme toggle
function toggleTheme() {
	const currentTheme = htmlEl.getAttribute("data-theme");
	let newTheme;

	if (currentTheme === "dark") {
		newTheme = "light";
	} else {
		newTheme = "dark";
	}

	htmlEl.setAttribute("data-theme", newTheme);
	localStorage.setItem("theme", newTheme);

	const isDark = newTheme === "dark";

	// Update icon visibility and navbar brand icon
	if (isDark) {
		[sunIcon, sunIconMobile].forEach((el) => el.classList.add("hidden"));
		[moonIcon, moonIconMobile].forEach((el) => el.classList.remove("hidden"));
		navbarBrand.src = "/images/animaku-logo-dark.webp";
	} else {
		[sunIcon, sunIconMobile].forEach((el) => el.classList.remove("hidden"));
		[moonIcon, moonIconMobile].forEach((el) => el.classList.add("hidden"));
		navbarBrand.src = "/images/animaku-logo-light.webp";
	}
}

themeToggle.addEventListener("click", toggleTheme);
themeToggleMobile.addEventListener("click", toggleTheme);
