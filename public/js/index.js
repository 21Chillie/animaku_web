// Mobile Navbar Menu Toggle
const menuBtn = document.querySelector(".btn-menu");
const mobileMenu = document.querySelector(".mobile-nav");
const menuIcon = document.querySelector(".menu-icon");

menuBtn.addEventListener("click", () => {
  // Toggle menu visibility
  mobileMenu.classList.toggle("max-md:hidden");
  mobileMenu.classList.toggle("flex")

  // Toggle icon
  if (menuIcon.classList.contains("ri-menu-line")) {
    menuIcon.classList.remove("ri-menu-line");
    menuIcon.classList.add("ri-close-large-line");
  } else {
    menuIcon.classList.remove("ri-close-large-line");
    menuIcon.classList.add("ri-menu-line");
  }
});
