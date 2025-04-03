import config from './config.js';

let lon;
let lat;
const temperature = document.querySelector(".temp");
const summary = document.querySelector(".summary");
const loc = document.querySelector(".location");
const icon = document.querySelector(".icon");
const kelvin = 273;

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        lon = position.coords.longitude;
        lat = position.coords.latitude;

        const apiKey = config.WEATHER_API_KEY;
        const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        fetch(base)
          .then((response) => response.json())
          .then((data) => {
            console.log(data); // Log data to verify structure
            if (data.main && data.weather) {
              temperature.textContent = Math.floor(data.main.temp - kelvin) + "°C";
              summary.textContent = data.weather[0].description;
              loc.textContent = data.name + ", " + data.sys.country;
              let icon1 = data.weather[0].icon;
              icon.innerHTML = `<img src="icons/${icon1}.svg" style='height:10rem'/>`;
            } else {
              loc.textContent = "Weather data unavailable";
            }
          })
          .catch((error) => {
            console.error('Error fetching the weather data:', error);
            loc.textContent = "Weather data unavailable";
          });
      },
      (error) => {
        console.error("Error getting location: ", error.message);
        loc.textContent = "Location access denied or unavailable.";
      }
    );
  } else {
    loc.textContent = "Geolocation is not supported by this browser.";
  }
});