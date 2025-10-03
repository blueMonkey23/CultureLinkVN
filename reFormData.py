import json

# Mapping thủ công huyện/xã → tỉnh/thành
province_mapping = {
    "Bố Trạch": "Quảng Bình",
    "Minh Hóa": "Quảng Bình",
    "Thạch Thành": "Thanh Hóa",
    "Cát Hải": "Hải Phòng",
    "Tiên Sơn": "Bắc Ninh",
    "Sơn Tây": "Hà Nội",
    "Lam Sơn": "Thanh Hóa",
    "Thanh Oai": "Hà Nội",
    "Vĩnh Hưng A": "Bạc Liêu",
    "Long Biên": "Hà Nội",
    "Duy Xuyên": "Quảng Nam",
    "Thuận Thành": "Bắc Ninh",
}

# Đọc file JSON raw tải từ Wikidata
with open("query2.json", "r", encoding="utf-8") as f:
    raw_data = json.load(f)

simplified = []

for item in raw_data:
    name = item.get("heritageLabel", "")
    coord = item.get("coord", "")
    image = item.get("image", "")
    province = item.get("provinceLabel", "")

    # Normalize province nếu có mapping
    province = province_mapping.get(province, province)

    lat, lon = None, None
    if coord.startswith("Point("):
        coord = coord.replace("Point(", "").replace(")", "")
        lon, lat = map(float, coord.split())

    if lat and lon:
        simplified.append({
            "name": name,
            "lat": lat,
            "lon": lon,
            "province": province,
            "image": image,
            "description": item.get("heritageDescription", "")
        })


# Ghi ra file JSON gọn
with open("heritage2.json", "w", encoding="utf-8") as f:
    json.dump(simplified, f, ensure_ascii=False, indent=2)

print("Đã tạo heritage.json với", len(simplified), "địa điểm UNESCO")
