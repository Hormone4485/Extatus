const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark");
}

document.querySelector(".theme-toggle").addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
});

let executorData = [];

// Fetch JSON data
fetch("data/executors.json")
  .then(res => res.json())
  .then(data => {
    executorData = data;
    filterExecutors(); // Initial render
  });

// Render executor cards
function renderExecutors(data) {
  const container = document.getElementById("executors");
  container.innerHTML = "";

  data.forEach(exec => {
    const card = document.createElement("div");
    card.className = "executor-card";
    card.style.backgroundImage = `url(${exec.banner})`;

    const overlay = document.createElement("div");
    overlay.className = "executor-card-overlay";

    overlay.innerHTML = `
      <div class="executor-header">
        <img src="${exec.logo}" alt="${exec.name} logo" class="executor-logo">
        <h2 class="executor-name clickable">${exec.name}</h2>
      </div>

      <div class="executor-meta">
        <p><strong>Platform:</strong> ${exec.platform}</p>
        <p><strong>Type:</strong> ${exec.type}</p>
        <p><strong>Status:</strong> <span class="status ${exec.executorStatus}">${exec.executorStatus}</span></p>
        <p><strong>Detection:</strong> <span class="status ${exec.detectionStatus}">${exec.detectionStatus}</span></p>
        <p><em>Last Updated: ${formatRelativeDate(exec.lastUpdated)}</em></p>

        ${exec.log ? `<p class="log"><strong>Latest update:</strong> ${exec.log}</p>` : ""}
        ${exec.tea ? `<p class="tea">${exec.tea}</p>` : ""}

        <div class="executor-links">
          ${exec.website ? `<a href="${exec.website}" target="_blank">🌐 Website</a>` : ""}
          ${exec.discord ? `<a href="${exec.discord}" target="_blank">💬 Discord</a>` : ""}
        </div>
      </div>
    `;

    card.appendChild(overlay);
    container.appendChild(card);
  });
}

// Convert to relative date string
function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}

// Filter dropdown elements
const platformFilter = document.getElementById("platformFilter");
const typeFilter = document.getElementById("typeFilter");
const detectionFilter = document.getElementById("detectionFilter");

// Set defaults from storage or fallback
platformFilter.value = localStorage.getItem("platformFilter") || "Android";
typeFilter.value = localStorage.getItem("typeFilter") || "Free";
detectionFilter.value = localStorage.getItem("detectionFilter") || "";

// Filtering logic
function filterExecutors() {
  const platformVal = platformFilter.value;
  const typeVal = typeFilter.value;
  const detectionVal = detectionFilter.value;

  // Save to local storage
  localStorage.setItem("platformFilter", platformVal);
  localStorage.setItem("typeFilter", typeVal);
  localStorage.setItem("detectionFilter", detectionVal);

  const filtered = executorData.filter(exec => {
    const platformOk = !platformVal || exec.platform === platformVal;
    const typeOk = !typeVal || exec.type === typeVal;
    const detectOk =
      !detectionVal ||
      exec.detectionStatus === detectionVal ||
      (detectionVal === "maybe" && exec.detectionStatus === "undetected");

    return platformOk && typeOk && detectOk;
  });

  renderExecutors(filtered);
}

// Hook up event listeners
[platformFilter, typeFilter, detectionFilter].forEach(el =>
  el.addEventListener("change", filterExecutors)
);
