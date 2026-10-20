const API_KEY = 'E75C6CJNDKR7FJH7XCYDNRGXH'; // 

const form = document.getElementById('weather-form');
const locationInput = document.getElementById('location-input');
const loadingText = document.getElementById('loading');
const weatherDisplay = document.getElementById('weather-display');
const cityNameEl = document.getElementById('city-name');
const weatherConditionEl = document.getElementById('weather-condition');
const temperatureEl = document.getElementById('temperature');
const toggleBtn = document.getElementById('toggle-temp');

let currentTempC = 0;
let currentTempF = 0;
let isCelsius = true;

async function fetchWeatherData(location) {
    try {

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) throw new Error(`Location not found , add realistic location not ${location} !`);
        
        const data = await response.json();
        console.log("Raw API Data:", data); // console.log() the info as requested
        return data;
    } catch (error) {
        console.error(error);
        alert(error.message);
        return null;
    }
}

function processWeatherData(rawData) {
    if (!rawData) return null;
    
    return {
        city: rawData.name,
        condition: rawData.weather[0].main,
        tempC: rawData.main.temp,
        tempF: (rawData.main.temp * 9/5) + 32 // Calculate Fahrenheit
    };
}

function updateDOM(data) {
    if (!data) return;

    currentTempC = data.tempC;
    currentTempF = data.tempF;

    cityNameEl.textContent = data.city;
    weatherConditionEl.textContent = data.condition;
    renderTemperature();

    weatherDisplay.classList.remove('hidden');
}

function renderTemperature() {
    temperatureEl.textContent = isCelsius 
        ? `${Math.round(currentTempC)}°C` 
        : `${Math.round(currentTempF)}°F`;
}

// Toggle event listener
toggleBtn.addEventListener('click', () => {
    isCelsius = !isCelsius;
    renderTemperature();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const location = locationInput.value.trim();
    if (!location) return;

    // Show loading, hide previous results
    weatherDisplay.classList.add('hidden');
    loadingText.classList.remove('hidden');

    const rawData = await fetchWeatherData(location);
    const processedData = processWeatherData(rawData);

    // Hide loading
    loadingText.classList.add('hidden');

    if (processedData) {
        console.log("Processed Data:", processedData); // console.log() it
        updateDOM(processedData);
    }
});