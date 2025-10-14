// Change options on type dropdown by category selected
const categorySelect = document.querySelector("#filter-category");
const typeSelect = document.querySelector("#filter-type");

const animeTypes = [
  { value: "TV", text: "TV" },
  { value: "movie", text: "Movie" },
  { value: "OVA", text: "OVA" },
  { value: "ONA", text: "ONA" },
  { value: "special", text: "Special" },
];

const mangaTypes = [
  { value: "manga", text: "Manga" },
  { value: "novel", text: "Novel" },
  { value: "oneshot", text: "One-Shot" },
  { value: "doujin", text: "Doujin" },
  { value: "manhwa", text: "Manhwa" },
  { value: "manhua", text: "Manhua" },
];

categorySelect.addEventListener("change", () => {
  const selectedCategory = categorySelect.value;
  let typeList = [];

  if (selectedCategory === "manga") {
    typeList = mangaTypes;
  } else if (selectedCategory === "anime") {
    typeList = animeTypes;
  }

  // Clear existing option in type dropdown list
  typeSelect.innerHTML = "";

  typeList.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.text;
    typeSelect.appendChild(option);
  });
});
