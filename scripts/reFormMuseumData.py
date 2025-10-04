# Copyright (c) 2024 CultureLinkVN
# License: MIT

import json

province_mapping = {
    "Duy Xuyên": "Quảng Nam",
    "Sơn Tây": "Hà Nội",
    "Long Biên": "Hà Nội",
    "Thành phố Hồ Chí Minh": "TP.HCM",
    "Thành phố Huế": "Thừa Thiên Huế",
    "TP Hạ Long": "Quảng Ninh",
    "Thuận Thành": "Bắc Ninh",
    "Hoàn Kiếm": "Hà Nội",
    "Hội An": "Quảng Nam",
    "Nha Trang": "Khánh Hòa",

}

with open("data/queryMuseum.json", "r", encoding="utf-8") as f:
    raw_data = json.load(f)

simplified = []
for item in raw_data:
    name = item.get("museumLabel", "")
    coord = item.get("coord", "")
    image = item.get("image", "")
    province = item.get("provinceLabel", "")
    province = province_mapping.get(province, province)
    description = item.get("museumDescriptionFinal", "")
    heritage = item.get("museum", "")
    wikipedia = f"https://vi.wikipedia.org/wiki/{name.replace(' ', '_')}" if name else ""

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
            "description": description,
            "heritage": heritage,
            "wikipedia": wikipedia
        })

with open("data/museums.json", "w", encoding="utf-8") as f:
    json.dump(simplified, f, ensure_ascii=False, indent=2)

print("✅ museums.json created with", len(simplified), "museum entries.")