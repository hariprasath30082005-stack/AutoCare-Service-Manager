import React, { useState, useEffect } from "react";
import "./App6.css";

function App6() {
  const [city, setCity] = useState("Chennai");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const getWeather = async () => {
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await response.json();

        if (!locationData.results?.length) {
          setWeather(null);
          return;
        }

        const { latitude, longitude, name, country } =
          locationData.results[0];

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        setWeather({
          name,
          country,
          temperature: weatherData.current.temperature_2m,
          humidity: weatherData.current.relative_humidity_2m,
          wind: weatherData.current.wind_speed_10m,
          code: weatherData.current.weather_code,
        });
      } catch (error) {
        setWeather(null);
      }
    };

    getWeather();
  }, [city]);

  const getCondition = (code) => {
    if (code === 0) return "Clear Sky";
    if ([1, 2, 3].includes(code)) return "Cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
      return "Rainy";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Weather Update";
  };

  const getIcon = (code) => {
    if (code === 0) return "☀️";
    if ([1, 2, 3].includes(code)) return "☁️";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
      return "🌧️";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
    if ([95, 96, 99].includes(code)) return "⛈️";
    return "🌤️";
  };

  return (
    <div className="weather-app">
      <div className="weather-card">
        <h1>Weather App</h1>
        <p className="subtitle">Live weather updates</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {!weather ? (
          <p className="message">
            Weather load aagala. City name check pannunga.
          </p>
        ) : (
          <>
            <h2>
              {weather.name}, {weather.country}
            </h2>

            <div className="weather-icon">
              {getIcon(weather.code)}
            </div>

            <h3 className="temperature">
              {weather.temperature}°C
            </h3>

            <p className="condition">
              {getCondition(weather.code)}
            </p>

            <div className="weather-details">
              <div className="detail-box">
                <span>💧</span>
                <p>Humidity</p>
                <h4>{weather.humidity}%</h4>
              </div>

              <div className="detail-box">
                <span>💨</span>
                <p>Wind Speed</p>
                <h4>{weather.wind} km/h</h4>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App6;