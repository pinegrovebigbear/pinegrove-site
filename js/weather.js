document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('current-weather');
  if (!el) return;

  // Upper Moonridge (Cascade) PWS — station KCABIGBE39, elev. 7,425 ft.
  // General neighborhood coordinates, not tied to a specific address.
  var url = 'https://api.open-meteo.com/v1/forecast' +
    '?latitude=34.23&longitude=-116.84&elevation=2264' +
    '&current=temperature_2m,weather_code' +
    '&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles';

  var codes = {
    0: 'clear skies', 1: 'mostly clear', 2: 'partly cloudy', 3: 'overcast',
    45: 'fog', 48: 'fog',
    51: 'light drizzle', 53: 'drizzle', 55: 'heavy drizzle',
    61: 'light rain', 63: 'rain', 65: 'heavy rain',
    71: 'light snow', 73: 'snow', 75: 'heavy snow', 77: 'snow grains',
    80: 'rain showers', 81: 'rain showers', 82: 'heavy showers',
    85: 'snow showers', 86: 'heavy snow showers',
    95: 'thunderstorm', 96: 'thunderstorm', 99: 'thunderstorm'
  };

  var controller = ('AbortController' in window) ? new AbortController() : null;
  var timeoutId = controller && setTimeout(function () { controller.abort(); }, 6000);

  fetch(url, controller ? { signal: controller.signal } : undefined)
    .then(function (r) { timeoutId && clearTimeout(timeoutId); return r.ok ? r.json() : Promise.reject(); })
    .then(function (data) {
      var c = data && data.current;
      if (!c || typeof c.temperature_2m !== 'number') return Promise.reject();
      var desc = codes[c.weather_code] || 'current conditions';
      el.textContent = 'Right now in upper Moonridge: ' + Math.round(c.temperature_2m) + '°F, ' + desc;
    })
    .catch(function () {
      // Fails quietly — the "Full forecast" link next to this stays as the fallback.
      el.textContent = 'Live conditions unavailable right now';
    });
});
