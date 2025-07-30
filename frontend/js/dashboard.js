// Dashboard JavaScript for References Management
const API_BASE_URL = "http://localhost:4936";

// Get user info from localStorage (set during login)
const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
const userId = "1"; // For demo purposes, using user ID 1

// Initialize dashboard
document.addEventListener("DOMContentLoaded", function () {
  loadUserProfile();
  loadReferences();
  setupEventListeners();

  // Logout button logic
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("currentUser");
      window.location.href = "../index.html";
    });
  }
});

// Load user profile
function loadUserProfile() {
  const profileName = document.getElementById("profile-name");
  if (currentUser.firstName && currentUser.lastName) {
    profileName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  }
}

// Load references from API
async function loadReferences() {
  try {
    console.log(
      "Loading references from:",
      `${API_BASE_URL}/api/v1/users/${userId}/references`
    );
    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/${userId}/references`
    );
    console.log("Response status:", response.status);
    if (response.ok) {
      const references = await response.json();
      console.log("References loaded:", references);
      displayReferences(references);
    } else {
      console.error("Failed to load references, status:", response.status);
    }
  } catch (error) {
    console.error("Error loading references:", error);
  }
}

// Display references in the grid
function displayReferences(references) {
  const grid = document.getElementById("referencesGrid");
  grid.innerHTML = "";

  if (references.length === 0) {
    grid.innerHTML =
      '<div class="no-references">No references found. Add your first reference!</div>';
    return;
  }

  references.forEach((reference) => {
    const card = createReferenceCard(reference);
    grid.appendChild(card);
  });
}

// Create reference card HTML
function createReferenceCard(reference) {
  const card = document.createElement("div");
  card.className = "reference-card";
  card.innerHTML = `
        <div class="reference-header">
            <div class="reference-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="reference-actions">
                <button class="action-btn" onclick="editReference('${
                  reference.id
                }')" title="Edit Reference">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteReference('${
                  reference.id
                }')" title="Delete Reference">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="reference-content">
            <h3 class="reference-name">${reference.firstName} ${
    reference.lastName
  }</h3>
            <p class="reference-title">${reference.jobTitle}</p>
            <p class="reference-company">${reference.company}</p>
            <div class="reference-contact">
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${reference.email}</span>
                </div>
                ${
                  reference.phone
                    ? `
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>${reference.phone}</span>
                </div>
                `
                    : ""
                }
            </div>
            <div class="reference-type-badge ${reference.referenceType}">${
    reference.referenceType
  }</div>
            ${
              reference.relationship
                ? `<p class="reference-relationship">${reference.relationship}</p>`
                : ""
            }
        </div>
    `;
  return card;
}

// Setup event listeners
function setupEventListeners() {
  // Reference form submission
  const referenceForm = document.getElementById("referenceForm");
  if (referenceForm) {
    referenceForm.addEventListener("submit", handleAddReference);
  }

  // Search functionality
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }

  // Filter functionality
  const filterSelects = document.querySelectorAll(".filter-select");
  filterSelects.forEach((select) => {
    select.addEventListener("change", handleFilter);
  });
}

// Handle add reference form submission
async function handleAddReference(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const referenceData = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/${userId}/references`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(referenceData),
      }
    );

    if (response.ok) {
      closeAddReferenceModal();
      loadReferences(); // Reload the references
      event.target.reset();
    } else {
      const error = await response.json();
      alert("Error adding reference: " + error.message);
    }
  } catch (error) {
    console.error("Error adding reference:", error);
    alert("Error adding reference. Please try again.");
  }
}

// Delete reference
async function deleteReference(referenceId) {
  if (!confirm("Are you sure you want to delete this reference?")) {
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/${userId}/references/${referenceId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      loadReferences(); // Reload the references
    } else {
      alert("Error deleting reference");
    }
  } catch (error) {
    console.error("Error deleting reference:", error);
    alert("Error deleting reference. Please try again.");
  }
}

// Edit reference (placeholder for now)
function editReference(referenceId) {
  alert("Edit functionality will be implemented in the next iteration");
}

// Search functionality
function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  const cards = document.querySelectorAll(".reference-card");

  cards.forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(searchTerm) ? "block" : "none";
  });
}

// Filter functionality
function handleFilter(event) {
  const filterValue = event.target.value.toLowerCase();
  const cards = document.querySelectorAll(".reference-card");

  if (!filterValue) {
    cards.forEach((card) => (card.style.display = "block"));
    return;
  }

  cards.forEach((card) => {
    const badge = card.querySelector(".reference-type-badge");
    const company = card.querySelector(".reference-company");

    const matchesType =
      badge && badge.textContent.toLowerCase().includes(filterValue);
    const matchesCompany =
      company && company.textContent.toLowerCase().includes(filterValue);

    card.style.display = matchesType || matchesCompany ? "block" : "none";
  });
}

// Modal functions
function openAddReferenceModal() {
  document.getElementById("addReferenceModal").style.display = "flex";
}

function closeAddReferenceModal() {
  document.getElementById("addReferenceModal").style.display = "none";
}

// Close modal when clicking outside
document.addEventListener("click", function (event) {
  const modal = document.getElementById("addReferenceModal");
  if (event.target === modal) {
    closeAddReferenceModal();
  }
});
