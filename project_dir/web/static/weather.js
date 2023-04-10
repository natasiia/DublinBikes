//icons are taken from https://www.amcharts.com/free-animated-svg-weather-icons/

const weatherMap = {
  "broken clouds": "static/images/weather_icons/cloudy.svg",
  "light intensity drizzle": "static/images/weather_icons/rainy-5.svg",
  "light intensity drizzle rain": "static/images/weather_icons/rainy-5.svg",
  "scattered clouds": "static/images/weather_icons/cloudy-day-1.svg",
  "overcast clouds": "static/images/weather_icons/cloudy.svg",
  "light rain": "static/images/weather_icons/rainy-5.svg",
  "light intensity shower rain": "static/images/weather_icons/rainy-5.svg",
  "moderate rain": "static/images/weather_icons/rainy-6.svg",
  "clear sky": "static/images/weather_icons/day.svg",
  "sky is clear": "static/images/weather_icons/day.svg",
  "few clouds": "static/images/weather_icons/cloudy-day-1.svg",
  snow: "static/images/weather_icons/snowy-6.svg",
  "light snow": "static/images/weather_icons/snowy-1.svg",
  "heavy intensity rain": "static/images/weather_icons/rainy-6.svg",
  sleet: "static/images/weather_icons/snowy-5.svg",
  mist: "static/images/weather_icons/cloudy.svg",
  "shower rain": "static/images/weather_icons/rainy-6.svg",
  fog: "static/images/weather_icons/cloudy.svg",
};

let temperature = document.querySelector("#temperature");
let temp_feels_like = document.querySelector("#temp_feels_like");
let pressure = document.querySelector("#pressure");
let humidity = document.querySelector("#humidity");
let visibility = document.querySelector("#visibility");
let wind_speed = document.querySelector("#wind_speed");

temperature.innerHTML = (weather[0].temperature - 273.15).toFixed(0);
temp_feels_like.innerHTML = (weather[0].temp_feels_like - 273.15).toFixed(0);
pressure.innerHTML = weather[0].pressure;
humidity.innerHTML = weather[0].humidity;
visibility.innerHTML = weather[0].visibility;
wind_speed.innerHTML = weather[0].wind_speed;

const weatherImg = document.querySelector("#weather_icon");

function updateWeather(weather) {
  const imgSrc = weatherMap[weather.toLowerCase()];
  if (imgSrc) {
    weatherImg.src = imgSrc;
  } else {
    console.error(`Invalid weather value: ${weather}`);
  }
}

updateWeather(weather[0].weather_description);
