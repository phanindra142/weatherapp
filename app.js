
let tempChartInstance = null;
let weatherChartInstance = null;
let currentTempCelsius = null;
let isCelsius = true;


const chartColors = {
    Clear: {
        max: '#f4a261',
        maxBg: 'rgba(244, 162, 97, 0.2)',
        min: '#2a9d8f',
        minBg: 'rgba(42, 157, 143, 0.2)',
        pie: ['rgba(244, 162, 97, 0.7)', 'rgba(168, 168, 168, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(173, 216, 230, 0.7)', 'rgba(42, 157, 143, 0.7)']
    },
    Rain: {
        max: '#4d96ff',
        maxBg: 'rgba(77, 150, 255, 0.2)',
        min: '#1e6091',
        minBg: 'rgba(30, 96, 145, 0.2)',
        pie: ['rgba(54, 162, 235, 0.7)', 'rgba(168, 168, 168, 0.7)', 'rgba(244, 162, 97, 0.7)', 'rgba(173, 216, 230, 0.7)', 'rgba(42, 157, 143, 0.7)']
    },
    Clouds: {
        max: '#a8a8a8',
        maxBg: 'rgba(168, 168, 168, 0.2)',
        min: '#6c757d',
        minBg: 'rgba(108, 117, 125, 0.2)',
        pie: ['rgba(168, 168, 168, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(244, 162, 97, 0.7)', 'rgba(173, 216, 230, 0.7)', 'rgba(42, 157, 143, 0.7)']
    },
    Snow: {
        max: '#add8e6',
        maxBg: 'rgba(173, 216, 230, 0.2)',
        min: '#468faf',
        minBg: 'rgba(70, 143, 175, 0.2)',
        pie: ['rgba(173, 216, 230, 0.7)', 'rgba(168, 168, 168, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(244, 162, 97, 0.7)', 'rgba(42, 157, 143, 0.7)']
    },
    Default: {
        max: '#ff6b6b',
        maxBg: 'rgba(255,107,107,0.2)',
        min: '#4d96ff',
        minBg: 'rgba(77,150,255,0.2)',
        pie: ['rgba(255, 206, 86, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(75, 192, 192, 0.7)']
    }
};

document.addEventListener("DOMContentLoaded", () => {
   
    const searchBtn = document.getElementById("search-btn");
    const locationBtn = document.getElementById("location-btn");
    const cityInput = document.getElementById("city-input");

    const cityNameElem = document.getElementById("city-name");
    const weatherIconElem = document.getElementById("weather-icon");
    const temperatureElem = document.getElementById("temperature");
    const descriptionElem = document.getElementById("description");
    const humidityElem = document.getElementById("humidity");
    const windElem = document.getElementById("wind");
    const weatherInfoElem = document.getElementById("weather-info");

    const errorMessageElem = document.getElementById("error-message");
    const loadingSpinnerElem = document.getElementById("loading-spinner");

   
    const canvas = document.getElementById("weather-canvas");
    const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
    let animationId;
    let particles = [];

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function clearAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = [];
    }

    function startRainAnimation() {
        if (!ctx) return;
        clearAnimation();
        const dropCount = 250;
        const windAngle = 2;
        for (let i = 0; i < dropCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                length: Math.random() * 25 + 15,
                speed: Math.random() * 5 + 5,
                opacity: Math.random() * 0.3 + 0.7
            });
        }
        function drawRain() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 2;
            for (let p of particles) {
                const dropColor = `rgba(200, 200, 255, ${p.opacity})`;
                ctx.strokeStyle = dropColor;
                ctx.shadowBlur = 5;
                ctx.shadowColor = dropColor;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + windAngle, p.y + p.length);
                ctx.stroke();
                p.y += p.speed;
                p.x += windAngle * 0.2;
                if (p.y > canvas.height || p.x > canvas.width) {
                    p.x = Math.random() * canvas.width;
                    p.y = -p.length;
                    p.opacity = Math.random() * 0.3 + 0.7;
                }
            }
            ctx.shadowBlur = 0;
            animationId = requestAnimationFrame(drawRain);
        }
        drawRain();
    }

    function startSnowAnimation() {
        if (!ctx) return;
        clearAnimation();
        const flakeCount = 120;
        for (let i = 0; i < flakeCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 4 + 2,
                d: Math.random() + 1,
                sway: Math.random() * 2 - 1
            });
        }
        function drawSnow() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            for (let p of particles) {
                ctx.beginPath();
                ctx.shadowBlur = 8;
                ctx.shadowColor = "white";
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                p.y += Math.pow(p.d, 2) + 0.5;
                p.x += Math.sin(p.y * 0.01) * p.sway;
                if (p.y > canvas.height) {
                    p.x = Math.random() * canvas.width;
                    p.y = 0;
                }
            }
            ctx.shadowBlur = 0;
            animationId = requestAnimationFrame(drawSnow);
        }
        drawSnow();
    }

    function startCloudAnimation() {
        if (!ctx) return;
        clearAnimation();
        const cloudCount = 6;
        for (let i = 0; i < cloudCount; i++) {
            const w = 180 + Math.random() * 100;
            const h = 80 + Math.random() * 40;
            const baseSpeed = 1.2 - (w / 400);
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height / 2),
                w: w,
                h: h,
                speed: baseSpeed + Math.random() * 0.2,
                opacity: 0.3 + Math.random() * 0.4
            });
        }
        function drawClouds() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let p of particles) {
                ctx.beginPath();
                ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
                ctx.shadowBlur = 50;
                ctx.shadowColor = "white";
                ctx.ellipse(p.x, p.y, p.w, p.h, 0, 0, Math.PI * 2);
                ctx.fill();
                p.x += p.speed;
                if (p.x > canvas.width + p.w) {
                    p.x = -p.w;
                    p.y = Math.random() * (canvas.height / 2);
                }
            }
            ctx.shadowBlur = 0;
            animationId = requestAnimationFrame(drawClouds);
        }
        drawClouds();
    }

    function showLoading(show) {
        loadingSpinnerElem.style.display = show ? "block" : "none";
    }

    function showError(message) {
        document.getElementById("error-text").textContent = message;
        errorMessageElem.style.display = "flex";
        errorMessageElem.classList.remove("hidden");
    }

    document.querySelector(".close-error").addEventListener("click", () => {
        errorMessageElem.classList.add("hidden");
        setTimeout(() => {
            errorMessageElem.style.display = "none";
            errorMessageElem.classList.remove("hidden");
        }, 300);
    });

 
    async function fetchWeatherByCity(city) {
        showLoading(true);
        errorMessageElem.style.display = "none";
        weatherInfoElem.style.display = "none";
        document.getElementById("forecast").style.display = "none";
        try {
            const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
            const currentRes = await fetch(currentUrl);
            if (!currentRes.ok) {
                const txt = await currentRes.text().catch(() => currentRes.statusText);
                console.error("fetchWeatherByCity error:", currentRes.status, txt);
                showError("City not found. Please try again.");
                return;
            }
            const currentData = await currentRes.json();
            displayWeather(currentData);
            const forecastData = await fetchForecast(currentData.coord.lat, currentData.coord.lon);
            if (forecastData) displayForecast(forecastData, currentData.weather[0].main);
        } catch (err) {
            console.error("fetchWeatherByCity catch:", err);
            showError("Failed to fetch weather. Check your connection.");
        } finally {
            showLoading(false);
        }
    }

    
    async function fetchWeatherByCoords(lat, lon) {
        showLoading(true);
        errorMessageElem.style.display = "none";
        weatherInfoElem.style.display = "none";
        document.getElementById("forecast").style.display = "none";
        try {
            const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            const currentRes = await fetch(currentUrl);
            if (!currentRes.ok) {
                console.error("fetchWeatherByCoords status:", currentRes.status);
                showError("Unable to fetch weather for your location.");
                return;
            }
            const currentData = await currentRes.json();
            displayWeather(currentData);
            const forecastData = await fetchForecast(lat, lon);
            if (forecastData) displayForecast(forecastData, currentData.weather[0].main);
        } catch (err) {
            console.error("fetchWeatherByCoords catch:", err);
            showError("Location access denied or API error.");
        } finally {
            showLoading(false);
        }
    }

    function displayWeather(data) {
        cityNameElem.textContent = `${data.name}, ${data.sys.country}`;
       
let localTimeElem = document.getElementById("local-time");
if (!localTimeElem) {
    localTimeElem = document.createElement("p");
    localTimeElem.id = "local-time";
    localTimeElem.style.margin = "0";
    localTimeElem.style.fontSize = "0.9em";
    localTimeElem.style.color = "#555";
    cityNameElem.parentNode.insertBefore(localTimeElem, descriptionElem);
}

function updateLocalTime() {
    
    const now = new Date();

   
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);

   
    const cityTime = new Date(utc + data.timezone * 1000);


    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    localTimeElem.textContent = `Local Time: ${cityTime.toLocaleTimeString([], options)}`;
}



updateLocalTime();


if (window.localTimeInterval) clearInterval(window.localTimeInterval);
window.localTimeInterval = setInterval(updateLocalTime, 1000);

        weatherIconElem.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
       currentTempCelsius = data.main.temp; 
document.getElementById("temperature").innerText = `${Math.round(currentTempCelsius)}°C`;

        descriptionElem.textContent = data.weather[0].description;
        humidityElem.textContent = `${data.main.humidity}%`;
        windElem.textContent = `${data.wind.speed} km/h`;

        document.getElementById("feels-like").textContent = Math.round(data.main.feels_like);
       
document.querySelectorAll(".temp-value").forEach(el => {
    let val = parseFloat(el.textContent);
    el.classList.remove("cold", "warm", "hot");
    if (val <= 15) el.classList.add("cold");
    else if (val <= 28) el.classList.add("warm");
    else el.classList.add("hot");
});

        document.getElementById("min-temp").textContent = Math.round(data.main.temp_min);
        document.getElementById("max-temp").textContent = Math.round(data.main.temp_max);
        document.getElementById("pressure").textContent = data.main.pressure;

        document.getElementById("sunrise").textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        document.getElementById("sunset").textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();

        weatherInfoElem.style.display = "block";
        weatherInfoElem.classList.remove("fade-in");
        void weatherInfoElem.offsetWidth;
        weatherInfoElem.classList.add("fade-in");

        const mainWeather = data.weather[0].main.toLowerCase();
        document.body.className = "default-weather";
        if (mainWeather.includes("clear")) document.body.className = "clear-sky";
        else if (mainWeather.includes("rain")) document.body.className = "rainy";
        else if (mainWeather.includes("snow")) document.body.className = "snowy";
        else if (mainWeather.includes("cloud")) document.body.className = "cloudy";

        if (mainWeather.includes("rain")) startRainAnimation();
        else if (mainWeather.includes("snow")) startSnowAnimation();
        else if (mainWeather.includes("cloud")) startCloudAnimation();
        else clearAnimation();
    }

   
    searchBtn.addEventListener("click", () => {
        const city = cityInput.value.trim();
        if (city) fetchWeatherByCity(city);
    });

    locationBtn.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoords(latitude, longitude);
                },
                () => alert("Location access denied. Please enable it.")
            );
        } else alert("Geolocation is not supported by your browser");
    });
   
let currentUnit = 'C';

document.getElementById('unit-toggle').addEventListener('click', () => {
    const tempElem = document.getElementById("temperature");
    let tempValue = parseFloat(tempElem.textContent);

    if (currentUnit === 'C') {
       
        tempElem.textContent = `${Math.round((tempValue * 9/5) + 32)}°F`;
        currentUnit = 'F';
        document.getElementById('unit-toggle').textContent = "Show in °C";
    } else {
       
        tempElem.textContent = `${Math.round((tempValue - 32) * 5/9)}°C`;
        currentUnit = 'C';
        document.getElementById('unit-toggle').textContent = "Show in °F";
    }
});
document.getElementById("share-weather").addEventListener("click", () => {
    if (!currentTempCelsius || !cityNameElem.textContent) {
        alert("No weather data to share yet!");
        return;
    }
    
    const city = cityNameElem.textContent;
    const temp = isCelsius 
        ? `${Math.round(currentTempCelsius)}°C` 
        : `${Math.round((currentTempCelsius * 9/5) + 32)}°F`;
    const description = descriptionElem.textContent;
    
    const message = `🌤️ Weather in ${city}: ${temp}, ${description}. Stay safe!`;
    
  
    const choice = confirm("Click OK to share on WhatsApp, Cancel to share on Twitter.");
    if (choice) {
      
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`);
    } else {
      
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`);
    }
});


});
function initWeatherMap() {
    const mapSection = document.getElementById("map-section");
    mapSection.style.display = "block";

    const map = L.map('weather-map').setView([20, 0], 2);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const tempLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`);
    const cloudsLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`);
    const precipLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`);
    const windLayer = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`);

    
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'map-legend');
        div.innerHTML = `<strong>Legend</strong><br>Select a layer to see details.`;
        return div;
    };

    legend.addTo(map);

    function updateLegend(layerName) {
        const div = document.querySelector('.map-legend');
        if (!div) return;
        let html = `<strong>${layerName} Legend</strong><br>`;
        switch (layerName) {
            case 'Temperature':
                html += `<div style="background: linear-gradient(to right, blue, cyan, yellow, orange, red); height: 12px; margin: 4px 0;"></div>
                         <small>Cold → Warm → Hot</small>`;
                break;
            case 'Clouds':
                html += `<div style="background: linear-gradient(to right, white, lightgray, gray, black); height: 12px; margin: 4px 0;"></div>
                         <small>Clear → Overcast</small>`;
                break;
            case 'Precipitation':
                html += `<div style="background: linear-gradient(to right, lightblue, blue, darkblue); height: 12px; margin: 4px 0;"></div>
                         <small>Light → Heavy Rain</small>`;
                break;
            case 'Wind':
                html += `<div style="background: linear-gradient(to right, lightgreen, yellow, orange, red, purple); height: 12px; margin: 4px 0;"></div>
                         <small>Low → High Speed</small>`;
                break;
            default:
                html += `No legend available.`;
        }
        div.innerHTML = html;
    }

    const layers = {
        "Temperature": tempLayer,
        "Clouds": cloudsLayer,
        "Precipitation": precipLayer,
        "Wind": windLayer
    };

    L.control.layers(layers).addTo(map);

    tempLayer.addTo(map);
    updateLegend("Temperature");

    map.on('baselayerchange', function (e) {
        updateLegend(e.name);
    });

    setTimeout(() => map.invalidateSize(), 500);
}





async function fetchForecast(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const res = await fetch(url);
        if (!res.ok) {
            console.error("fetchForecast status:", res.status);
            return null;
        }
        const data = await res.json();
        return data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
    } catch (err) {
        console.error("fetchForecast error:", err);
        return null;
    }
}

function displayForecast(forecastData, weatherType) {
    const forecastContainer = document.getElementById("forecast");
    const forecastItems = document.getElementById("forecast-items");
    const chartsSection = document.getElementById("charts-section");
    if (!forecastItems) return;
    forecastItems.innerHTML = "";

    const colors = chartColors[weatherType] || chartColors.Default;

    let days = [];
    let maxTemps = [];
    let minTemps = [];
    let weatherCounts = {};

    forecastData.forEach((item, index) => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString("en-US", { weekday: "short" });
        const icon = item.weather[0].icon;
        const tempMax = Math.round(item.main.temp_max);
        const tempMin = Math.round(item.main.temp_min);
        const weatherTypeDay = item.weather[0].main;

        days.push(day);
        maxTemps.push(tempMax);
        minTemps.push(tempMin);
        weatherCounts[weatherTypeDay] = (weatherCounts[weatherTypeDay] || 0) + 1;

        const card = document.createElement("div");
        card.className = "forecast-card fade-in";
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="forecast-day">${day}</div>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${item.weather[0].description}">
            <div class="forecast-temp">${tempMax}° / ${tempMin}°</div>
        `;
        forecastItems.appendChild(card);
    });

    forecastContainer.style.display = "block";
    chartsSection.style.display = "block";
    setTimeout(() => chartsSection.classList.add("show"), 50);

    const tempCtx = document.getElementById("tempChart").getContext("2d");
    if (tempChartInstance) tempChartInstance.destroy();
    tempChartInstance = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'Max Temp (°C)',
                    data: maxTemps,
                    borderColor: colors.max,
                    backgroundColor: colors.maxBg,
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Min Temp (°C)',
                    data: minTemps,
                    borderColor: colors.min,
                    backgroundColor: colors.minBg,
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top' } },
            animation: { duration: 1200, easing: 'easeOutQuart' }
        }
    });

    const weatherCtx = document.getElementById("weatherChart").getContext("2d");
    if (weatherChartInstance) weatherChartInstance.destroy();
    weatherChartInstance = new Chart(weatherCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(weatherCounts),
            datasets: [{
                label: 'Weather Types',
                data: Object.values(weatherCounts),
                backgroundColor: colors.pie,
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } },
            animation: { duration: 1200, easing: 'easeOutQuart' }
        }
    });

    document.getElementById("dashboard").style.display = "grid";

    initWeatherMap();
}
