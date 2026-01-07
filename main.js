document.addEventListener('DOMContentLoaded', function () {
  dibujarMapa();
  buscarIp();
});

function buscarIp() {
  const boton = document.getElementById('buscar');
  boton.addEventListener('click', () => {
    const ip = document.getElementById('ipBuscar').value.trim();
    dibujarMapa(ip);
  });
}

let map;

function dibujarMapa(ip = '') {
  obtenerDatosIp(ip)
    .then((data) => {
      // Hora local (evitamos error de timezone)
      const options = {
        hour: '2-digit',
        minute: '2-digit',
      };

      const date = new Date();
      const hora = new Intl.DateTimeFormat('en-US', options).format(date);

      dibujarResultado(
        data.ip,
        data.location.city,
        data.location.region,
        data.location.postalCode || 'N/A',
        hora,
        data.isp
      );

      const lat = data.location.lat;
      const lon = data.location.lng;

      if (map) {
        map.remove();
      }

      map = L.map('map').setView([lat, lon], 10);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`${data.location.city}, ${data.location.country}`)
        .openPopup();
    })
    .catch((error) => {
      console.error(error);
      alert('IP inválida o error en la API');
    });
}

function dibujarResultado(ip, lugar, region, postal, hora, isp) {
  document.getElementById('ip').textContent = ip;
  document.getElementById(
    'lugar'
  ).textContent = `${lugar}, ${region} ${postal}`;
  document.getElementById('hora').textContent = hora;
  document.getElementById('isp').textContent = isp;
  document.getElementById('ipBuscar').value = ip;
}

// ===================== API =====================

const API_KEY = 'at_Br5PLhdmayiBOF5A3gVdIpxmvkxGA';

async function obtenerDatosIp(ip = '') {
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ip}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Error al obtener los datos');
  }

  return response.json();
}
