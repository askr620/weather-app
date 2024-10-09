document.getElementById('generate-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchCurrentWeather(city);
        fetchWeatherForecast(city);
    }
});

document.getElementById('current-location-btn').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoordinates(lat, lon);
        }, error => {
            console.error('Error getting location:', error);
            alert('Unable to retrieve your location. Please try again.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function fetchCurrentWeather(city) {
    const apiKey = 'b71df0718aff1e2e85ceaeea214b5582'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
        });
}

function fetchWeatherByCoordinates(lat, lon) {
    const apiKey = 'b71df0718aff1e2e85ceaeea214b5582'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data by coordinates:', error);
        });
}

function displayCurrentWeather(data) {
    const currentWeatherDisplay = document.getElementById('current-weather');
    if (data.cod === 200) {
        const html = `
            <h2>Current Weather in ${data.name}</h2>
            <div>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
            </div>
        `;
        currentWeatherDisplay.innerHTML = html;
    } else {
        currentWeatherDisplay.innerHTML = `<p>City not found. Please try again.</p>`;
    }
}

function fetchWeatherForecast(city) {
    const apiKey = 'b71df0718aff1e2e85ceaeea214b5582'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    document.getElementById('loading').classList.remove('hidden');
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading').classList.add('hidden');
            displayWeatherForecast(data);
        })
        .catch(error => {
            document.getElementById('loading').classList.add('hidden');
            console.error('Error fetching weather forecast data:', error);
        });
}

function displayWeatherForecast(data) {
    const weatherDisplay = document.getElementById('weather-display');
    if (data.cod === "200") {
        const city = data.city.name;
        const forecasts = data.list.slice(0, 5); // Get the first 5 forecasts
        let html = `<h2>Weather Forecast for ${city}</h2>`;
        forecasts.forEach(forecast => {
            html += `
                <div>
                    <p><strong>${new Date(forecast.dt_txt).toLocaleString()}</strong></p>
                    <p>Temperature: ${forecast.main.temp}°C</p>
                    <p>Weather: ${forecast.weather[0].description}</p>
                    <p>Humidity: ${forecast.main.humidity}%</p>
                    <p>Wind Speed: ${forecast.wind.speed} m/s</p>
                </div>
            `;
        });
        weatherDisplay.innerHTML = html;
    } else {
        weatherDisplay.innerHTML = `<p>City not found. Please try again.</p>`;
    }
}

// Fetch default cities' weather
const defaultCities = ['Delhi', 'Patna', 'Kolkata', 'Goa', 'Ranchi', 'Mumbai'];
defaultCities.forEach(city => {
    fetchCurrentWeather(city);
    fetchWeatherForecast(city);
});
