document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("theme-light");
});
// Fetch executor data from JSON
fetch("data/executors.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("executors");
    data.forEach(exec => {
      const card = document.createElement("div");
      card.className = "executor-card";

      card.innerHTML = `
        <h2>${exec.name}</h2>
        <p><strong>Platform:</strong> ${exec.platform}</p>
        <p><strong>Type:</strong> ${exec.type}</p>
        <p><strong>Status:</strong> <span class="status ${exec.executorStatus}">${exec.executorStatus}</span></p>
        <p><strong>Detection:</strong> <span class="status ${exec.detectionStatus}">${exec.detectionStatus}</span></p>
        <p><em>Last Updated: ${exec.lastUpdated}</em></p>
      `;

      container.appendChild(card);
    });
  });
