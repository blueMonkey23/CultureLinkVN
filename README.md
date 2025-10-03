🌏 CultureLinkVN
[English README](README.vn.md) | [Tiếng Việt](README.md)
CultureLinkVN is an interactive map application showcasing UNESCO World Heritage Sites in Vietnam.
The project allows users to search, filter by province, view statistics and charts, and get directions to each heritage site.

✨ Features
- 🗺️ Display all UNESCO heritage sites in Vietnam on a Leaflet map.
- 🔍 Search by heritage site name or province/city.
- 🎛️ Filter heritage sites by province.
- 📊 View statistics and interactive charts (powered by Chart.js).
- 📌 Popup markers with detailed information: description, image, Wikipedia/Wikidata links, and a Google Maps directions button.
- 📈 Collapsible statistics panel (drag up/down).
- 📱 Responsive design for both desktop and mobile.

📂 Project Structure
CultureLinkVN/
│

├─ index.html          # Main interface

├─ style.css           # Stylesheet

├─ app.js              # Main logic

├─ README.md

│

├─ data/

│   
├─ heritage.json   # Processed data for the web

│   
├─ query.json      # Raw data from Wikidata

│

├─ scripts/

│   
├─ reFormData.py   # Python script to process JSON

│   
├─ wikiDataQuery.txt # SPARQL query




🚀 Getting Started
1. Clone the repository
git clone https://github.com/<username>/CultureLinkVN.git
cd CultureLinkVN


2. Prepare the data
- Open scripts/wikiDataQuery.txt and copy the SPARQL query.
- Go to Wikidata Query Service, paste the query, and run it.
- Export the results as JSON and save as data/query.json.
- Process the data with Python:
python scripts/reFormData.py
- The processed file data/heritage.json will be generated for the web app.
3. Run the application
- Quick way: open index.html directly in your browser (Chrome/Edge/Firefox).
- Recommended: run a local server for stable JSON loading:
python -m http.server
- Then visit http://localhost:8000.

🖱️ Usage
- Search heritage sites by name or province.
- Filter sites using the dropdown menu.
- Explore statistics and charts.
- Drag the statistics panel up/down to expand or collapse.
- Click "Get Directions" in a popup to open Google Maps navigation.
- To refresh data, repeat step 2.

⚙️ Requirements
- A modern browser supporting ES6 and Geolocation API.
- Python 3 to run the data processing script.
- Internet connection for Leaflet, Chart.js, and Google Maps.

📜 License
MIT License © 2024 CultureLinkVN

📬 Contact
For issues, suggestions, or contributions, please open an issue or pull request on GitHub, or contact the development team via email.
