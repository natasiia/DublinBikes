//icons are taken from https://www.amcharts.com/free-animated-svg-weather-icons/

const weatherMap = {
  "thunderstorm with light rain": "static/images/weather_icons/thunder.svg",
  "thunderstorm with rain": "static/images/weather_icons/thunder.svg",
  "thunderstorm with heavy rain": "static/images/weather_icons/thunder.svg",
  "light thunderstorm": "static/images/weather_icons/thunder.svg",
  thunderstorm: "static/images/weather_icons/thunder.svg",
  "heavy thunderstorm": "static/images/weather_icons/thunder.svg",
  "ragged thunderstorm": "static/images/weather_icons/thunder.svg",
  "thunderstorm with light drizzle": "static/images/weather_icons/thunder.svg",
  "thunderstorm with drizzle": "static/images/weather_icons/thunder.svg",
  "thunderstorm with heavy drizzle": "static/images/weather_icons/thunder.svg",
  "light intensity drizzle": "static/images/weather_icons/rainy-5.svg",
  drizzle: "static/images/weather_icons/rainy-5.svg",
  "heavy intensity drizzle": "static/images/weather_icons/rainy-6.svg",
  "light intensity drizzle rain": "static/images/weather_icons/rainy-5.svg",
  "drizzle rain": "static/images/weather_icons/rainy-6.svg",
  "heavy intensity drizzle rain": "static/images/weather_icons/rainy-6.svg",
  "shower rain and drizzle": "static/images/weather_icons/rainy-6.svg",
  "heavy shower rain and drizzle": "static/images/weather_icons/rainy-6.svg",
  "shower drizzle": "static/images/weather_icons/rainy-6.svg",
  "light rain": "static/images/weather_icons/rainy-1.svg",
  "moderate rain": "static/images/weather_icons/rainy-2.svg",
  "heavy intensity rain": "static/images/weather_icons/rainy-3.svg",
  "very heavy rain": "static/images/weather_icons/rainy-4.svg",
  "extreme rain": "static/images/weather_icons/rainy-7.svg",
  "freezing rain": "static/images/weather_icons/rainy-7.svg",
  "light intensity shower rain": "static/images/weather_icons/rainy-1.svg",
  "shower rain": "static/images/weather_icons/rainy-2.svg",
  "heavy intensity shower rain": "static/images/weather_icons/rainy-3.svg",
  "ragged shower rain": "static/images/weather_icons/rainy-7.svg",
  "light snow": "static/images/weather_icons/snowy-1.svg",
  snow: "static/images/weather_icons/snowy-2.svg",
  "heavy snow": "static/images/weather_icons/snowy-3.svg",
  sleet: "static/images/weather_icons/snowy-4.svg",
  "light shower sleet": "static/images/weather_icons/snowy-4.svg",
  "shower sleet": "static/images/weather_icons/snowy-4.svg",
  "light rain and snow": "static/images/weather_icons/snowy-5.svg",
  "rain and snow": "static/images/weather_icons/snowy-6.svg",
  "light shower snow": "static/images/weather_icons/snowy-1.svg",
  "shower snow": "static/images/weather_icons/snowy-2.svg",
  "heavy shower snow": "static/images/weather_icons/snowy-3.svg",
  mist: "static/images/weather_icons/cloudy.svg",
  smoke: "static/images/weather_icons/cloudy.svg",
  haze: "static/images/weather_icons/cloudy.svg",
  "sand, dust whirls": "static/images/weather_icons/cloudy.svg",
  fog: "static/images/weather_icons/cloudy.svg",
  sand: "static/images/weather_icons/cloudy.svg",
  dust: "static/images/weather_icons/cloudy.svg",
  "volcanic ash": "static/images/weather_icons/cloudy.svg",
  squalls: "static/images/weather_icons/windy.svg",
  tornado: "static/images/weather_icons/windy-2.svg",
  "clear sky": "static/images/weather_icons/day.svg",
  "few clouds": "static/images/weather_icons/cloudy-day-1.svg",
  "scattered clouds": "static/images/weather_icons/cloudy-day-2.svg",
  "broken clouds": "static/images/weather_icons/cloudy-day-3.svg",
  "overcast clouds": "static/images/weather_icons/cloudy-day-4.svg",
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
