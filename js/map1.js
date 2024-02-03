mapboxgl.accessToken = 
'pk.eyJ1Ijoid2VuZHlidSIsImEiOiJjbG9vdWx2OHAwMXQxMmxtdW54NjN2ODh0In0.xeRw89y7CM7QdOHO896jYg';

let map = new mapboxgl.Map({
    container: 'choroplethMap', 
    style: 'mapbox://styles/wendybu/cls49c3k800ec01pvgkyi5px1', 
    zoom: 4,
    center: [-98.5795, 39.8283] 
});

map.on('load', function () {
    fetch('assets/us-covid-2020-rates.json') 
    .then(response => response.json())
    .then(data => {
        map.addSource('rates-data', {
            type: 'geojson',
            data: data
        });

        map.addLayer({
            'id': 'rates',
            'type': 'fill',
            'source': 'rates-data',
            'paint': {
                'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'rates'],
                    0, '#f1eef6',
                    60, '#c994c7',
                    120, '#df65b0',
                    180, '#e7298a',
                    250, '#ce1256'
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });

        const layers = [
            '0-59', '60-119', '120-179', '180-249', '250+'
        ];
        const colors = [
            '#f1eef6', '#c994c7', '#df65b0', '#e7298a', '#ce1256'
        ];
        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>Covid Rates<br>(cases per thousand residents)</b><br><br>";

        layers.forEach((layer, i) => {
            const color = colors[i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);

        });
        legend.innerHTML = legend.innerHTML + '<p style="text-align: right; font-size:10pt">Source: <a href="https://data.census.gov/table/ACSDP5Y2018.DP05?g=0100000US$050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&hidePreview=true">U.S. Census</a ></p >';
            });


        map.on('mousemove', 'rates', function(e) {
            const properties = e.features.length > 0 ? e.features[0].properties : null;
            if (properties) {
                document.getElementById('text-description').innerHTML = `<h3>${properties.county}, ${properties.state}</h3><p>Rates: <strong>${properties.rates}</strong></p>`;
            }
        });

        map.on('mouseleave', 'rates', function() {
            document.getElementById('text-description').innerHTML = '<p>Hover over a county!</p>';
        });
    })
    .catch(error => console.error('Error loading the GeoJSON data: ', error));


