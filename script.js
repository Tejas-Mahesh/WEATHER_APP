const apiKey = "577457b685ad2bf6bc5af4cf5ebbfb4f";

const city = document.getElementById("city");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const icon = document.getElementById("icon");
const refreshBtn = document.getElementById("refresh");

// 🔹 Get Weather
function getWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            temp.innerText = Math.round(data.main.temp) + "°C";
            desc.innerText = data.weather[0].description;

            const iconCode = data.weather[0].icon;
            icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        });
}

// 🔹 Get Street Name using Reverse Geocoding
function getAddress(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const address = data.address;

            const road = address.road || "";
            const suburb = address.suburb || address.neighbourhood || "";
            const cityName = address.city || address.town || address.village || "";

            // Show full location
            city.innerText = `${road}, ${suburb}, ${cityName}`;
        })
        .catch(() => {
            city.innerText = "Location not found";
        });
}

// 🔹 Get current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                getWeather(lat, lon);
                getAddress(lat, lon);
            },
            () => {
                city.innerText = "Location permission denied";
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
