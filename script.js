async function getWeather() {
  const state = document.getElementById("state").value.trim();
  const district = document.getElementById("district").value.trim();

  if (!state || !district) {
    alert("Please enter state and city");
    return;
  }

  const apiKey = "577457b685ad2bf6bc5af4cf5ebbfb4f";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${district},${state},IN&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    if (data.cod != 200) {
      alert(data.message);
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
