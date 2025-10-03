// Khởi tạo bản đồ
var map = L.map('map').setView([16.047079, 108.206230], 6);

// Layer OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let allMarkers = [];
let globalData = [];

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

// Hàm render marker
function renderMarkers(data) {
  allMarkers.forEach(m => map.removeLayer(m));
  allMarkers = [];

  data.forEach(item => {
    var marker = L.marker([item.lat, item.lon]).addTo(map);
    marker.bindPopup(`
      <b>${item.name}</b><br>
      <i>${item.province}</i><br>
      <p>${item.description || "Chưa có mô tả"}</p>
      <img src="${item.image}" alt="Chưa có ảnh" width="200" /><br>
      <button onclick="openGoogleMapsDirections(${item.lat}, ${item.lon}, '${item.name.replace(/'/g, "\\'")}')">
        Chỉ đường đến đây
      </button>
    `);
    allMarkers.push(marker);
  });
}

// Load dữ liệu JSON
fetch('heritage2.json')
  .then(res => res.json())
  .then(data => {
    globalData = data;
    renderMarkers(data);
    showChart(data);
  });

// Tìm kiếm
function searchData() {
  const keyword = document.getElementById('searchBox').value.toLowerCase();
  const filtered = globalData.filter(item =>
    item.name.toLowerCase().includes(keyword)
  );
  renderMarkers(filtered);
  showChart(filtered);
}

// Biểu đồ
function showChart(data) {
  const counts = {};
  data.forEach(item => {
    let province = item.province || "Không rõ"; // lấy tỉnh từ JSON
    counts[province] = (counts[province] || 0) + 1;
  });

  const ctx = document.getElementById('chart').getContext('2d');
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Số di sản',
        data: Object.values(counts),
        backgroundColor: 'rgba(52, 152, 219, 0.6)'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}