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
      <h2>${exec.name}</h2>
      <p><strong>Platform:</strong> ${exec.platform}</p>
      <p><strong>Type:</strong> ${exec.type}</p>
      <p><strong>Status:</strong> <span class="status ${exec.executorStatus}">${exec.executorStatus}</span></p>
      <p><strong>Detection:</strong> <span class="status ${exec.detectionStatus}">${exec.detectionStatus}</span></p>
      <p><em>Last Updated: ${formatRelativeDate(exec.lastUpdated)}</em></p>
      ${exec.log ? `<p class="log"><strong>Log:</strong> ${exec.log}</p>` : ""}
      ${exec.tea ? `<p class="tea"><strong>Tea:</strong> ${exec.tea}</p>` : ""}
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
document.querySelectorAll("select").forEach(select => {
  select.addEventListener("change", () => {
    const platform = document.getElementById("filterPlatform").value;
    const type = document.getElementById("filterType").value;
    const detection = document.getElementById("filterDetection").value;

    const filtered = executorData.filter(exec =>
      (!platform || exec.platform === platform) &&
      (!type || exec.type === type) &&
      (!detection || exec.detectionStatus === detection)
    );

    renderExecutors(filtered);
  });
});
