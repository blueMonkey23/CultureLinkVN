/*
  Copyright (c) 2024 CultureLinkVN
  License: MIT
*/

// Khởi tạo bản đồ
var map = L.map('map').setView([16.047079, 108.206230], 6);

// Layer OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let allMarkers = [];
let globalData = [];
let heritageData = [];
let museumData = [];

// --- Tạo icon riêng cho museum và heritage ---
const museumIcon = L.icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const heritageIcon = L.icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Hàm render marker
function renderMarkers(data) {
  allMarkers.forEach(m => map.removeLayer(m));
  allMarkers = [];

  data.forEach(item => {
    let icon = item.type === 'museum' ? museumIcon : heritageIcon;
    var marker = L.marker([item.lat, item.lon], {icon}).addTo(map);
    marker.bindPopup(`
      <b>${item.name}</b><br>
      <span style="color:${item.type === 'museum' ? '#2980b9' : '#16a085'}">
        <b>${item.type === 'museum' ? 'Bảo tàng' : 'Di sản'}</b>
      </span><br>
      <i>${item.province}</i><br>
      <p>${item.description || "Chưa có mô tả"}</p>
      <img src="${item.image}" alt="Chưa có ảnh" width="200" /><br>
      ${
        item.wikipedia
          ? `<a href="${item.wikipedia}" target="_blank">Xem trên Wikipedia</a>`
          : (item.heritage ? `<a href="${item.heritage}" target="_blank">Xem trên Wikidata</a>` : "")
      }
      <button onclick="openGoogleMapsDirections(${item.lat}, ${item.lon}, '${item.name.replace(/'/g, "\\'")}')">
        Chỉ đường đến đây
      </button>
    `);
    allMarkers.push(marker);
  });
}

// Load dữ liệu JSON
fetch('data/heritage.json')
  .then(res => res.json())
  .then(data => {
    heritageData = data.map(item => ({...item, type: 'heritage'}));
    fetch('data/museums.json')
      .then(res => res.json())
      .then(museums => {
        museumData = museums.map(item => ({...item, type: 'museum'}));
        globalData = heritageData.concat(museumData);
        renderMarkers(globalData);
        showChart(globalData);
        updateStats(globalData);
        populateProvinceFilter(globalData);
      });
  });

// Hàm mở Google Maps để chỉ đường
function openGoogleMapsDirections(lat, lng, locationName) {
  // Lấy vị trí hiện tại của người dùng
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const origin = `${position.coords.latitude},${position.coords.longitude}`;
      const destination = `${lat},${lng}`;
      
      // Tạo URL chỉ đường Google Maps
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&destination_place_id=${locationName}`;
      
      // Mở trong tab mới
      window.open(url, '_blank');
    }, () => {
      // Nếu không lấy được vị trí, chỉ mở địa điểm đích
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${locationName}`;
      window.open(url, '_blank');
    });
  } else {
    // Nếu trình duyệt không hỗ trợ geolocation
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${locationName}`;
    window.open(url, '_blank');
  }
}

function populateProvinceFilter(data) {
  const provinces = [...new Set(data.map(item => item.province))].sort();
  const select = document.getElementById('provinceFilter');
  provinces.forEach(prov => {
    let opt = document.createElement("option");
    opt.value = prov;
    opt.text = prov;
    select.add(opt);
  });
}

function filterByProvince() {
  const selected = document.getElementById('provinceFilter').value;
  let filtered = globalData;
  if (selected !== "all") {
    filtered = globalData.filter(item => item.province === selected);
  }
  renderMarkers(filtered);
  showChart(filtered);
  updateStats(filtered);
}

function updateStats(data) {
  const heritageCount = data.filter(i => i.type === 'heritage').length;
  const museumCount = data.filter(i => i.type === 'museum').length;
  document.getElementById('stats').innerText =
    `Tổng số di sản: ${heritageCount} | Tổng số bảo tàng: ${museumCount} | Tổng cộng: ${data.length}`;
}


// Tìm kiếm
function searchData() {
  const keyword = document.getElementById('searchBox').value.toLowerCase();
  const filtered = globalData.filter(item =>
    item.name.toLowerCase().includes(keyword) ||
    item.province.toLowerCase().includes(keyword)
  );
  renderMarkers(filtered);
  showChart(filtered);
  updateStats(filtered);
}

// Biểu đồ
function showChart(data) {
  // Thống kê số heritage và museum theo tỉnh
  const heritageCounts = {};
  const museumCounts = {};
  data.forEach(item => {
    let province = item.province || "Không rõ";
    if (item.type === 'heritage')
      heritageCounts[province] = (heritageCounts[province] || 0) + 1;
    else if (item.type === 'museum')
      museumCounts[province] = (museumCounts[province] || 0) + 1;
  });

  const provinces = Array.from(new Set([...Object.keys(heritageCounts), ...Object.keys(museumCounts)]));

  const ctx = document.getElementById('chart').getContext('2d');
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: provinces,
      datasets: [
        {
          label: 'Di sản',
          data: provinces.map(p => heritageCounts[p] || 0),
          backgroundColor: 'rgba(22, 160, 133, 0.6)'
        },
        {
          label: 'Bảo tàng',
          data: provinces.map(p => museumCounts[p] || 0),
          backgroundColor: 'rgba(52, 152, 219, 0.6)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
      scales: {
        x: { ticks: { autoSkip: false } }
      }
    }
  });
}

function updateMapHeight() {
  if (bottomPanel.style.display === 'none') {
    document.getElementById('map').style.height = '100vh';
    resizeHandle.style.display = 'none';
  } else {
    document.getElementById('map').style.height =
      'calc(100vh - ' + bottomPanel.offsetHeight + 'px)';
    resizeHandle.style.display = '';
    // Đặt vị trí thanh kéo ngay trên panel
    resizeHandle.style.bottom = bottomPanel.offsetHeight + 'px';
  }
  map.invalidateSize();
}

// --- Resize bottomPanel bằng chuột ---
const bottomPanel = document.getElementById('bottomPanel');
const resizeHandle = document.getElementById('resizeHandle');
let isResizing = false;
let startY = 0;
let startHeight = 0;

resizeHandle.addEventListener('mousedown', function(e) {
  isResizing = true;
  startY = e.clientY;
  startHeight = bottomPanel.offsetHeight;
  document.body.style.cursor = 'ns-resize';
});

document.addEventListener('mousemove', function(e) {
  if (!isResizing) return;
  let dy = startY - e.clientY;
  let newHeight = startHeight + dy;
  // Giới hạn min/max
  let minHeight = window.innerHeight * 0.2;
  let maxHeight = window.innerHeight * 0.8;
  newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
  bottomPanel.style.height = newHeight + 'px';
  resizeHandle.style.bottom = newHeight + 'px';
  updateMapHeight();
});

document.addEventListener('mouseup', function() {
  if (isResizing) {
    isResizing = false;
    document.body.style.cursor = '';
  }
});

// Khi resize window thì cập nhật lại vị trí resizeHandle
window.addEventListener('resize', function() {
  updateMapHeight();
});

// Khởi tạo vị trí resizeHandle khi load
window.addEventListener('DOMContentLoaded', function() {
  updateMapHeight();
});

// Xử lý hiện/ẩn panel
const togglePanelBtn = document.getElementById('togglePanelBtn');
togglePanelBtn.addEventListener('click', function() {
  const isHidden = bottomPanel.style.display === 'none';
  if (isHidden) {
    bottomPanel.style.display = '';
    // Đảm bảo resizeHandle hiện lại ngay khi panel hiện
    resizeHandle.style.display = '';
    updateMapHeight();
  } else {
    bottomPanel.style.display = 'none';
    resizeHandle.style.display = 'none';
    updateMapHeight();
  }
});