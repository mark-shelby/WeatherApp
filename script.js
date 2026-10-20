const API_KEY = 'E75C6CJNDKR7FJH7XCYDNRGXH'; // Make sure your exact key is here

// DOM Elements
const form = document.getElementById('weather-form');
const locationInput = document.getElementById('location-input');
const loadingText = document.getElementById('loading');
const weatherDisplay = document.getElementById('weather-display');
const cityNameEl = document.getElementById('city-name');
const weatherConditionEl = document.getElementById('weather-condition');
const temperatureEl = document.getElementById('temperature');
const toggleBtn = document.getElementById('toggle-temp');

let currentTempF = 0;
let currentTempC = 0;
let isCelsius = true;

async function fetchWeatherData(location) {
    // Using Visual Crossing API
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`, { mode: 'cors' });
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} - Please check city name , DB doesn't contain ${location}.`);
    }
    
    return await response.json();
}

function processWeatherData(rawData) {
    const tempF = rawData.currentConditions.temp;
    const tempC = (tempF - 32) * (5/9); 
    
    return {
        city: rawData.resolvedAddress,
        condition: rawData.currentConditions.conditions,
        tempF: tempF,
        tempC: tempC
    };
}

function updateDOM(data) {
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

toggleBtn.addEventListener('click', () => {
    isCelsius = !isCelsius;
    renderTemperature();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const location = locationInput.value.trim();
    if (!location) return;

    // Reset UI
    weatherDisplay.classList.add('hidden');
    loadingText.textContent = 'Fetching weather data...';
    loadingText.style.color = '#666'; // 
    loadingText.classList.remove('hidden');

    try {
        const rawData = await fetchWeatherData(location);
        const processedData = processWeatherData(rawData);
        updateDOM(processedData);
        loadingText.classList.add('hidden'); // Hide loading only on success
    } catch (error) {
        console.error("Caught an error:", error);
        loadingText.textContent = `${error.message}`;
        loadingText.style.color = 'red';
    }
});