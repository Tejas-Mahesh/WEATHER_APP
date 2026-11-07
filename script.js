const apiKey = "577457b685ad2bf6bc5af4cf5ebbfb4f";

// DOM Elements
const cityElem = document.getElementById("city");
const tempElem = document.getElementById("temp");
const descElem = document.getElementById("desc");
const windElem = document.getElementById("wind");
const humidityElem = document.getElementById("humidity");
const rainElem = document.getElementById("rain");
const feelsLikeElem = document.getElementById("feels-like");
const weatherImg = document.getElementById("weatherImg");
const dateElem = document.getElementById("date");
const refreshBtn = document.getElementById("refresh");
const canvas = document.getElementById("weather-canvas");
const ctx = canvas.getContext("2d");

// Particle engine state
let particles = [];
let currentEffect = null;
let animationFrameId = null;

// Clock
function updateClock() {
  const now = new Date();
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  dateElem.innerText = now.toLocaleDateString(undefined, options);
}
setInterval(updateClock, 1000);
updateClock();

// Resize particle canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Ambient Particle Simulation
class Particle {
  constructor(type) {
    this.type = type;
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    if (this.type === "rain") {
      this.speedY = 12 + Math.random() * 8;
      this.length = 15 + Math.random() * 15;
      this.speedX = -1.5;
    } else if (this.type === "snow") {
      this.speedY = 1.2 + Math.random() * 2;
      this.speedX = Math.sin(Math.random() * Math.PI) * 1.5;
      this.radius = 2 + Math.random() * 3;
    }
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    if (this.y > canvas.height) {
      this.reset();
      this.y = 0;
    }
  }

  draw() {
    if (this.type === "rain") {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.speedX * 2, this.y + this.length);
      ctx.stroke();
    } else if (this.type === "snow") {
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function startParticles(type, count = 100) {
  if (currentEffect === type) return;
  currentEffect = type;
  particles = [];

  if (type === "none") {
    cancelAnimationFrame(animationFrameId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  for (let i = 0; i < count; i++) {
    const p = new Particle(type);
    p.y = Math.random() * canvas.height; // initial scatter
    particles.push(p);
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    animationFrameId = requestAnimationFrame(loop);
  }

  cancelAnimationFrame(animationFrameId);
  loop();
}

// Visual Theme Engine
function applyTheme(condition, isNight) {
  document.body.className = "";

  if (condition.includes("rain") || condition.includes("drizzle")) {
    document.body.classList.add("weather-rain");
    weatherImg.src = "https://cdn-icons-png.flaticon.com/512/3351/3351979.png";
    startParticles("rain", 120);
  } else if (condition.includes("thunderstorm")) {
    document.body.classList.add("weather-thunderstorm");
    weatherImg.src = "https://cdn-icons-png.flaticon.com/512/3104/3104612.png";
    startParticles("rain", 160);
  } else if (condition.includes("snow")) {
    document.body.classList.add("weather-snow");
    weatherImg.src = "https://cdn-icons-png.flaticon.com/512/2315/2315309.png";
    startParticles("snow", 75);
  } else if (condition.includes("cloud")) {
    document.body.classList.add("weather-clouds");
    weatherImg.src = isNight
      ? "https://cdn-icons-png.flaticon.com/512/5903/5903939.png"
      : "https://cdn-icons-png.flaticon.com/512/414/414825.png";
    startParticles("none");
  } else if (condition.includes("clear")) {
    document.body.classList.add(isNight ? "weather-clear-night" : "weather-clear-day");
    weatherImg.src = isNight
      ? "https://cdn-icons-png.flaticon.com/512/581/581601.png"
      : "https://cdn-icons-png.flaticon.com/512/869/869869.png";
    startParticles("none");
  } else {
    // Mist, Haze, Smoke, Fog
    document.body.classList.add("weather-clouds");
    weatherImg.src = "https://cdn-icons-png.flaticon.com/512/4005/4005901.png";
    startParticles("none");
  }
}

// Fetch Weather
async function getWeather(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    const data = await res.json();

    if (data.cod && data.cod !== 200) {
      cityElem.innerText = "Location Error";
      return;
    }

    tempElem.innerText = Math.round(data.main.temp);
    descElem.innerText = data.weather[0].description;
    windElem.innerText = `${data.wind.speed} m/s`;
    humidityElem.innerText = `${data.main.humidity}%`;
    feelsLikeElem.innerText = `${Math.round(data.main.feels_like)}°C`;

    // Precipitation check
    const rainVol = data.rain ? (data.rain["1h"] || data.rain["3h"] || "Yes") : "0 mm";
    rainElem.innerText = rainVol === "0 mm" ? "None" : `${rainVol} mm`;

    const condition = data.weather[0].main.toLowerCase();
    const isNight = data.weather[0].icon.includes("n");

    applyTheme(condition, isNight);
  } catch (err) {
    cityElem.innerText = "Service Unavailable";
  }
}

// Fetch Reverse Geolocation
async function getAddress(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await res.json();
    const a = data.address || {};
    const primary = a.suburb || a.neighbourhood || a.road || "";
    const secondary = a.city || a.town || a.village || a.state || "";

    cityElem.innerText = primary && secondary ? `${primary}, ${secondary}` : primary || secondary || "Local Area";
  } catch {
    cityElem.innerText = "My Location";
  }
}

// Acquire Coordinates
function getLocation() {
  cityElem.innerText = "Locating...";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        getWeather(lat, lon);
        getAddress(lat, lon);
      },
      () => {
        cityElem.innerText = "Permission Denied";
      },
      { timeout: 10000 }
    );
  } else {
    cityElem.innerText = "Geolocation Unsupported";
  }
}

refreshBtn.addEventListener("click", getLocation);

// Initialize on page load
getLocation();
