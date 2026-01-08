document.addEventListener('DOMContentLoaded', async function () {
  buscarIp();

  // Obtener IP REAL del navegador al cargar la página
  try {
    const ipReal = await obtenerIpReal();
    dibujarMapa(ipReal);
  } catch (error) {
    console.error('No se pudo obtener la IP real', error);
    dibujarMapa(); // fallback
  }
});

function buscarIp() {
  let boton = document.getElementById('buscar');
  boton.addEventListener('click', () => {
    const ip = document.getElementById('ipBuscar').value.trim();
    dibujarMapa(ip);
  });
}

let map;

function dibujarMapa(ip = '') {
  obtenerDatosIp(ip)
    .then((data) => {
      if (data.status !== 'success') {
        alert('IP desconocida');
        return;
      }

      const options = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: data.timezone,
      };

      const date = new Date();
      const hora = new Intl.DateTimeFormat('en-US', options).format(date);

      dibujarResultado(
        data.query,
        data.city,
        data.region,
        data.zip,
        hora,
        data.isp
      );

      const lat = data.lat;
      const lon = data.lon;

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
        .bindPopup(`${data.city}, ${data.countryCode}`)
        .openPopup();
    })
    .catch((err) => {
      console.error(err);
      alert('Error al obtener datos de la IP');
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

// 👉 IP REAL DEL NAVEGADOR
async function obtenerIpReal() {
  const res = await fetch('https://api.ipify.org?format=json');
  if (!res.ok) {
    throw new Error('No se pudo obtener la IP real');
  }
  const data = await res.json();
  return data.ip;
}

// 👉 TU BACKEND EN RENDER
async function obtenerDatosIp(ip) {
  const response = await fetch(`https://api-ip-t9ap.onrender.com/ip?ip=${ip}`);

  if (!response.ok) {
    throw new Error('Error al obtener los datos');
  }

  return response.json();
}
