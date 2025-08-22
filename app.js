const container = document.getElementById("globe");
const details = document.getElementById("details");
const reloadBtn = document.getElementById("reloadBtn");
const datasetSel = document.getElementById("dataset");
const spinChk = document.getElementById("spin");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 1000);
camera.position.set(0, 0, 260);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const globe = new ThreeGlobe()
  .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-dark.jpg")
  .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
  .showAtmosphere(true)
  .atmosphereColor("#3b82f6")
  .atmosphereAltitude(0.2)
  .pointAltitude("size")
  .pointColor("color")
  .pointsData([])
  .pointLabel(d => d.label || "");

scene.add(globe);

const ambLight = new THREE.AmbientLight(0xffffff, 1.1);
scene.add(ambLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(200, 200, 200);
scene.add(dirLight);

// Rotation
let autoRotateSpeed = 0.0012;
function animate(){
  requestAnimationFrame(animate);
  if(spinChk.checked){
    globe.rotation.y += autoRotateSpeed;
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize
function onResize(){
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener("resize", onResize);

// Farben je nach Stärke
function colorForMag(m){
  if(m >= 5) return "crimson";
  if(m >= 4) return "orange";
  if(m >= 3) return "gold";
  if(m >= 2) return "yellowgreen";
  return "deepskyblue";
}

// Erdbeben laden
async function loadQuakes(){
  details.innerHTML = "Lade Erdbeben...";
  try{
    const res = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson");
    const geo = await res.json();
    const data = geo.features.map(f => {
      const [lon, lat, depth] = f.geometry.coordinates;
      const mag = f.properties.mag || 0;
      return {
        lat, lng: lon,
        size: Math.max(0.4, mag * 0.6),
        color: colorForMag(mag),
        label: `Stärke ${mag.toFixed(1)} | Tiefe ${depth} km | ${new Date(f.properties.time).toLocaleString("de-CH")}`,
        _meta: { mag, depth, place: f.properties.place || "" }
      };
    });
    globe.pointsData(data);
    details.innerHTML = `Zeige ${data.length} Erdbeben.`;
  } catch(e){
    console.error(e);
    details.innerHTML = "Fehler beim Laden.";
  }
}

// Demo-Städte
function loadCities(){
  const data = [
    { name: "Zürich", lat: 47.3769, lng: 8.5417 },
    { name: "Berlin", lat: 52.5200, lng: 13.4050 },
    { name: "New York", lat: 40.7128, lng: -74.0060 },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
    { name: "Baden", lat: 47.4731, lng: 8.3059 }
  ].map(c => ({
    lat: c.lat, lng: c.lng,
    size: 0.9, color: "deepskyblue",
    label: `${c.name}`,
    _meta: { place: c.name }
  }));
  globe.pointsData(data);
  details.innerHTML = "Demo-Städte gesetzt.";
}

// Switcher
async function setDataset(){
  if(datasetSel.value === "quakes") await loadQuakes();
  else loadCities();
}
datasetSel.addEventListener("change", setDataset);
reloadBtn.addEventListener("click", setDataset);

// Init
setTimeout(onResize, 0);
setDataset();