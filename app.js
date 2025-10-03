// Khởi tạo bản đồ
var map = L.map('map').setView([16.047079, 108.206230], 6);

// Layer OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let allMarkers = [];
let globalData = [];

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
  <img src="${item.image}" alt="Chưa có ảnh" width="200" />
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
    updateStats(data);
    populateProvinceFilter(data);
  });

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
  document.getElementById('stats').innerText = 
    "Tổng số di sản: " + data.length;
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
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
    x: {
      ticks: { autoSkip: false }  // để không bị ẩn nhãn khi hẹp
    }
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

