async function getWeather() {
  const state = document.getElementById("state").value;
  const district = document.getElementById("district").value;

  const location = district + "," + state;

  const apiKey = "YOUR_API_KEY"; // replace this

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${district},IN&appid=${apiKey}&units=metric;`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === "404") {
      alert("Location not found");
      return;
    }

    document.getElementById("location").innerText = data.name;
    document.getElementById("temp").innerText = "🌡️ Temp: " + data.main.temp + "°C";
    document.getElementById("condition").innerText = "☁️ Condition: " + data.weather[0].main;
    document.getElementById("humidity").innerText = "💧 Humidity: " + data.main.humidity + "%";
    document.getElementById("wind").innerText = "🌬️ Wind: " + data.wind.speed + " m/s";

  } catch (error) {
    alert("Error fetching weather");
  }
}
