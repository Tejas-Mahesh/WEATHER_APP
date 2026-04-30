
const apiKey = "577457b685ad2bf6bc5af4cf5ebbfb4f";

// DOM
const city = document.getElementById("city");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const rain = document.getElementById("rain");
const weatherImg = document.getElementById("weatherImg");
const date = document.getElementById("date");
const refreshBtn = document.getElementById("refresh");

// Live Date & Time
function updateTime() {
    const now = new Date();
    date.innerText = now.toLocaleString();
}
setInterval(updateTime, 1000);
updateTime();

// Weather Image Logic
function setWeatherImage(condition, icon) {
    const isNight = icon.includes("n");

    if (condition.includes("rain")) {
        weatherImg.src = "https://cdn-icons-png.flaticon.com/512/1163/1163624.png";
    } 
    else if (condition.includes("cloud")) {
        weatherImg.src = "https://cdn-icons-png.flaticon.com/512/414/414825.png";
    } 
    else if (condition.includes("clear")) {
        weatherImg.src = isNight
            ? "https://cdn-icons-png.flaticon.com/512/869/869869.png"   // moon
            : "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // sun
    } 
    else {
        weatherImg.src = "https://cdn-icons-png.flaticon.com/512/1779/1779940.png";
    }
}

// Weather API
function getWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {

            temp.innerText = Math.round(data.main.temp) + "°C";
            desc.innerText = data.weather[0].description;
            wind.innerText = data.wind.speed + " m/s";
            humidity.innerText = data.main.humidity + "%";

            // Rain detection
            rain.innerText = data.rain ? "Yes" : "No";

            const condition = data.weather[0].main.toLowerCase();
            const icon = data.weather[0].icon;

            setWeatherImage(condition, icon);
        })
        .catch(() => {
            city.innerText = "Weather data error";
        });
}

// Address (Street + City)
function getAddress(lat, lon) {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        .then(res => res.json())
        .then(data => {
            const a = data.address;
            const road = a.road || "";
            const place = a.city || a.town || a.village || "";

            city.innerText = `${road}, ${place}`;
        })
        .catch(() => {
            city.innerText = "Location not found";
        });
}

// Get Location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;

                getWeather(lat, lon);
                getAddress(lat, lon);
            },
            () => {
                city.innerText = "Permission denied";
            }
        );
    } else {
        city.innerText = "Geolocation not supported";
    }
}

// Button click
refreshBtn.addEventListener("click", getLocation);

// Auto load
getLocation();




