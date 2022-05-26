const searchBtn = document.querySelector(".search-btn");
const searchBar = document.querySelector(".search-bar");
const cityHeader = document.querySelector(".city");
const tempHeader = document.querySelector(".temp");
const feelsLikeTempHeader = document.querySelector(".feels-like");
const iconHeader = document.querySelector(".icon");
const humidityHeader = document.querySelector(".humidity");
const windHeader = document.querySelector(".wind");
const timeHeader = document.querySelector(".time");
const descHeader = document.querySelector(".description");
const body = document.querySelector("body");
const APIkey = "470c20b29e55e22dd7209d5f6689cf6a";

let lat = 0;
let lon = 0;
let currentLocation = "toms river";
let unit = "imperial";
let time = "";

/////////////////////////////////////////
// Testing the Google Places API
const searchElement = document.querySelector("[data-city-search]");
const searchBox = new google.maps.places.SearchBox(searchElement);
searchBox.addListener("places_changed", () => {
  const place = searchBox.getPlaces()[0];
  console.log("listneer activated", place);
  if (place == null) return;
  const latitude = place.geometry.location.lat();
  const longitude = place.geometry.location.lng();
  console.log(place.formatted_address);
  weather.coordFetch(latitude, longitude, place.formatted_address);
});

/////////////////////////////////////////
/////////////////////////////////////////

// fetch(
//   `https://api.openweathermap.org/data/2.5/weather?q=${currentLocation}&appid=${APIkey}&units=${unit}`
// )
//   .then((response) => {
//     if (!response.ok) {
//       alert("No weather found.");
//       throw new Error("No weather found.");
//     }
//     return response.json();
//   })
//   .then((data) => {
//     console.log(data);
//     weather.renderWeather(data);
//   });

navigator.geolocation.getCurrentPosition((position) => {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  if (lat && lon) weather.coordFetch(lat, lon);
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
    // Using the timestamp from the data to determine time of day
    let timeStamp = data.dt * 1000;
    timeStamp = new Date(timeStamp);
    data.dt > data.sys.sunrise && data.dt < data.sys.sunset
      ? (time = "day")
      : (time = "night");

    // Determining which image to change the background to based on time of day or weather conditions
    console.log(data.weather[0].description.split(" ").join(""));
    time === "night"
      ? (body.style.backgroundImage = `url(https://source.unsplash.com/1600x900/?night-sky`)
      : (body.style.backgroundImage = `url(https://source.unsplash.com/1600x900/?${data.weather[0].main}-${time})`);

    // Changing city name in the card
    cityHeader.innerHTML = `Weather in ${
      searchBar.value ? searchBar.value : data.name
    }`;

    // Changing temperature in the card
    tempHeader.innerHTML = `${data.main.temp}°F`;
    feelsLikeTempHeader.innerHTML = `Feels Like ${data.main.feels_like}`;

    // Changing the icon shown in the card based on weather conditions
    iconHeader.src = `img/${time}/${
      data.weather[0].main ? data.weather[0].main : "Drizzle"
    }.png`;

    // Changing description in the card
    descHeader.innerHTML = data.weather[0].main;

    // Changing the humidity value in the card
    humidityHeader.innerHTML = `Humidity: ${data.main.humidity}%`;

    // Changing the wind speed value in the card
    windHeader.innerHTML = `Wind Speed: ${data.wind.speed} mph`;

    // Changing the timestamp at the bottom of the card (when the data was retrieved)
    timeHeader.innerHTML = `As of ${timeStamp.toTimeString()}`;
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
