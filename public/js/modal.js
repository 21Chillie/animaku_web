// Modal Popups Add To list
// DOM Elements
const btnAddList = document.getElementById("btn-addlist");
const addListModal = document.getElementById("addListModal");
const closeModal = document.getElementById("closeModal");
const saveListBtn = document.getElementById("saveListBtn");
const deleteListBtn = document.getElementById("deleteListBtn");

// Show modal when btn-addlist is clicked
btnAddList.addEventListener("click", function () {
  // Show modal
  addListModal.classList.remove("invisible");
});

// Close modal functions
function closeModalFunc() {
  addListModal.classList.add("invisible");
}

closeModal.addEventListener("click", closeModalFunc);

// Close when clicking outside modal
addListModal.addEventListener("click", function (e) {
  if (e.target === addListModal) {
    closeModalFunc();
  }
});

// Add save and delete button event listeners
saveListBtn?.addEventListener("click", function () {
  // Add save logic here
  closeModalFunc();
});

deleteListBtn?.addEventListener("click", function () {
  if (confirm("Are you sure you want to delete this entry?")) {
    // Add delete logic here
    closeModalFunc();
  }
});
