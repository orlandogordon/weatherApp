const searchBtn = document.querySelector(".search-btn");
const searchBar = document.querySelector(".search-bar");
const cityHeader = document.querySelector(".city");
const tempHeader = document.querySelector(".temp");
const iconHeader = document.querySelector(".icon");
const humidityHeader = document.querySelector(".humidity");
const windHeader = document.querySelector(".wind");
const descHeader = document.querySelector(".description");
const APIkey = "470c20b29e55e22dd7209d5f6689cf6a";

let lat = 0;
let lon = 0;
let currentLocation = "austin";
let unit = "imperial";

fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${currentLocation}&appid=${APIkey}&units=${unit}`
)
  .then((response) => {
    if (!response.ok) {
      alert("No weather found.");
      throw new Error("No weather found.");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    weather.renderWeather(data);
  });

navigator.geolocation.getCurrentPosition((position) => {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  // lat = 57;
  // lon = -2.15;
  if (lat && lon) weather.coordFetch(lat, lon);
  console.log(lat, lon);
  console.log(/^[0-9]+$/.test("fda5"), lat);
});

let weather = {
  city: currentLocation,
  searchValue: "",
  search: function () {
    this.searchValue = `${searchBar.value}`;
    if (/^[0-9]+$/.test(this.searchValue)) this.zipFetch(this.searchValue);
    else this.cityFetch(this.searchValue);
    console.log("search function activate");
  },
  coordFetch: function (lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=${unit}`
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.renderWeather(data));
  },

  cityFetch: function (city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=${unit}`
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.renderWeather(data));
  },

  zipFetch: function (zip) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?zip=${zip},${"us"}&appid=${APIkey}&units=${unit}`
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.renderWeather(data));
  },

  renderWeather: function (data) {
    console.log(data);
    cityHeader.innerHTML = data.name;
    tempHeader.innerHTML = `${data.main.temp}°F`;
    iconHeader.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    descHeader.innerHTML = data.weather[0].main;
    humidityHeader.innerHTML = `Humidity: ${data.main.humidity}%`;
    windHeader.innerHTML = `Wind Speed: ${data.wind.speed} mph`;
  },
};

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  weather.search();
});

searchBar.addEventListener("keyup", function (e) {
  e.preventDefault();
  if (e.key === "Enter") weather.search();
});
