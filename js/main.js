document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("theme-light");
});
let executorData = [];

// Fetch JSON data and render all executors
fetch("data/executors.json")
  .then(res => res.json())
  .then(data => {
    executorData = data;
    renderExecutors(data);
  });

// Render executor cards
function renderExecutors(data) {
  const container = document.getElementById("executors");
  container.innerHTML = "";

  data.forEach(exec => {
    const card = document.createElement("div");
    card.className = "executor-card";

    card.innerHTML = `
      <div class="executor-banner">
        <img src="${exec.banner}" alt="${exec.name} banner">
      </div>
      <div class="executor-header">
        <img src="${exec.logo}" alt="${exec.name} logo" class="executor-logo">
        <h2 class="executor-name clickable">${exec.name}</h2>
      </div>
    
      <p><strong>Platform:</strong> ${exec.platform}</p>
      <p><strong>Type:</strong> ${exec.type}</p>
      <p><strong>Status:</strong> <span class="status ${exec.executorStatus}">${exec.executorStatus}</span></p>
      <p><strong>Detection:</strong> <span class="status ${exec.detectionStatus}">${exec.detectionStatus}</span></p>
      <p><em>Last Updated: ${formatRelativeDate(exec.lastUpdated)}</em></p>
    
      ${exec.log ? `<p class="log"><strong>Log:</strong> ${exec.log}</p>` : ""}
      ${exec.tea ? `<p class="tea"><strong>Tea:</strong> ${exec.tea}</p>` : ""}
    
      <div class="executor-links" style="margin-top: 10px;">
        ${exec.website ? `<a href="${exec.website}" target="_blank">🌐 Website</a>` : ""}
        ${exec.discord ? `<a href="${exec.discord}" target="_blank">💬 Discord</a>` : ""}
      </div>
    `;    

    container.appendChild(card);
  });
}

// Convert date to "Yesterday", "2 days ago", etc.
function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}

// Handle filter changes
document.querySelectorAll(".filters input").forEach(input => {
  input.addEventListener("change", () => {
    const platforms = [...document.querySelectorAll(".platform-filter:checked")].map(i => i.value);
    const types = [...document.querySelectorAll(".type-filter:checked")].map(i => i.value);
    const detections = [...document.querySelectorAll(".detection-filter:checked")].map(i => i.value);

    const filtered = executorData.filter(exec => {
      const matchesPlatform = platforms.length ? platforms.includes(exec.platform) : true;
      const matchesType = types.length ? types.includes(exec.type) : true;

      // Detection logic: "maybe" includes "undetected"
      let status = exec.detectionStatus.toLowerCase();
      const matchesDetection = detections.length
        ? detections.includes(status) || (detections.includes("maybe") && status === "undetected")
        : true;

      return matchesPlatform && matchesType && matchesDetection;
    });

    renderExecutors(filtered);
  });
});
