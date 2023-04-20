//icons are taken from https://www.amcharts.com/free-animated-svg-weather-icons/
// <a href="https://www.flaticon.com/free-icons/drop" title="drop icons">Drop icons created by Pixel perfect - Flaticon</a>

const apiKey = "287a64521ea9136de147467072dc8ccb";

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

const temperature = document.querySelector("#temperature");
const weather_desc = document.querySelector("#weather_desc");
const pressure = document.querySelector("#pressure");
const humidity = document.querySelector("#humidity");
const wind_speed = document.querySelector("#wind_speed");
const visible_date = document.querySelector("#visible_date");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const date = new Date();
let day = date.getDate();
let month = months[date.getMonth()];
let day_week = days[date.getDay()];

visible_date.innerHTML = `${day_week}, ${day} ${month}`;

const weatherImg = document.querySelector("#weather_icon");

function capitalizeString(string) {
  return string.toLowerCase().replace(/(?:^|\s)\S/g, function (word) {
    return word.toUpperCase();
  });
}

function updateWeather() {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Dublin,IE&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      temperature.innerHTML = (data.main.temp - 273.15).toFixed(0);
      weather_desc.innerHTML = capitalizeString(data.weather[0].description);
      wind_speed.innerHTML = (data.wind.speed * 3.6).toFixed(1);
      pressure.innerHTML = data.main.pressure;
      humidity.innerHTML = data.main.humidity;

      const imgSrc = weatherMap[data.weather[0].description.toLowerCase()];
      if (imgSrc) {
        weatherImg.src = imgSrc;
      } else {
        console.error(`Invalid weather value: ${data.weather[0].description}`);
      }
    })
    .catch((error) => {
      console.error(`Error fetching weather data: ${error}`);
    });
}

updateWeather();
