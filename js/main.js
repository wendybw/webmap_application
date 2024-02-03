mapboxgl.accessToken = 'pk.eyJ1Ijoid2VuZHlidSIsImEiOiJjbG9vdWx2OHAwMXQxMmxtdW54NjN2ODh0In0.xeRw89y7CM7QdOHO896jYg';
let map = new mapboxgl.Map({
    container: 'proportionMap', 
    style: 'mapbox://styles/wendybu/cls59o7fn00f001r632pn8ubj', 
    zoom: 4,
    center: [-98.5795, 39.8283] 
});

const grades = [1, 542, 1182, 2314, 5454, 756412], 
      colors = ['rgb(208,209,230)', 'rgb(103,169,207)', 'rgb(1,108,89)', '#FD8D3C', '#FC4E2A', '#BD0026'], 
      radii = [5, 10, 15, 20, 25, 30]; 

map.on('load', () => {
    map.addSource('counts-data', { 
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.geojson'
    });
    map.addLayer({
        'id': 'counts',
        'type': 'circle',
        'source': 'counts-data',
        'paint': {
            // increase the radii of the circle as the zoom level and dbh value increases
            'circle-radius': {
                'property': 'cases',
                'stops': [
                    [grades[0], radii[0]],
                    [grades[1], radii[1]],
                    [grades[2], radii[2]],
                    [grades[3], radii[3]],
                    [grades[4], radii[4]],
                    [grades[5], radii[5]],

                ]
            },
            'circle-color': {
                'property': 'cases',
                'stops': [
                    [grades[0], colors[0]],
                    [grades[1], colors[1]],
                    [grades[2], colors[2]],
                    [grades[3], colors[3]],
                    [grades[4], colors[4]],
                    [grades[5], colors[5]]
                ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.6
        }
    }
);


    map.on('click', 'counts', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>Cases:</strong> ${event.features[0].properties.cases}`)
            .addTo(map);
    });
});

const legend = document.getElementById('legend');
var labels = ['<strong>Number of Cases</strong>'], 
    vbreak;
for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    dot_radii = 2 * radii[i]; 
    labels.push(
        `<p class="break"><i class="dot" style="background:${colors[i]}; width:${dot_radii}px; height:${dot_radii}px;"></i> <span class="dot-label" style="top:${dot_radii / 2}px;">${vbreak}</span></p>`
    );
}
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">The New York Times</a></p>';
legend.innerHTML = labels.join('') + source;

