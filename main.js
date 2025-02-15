document.addEventListener("DOMContentLoaded", function() {
    
  

    dibujarMapa()
    buscarIp()
});

function buscarIp(){
  let boton = document.getElementById('buscar')
  boton.addEventListener('click', ()=>{
    ip= document.getElementById('ipBuscar').value.trim()
    dibujarMapa(ip)
  })
}
let map;


function dibujarMapa(ip) {
  if (!ip) {
    ip = ""
  }
  obtenerDatosIp(ip).then(data => {
    if (data.status!="success") {
      alert("ip desconocida")
    }else{
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: data.timezone
      };
      
      let date = new Date();
      let hora = new Intl.DateTimeFormat('en-US', options).format(date);
      
      dibujarResultado(data.query, data.city, data.region, data.zip, hora, data.isp)
     
      
        const lat = data.lat;
          const lon = data.lon;
          
          if (map) {
            map.remove();
          }
          map = L.map("map").setView([lat, lon], 10);
    
          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);
    
          L.marker([lat, lon]).addTo(map).bindPopup(`${data.city}, ${data.countryCode}`).openPopup();
    }
  });
  
  
}

function dibujarResultado(ip, lugar, region, postal, hora, isp) {
  document.getElementById('ip').textContent = ip
  document.getElementById('lugar').textContent = lugar+","+ region +" " +postal
  document.getElementById('hora').textContent = hora
  document.getElementById('isp').textContent = isp
  document.getElementById('ipBuscar').value = ip
}

async function obtenerDatosIp(ip) {
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  if (!response.ok) {
      throw new Error('Error al obtener los datos');
  }
  return response.json();
}