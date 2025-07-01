// Theme toggle 
const themeBtn = document.getElementById("theme-toggle");
const body = document.body;

// Check saved preference or default to dark
let savedTheme = localStorage.getItem("theme");
if (!savedTheme) {
  savedTheme = "dark";
  localStorage.setItem("theme", "dark");
}

if (savedTheme === "dark") {
  body.classList.add("dark");
  themeBtn.textContent = "🌙";
} else {
  themeBtn.textContent = "☀️";
}


themeBtn.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeBtn.textContent = isDark ? "🌙" : "☀️";
});

// Menu toggle
document.getElementById("menu-toggle").onclick = () => {
  document.getElementById("sidebar").classList.toggle("hidden");
};

// Tab switching
const tabs = document.querySelectorAll(".tab");
document.querySelectorAll("#sidebar button").forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(tab => tab.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Clock
function updateClock() {
  document.getElementById("time").textContent = new Date().toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Quote API
fetch("https://api.quotable.io/random")
  .then(res => res.json())
  .then(data => document.getElementById("quote-text").textContent = `"${data.content}"`)
  .catch(() => document.getElementById("quote-text").textContent = "Quote unavailable");

// Weather API (Open-Meteo)
fetch("https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true")
  .then(res => res.json())
  .then(data => {
    const weather = data.current_weather;
    document.getElementById("weather-info").textContent =
      `New Delhi: ${weather.temperature}°C, Wind ${weather.windspeed} km/h`;
  })
  .catch(() => {
    document.getElementById("weather-info").textContent = "Weather unavailable";
  });

// Notes with validation and search
const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note-input");
const noteList = document.getElementById("notes-list");
const noteError = document.getElementById("note-error");
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function renderNotes(filter = "") {
  noteList.innerHTML = "";
  notes.forEach((note, index) => {
    if (!note.toLowerCase().includes(filter)) return;

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = note;
    span.classList.add("note-text");

    const btn = document.createElement("button");
    btn.textContent = "Remove";
    btn.classList.add("remove-btn");
    btn.onclick = () => {
      notes.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes(filter);
    };

    li.appendChild(span);
    li.appendChild(btn);
    noteList.appendChild(li);
  });
}


noteForm.addEventListener("submit", e => {
  e.preventDefault();
  const value = noteInput.value.trim();
  if (!value) {
    noteError.textContent = "Note cannot be empty.";
    return;
  }
  noteError.textContent = "";
  notes.push(value);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
  noteInput.value = "";
});

document.getElementById("search").addEventListener("input", e => {
  renderNotes(e.target.value.trim().toLowerCase());
});

renderNotes();
