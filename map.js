let map = document.getElementById("map");
let uom = document.getElementById("uom");
let context = map.getContext("2d");
let NavigationRunning = false;

//geolocation attribute for boundary of canvas map
const minLat = 19.06627;
const maxLat = 19.07532;
const minLng = 72.84991;
const maxLng = 72.86180;

let img = document.getElementById('loc_img');
let Start_navigation = document.getElementById("Start_navigation");
let zoomPlace = 3;
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
let initialDistance = null;
if (screen.width > 900) {
    map.width = screen.width;
    map.height = screen.height;
}
else {
    map.width = 900;
    map.height = 700;
}

//function and code to handle user input
let inputs = document.querySelectorAll("input");
let start = document.querySelector("select[name='start']");
let end = document.querySelector("select[name='end']");

//adding keyup event to first input field(from top) which takes where are you?
inputs[0].addEventListener("keyup", (e) => doAction(e, start, 1));

//keyup even to second input field which takes where to go?
inputs[1].addEventListener("keyup", (e) => doAction(e, end, 1));

//specifying what will happen if selection changed from drop down menu for both select element
start.addEventListener("change", () => {
    inputs[0].value = start.options[start.selectedIndex].innerText;
    Start_navigation.style.display = 'none';
    stopTracking();
});

end.addEventListener("change", () => {
    inputs[1].value = end.options[end.selectedIndex].innerText;
});

//function which takes start or end select element and populate it with user input in respective input element
function doAction(e, targetSelect, fields_number) {
    targetSelect.options.length = fields_number; // Clear previous options except the first one
    let targetedValue = e.target.value;
    if (targetedValue == '') { targetSelect.options.length = 1; }
    else {
        for (let pl of locations) {
            if (pl.place.toLowerCase().includes(targetedValue.toLowerCase())) {
                targetSelect.options[targetSelect.options.length] = new Option(pl.place, `${pl.lat},${pl.lng}`);
            }
        }
    }
}

document.getElementById('map_direction').addEventListener("click", () => {
    NavigationRunning = false;
    if (start.value != "current location") {
        let [lat1, lng1] = start.value.split(",");
        start_pos = [lat1, lng1];
    }

    if (end.options.length == 1) {
        alert("please select place from selection box ");
        return;
    }

    let [lat2, lng2] = end.value.split(",");
    end_pos = [lat2, lng2];

    if (start_pos[0] == end_pos[0] && start_pos[1] == end_pos[1]) {
        NavigationRunning = false;
        alert("you are reach at your destination");
    }
    else if (start_pos[0] && end_pos[0] && start_pos[1] && end_pos[1]) {
        NavigationRunning = true;
        DrawMap();

    } else {
        alert('Please select both start and end locations.');
    }
});

document.getElementById("PMvisible").addEventListener('click', function () {
    console.log("mouseover");
    this.style.display = 'none';
    document.getElementById("placeModal").style.display = 'block';

});

document.querySelector("#placeModal span").addEventListener('click', function () {
    this.parentNode.style.display = 'none';
    document.getElementById("PMvisible").style.display = 'block';
});


function getDistance(t1, t2) {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function zoomInMobile() {
    if (zoomPlace > ZOOM_MIN) {
        zoomPlace--;
        resizeCanvas();
    }
}

function zoomOutMobile() {
    if (zoomPlace < ZOOM_MAX) {
        zoomPlace++;
        resizeCanvas();
    }
}
map.addEventListener('touchstart', function (e) {
    if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches[0], e.touches[1]);
    }
}, false);

map.addEventListener('touchmove', function (e) {
    if (e.touches.length === 2 && initialDistance !== null) {
        let currentDistance = getDistance(e.touches[0], e.touches[1]);
        if (Math.abs(currentDistance - initialDistance) > 30) {
            if (currentDistance > initialDistance) {
                zoomInMobile();
            } else {
                zoomOutMobile();
            }
            initialDistance = currentDistance;
        }
    }
}, false);

//geolocation of attribute of UOM's places
const locations = [{ place: "East gate (university of mumbai east gate)", alias: "EG", lat: 19.07287, lng: 72.86085, zoom: 3 },
{ place: "dnyaneshwar bhavan", alias: "DB", lat: 19.07250, lng: 72.85822, zoom: 3 },
{ place: "lokmanya tilak bhavan (department of physics)", alias: "LTB", lat: 19.07230, lng: 72.85850, zoom: 1 },
{ place: "department of biotechnology", lat: 19.07145, lng: 72.85857, zoom: 2 },
{ place: "pherozshah mehta bhavan (deparment of civics and politics)", alias: "PHB", lat: 19.07372, lng: 72.85906, zoom: 2 },
{ place: "department of communication and journalism", lat: 19.07322, lng: 72.86049, zoom: 1 },
{ place: "health center (mehul stationary)", alias: "ME", lat: 19.07304, lng: 72.86024, zoom: 3 },
{ place: "department of archeology", lat: 19.07346, lng: 72.86025, zoom: 2 },
{ place: "center for extra mural studies", lat: 19.07327, lng: 72.86016, zoom: 1 },
{ place: "savitribai phule girls hostel", lat: 19.07347, lng: 72.85959, zoom: 2 },
{ place: "three monkey point", alias: "TB", lat: 19.07293, lng: 72.85991, zoom: 2 },
{ place: "rose garden", lat: 19.07246, lng: 72.85990, zoom: 2 },
{ place: "sculpture point", lat: 19.07188, lng: 72.85993, zoom: 2 },
{ place: "academy for administrative career", lat: 19.07201, lng: 72.86025, zoom: 2 },
{ place: "j.p naik bhavan", lat: 19.07201, lng: 72.86022, zoom: 2 },
{ place: "K.B.P boy's hostel", alias: "KBP", lat: 19.07036, lng: 72.85975, zoom: 3 },
{ place: "UGC human resources development centre", lat: 19.06976, lng: 72.85967, zoom: 1 },
{ place: "university of mumbai law academy", lat: 19.06963, lng: 72.85985, zoom: 1 },
{ place: "shakarrao chavan bhavan", alias: "SH", lat: 19.06958, lng: 72.85998, zoom: 3 },
{ place: "maulana abul kalam azad bhavan", lat: 19.06916, lng: 72.85923, zoom: 1 },
{ place: "alkesh dinesh mody institute", alias: "AL", lat: 19.06980, lng: 72.85845, zoom: 3 },
{ place: "mahatma jyotirao phule bhavan", alias: "PH", lat: 19.06873, lng: 72.85740, zoom: 3 },
{ place: "university main canteen", alias: "CA", lat: 19.07108, lng: 72.85887, zoom: 2 },
{ place: "the buddha circle", alias: "BC", lat: 19.07130, lng: 72.85836, zoom: 1 },
{ place: "marathi bhasa bhavan (sahitya bhavan)", alias: "MB", lat: 19.07097, lng: 72.85822, zoom: 3 },
{ place: "nyaymurthi ranade bhavan", alias: "RB", lat: 19.07122, lng: 72.85797, zoom: 3 },
{ place: "pariksha bhavan(exam house) university of mumbai", alias: "PB", lat: 19.06843, lng: 72.85725, zoom: 2 },
{ place: "chatrapati shivaji maharaj bhavan", alias: "SV", lat: 19.06822, lng: 72.85801, zoom: 3 },
{ place: "rajiv gandhi centre for contemporary studies", lat: 19.07016, lng: 72.85595, zoom: 2 },
{ place: "thesis department of mumbai", lat: 19.06928, lng: 72.85530, zoom: 1 },
{ place: "national centre for nanoscience and nanotechnology", lat: 19.06915, lng: 72.85518, zoom: 3 },
{ place: "CEBS hostel takshashila", lat: 19.06841, lng: 72.85534, zoom: 2 },
{ place: "UM-DAE centre for excellencce and basic (CEBS)", alias: "CEBS", lat: 19.06832, lng: 72.85489, zoom: 3 },
{ place: "international students hostel", lat: 19.06811, lng: 72.85444, zoom: 1 },
{ place: "Dr. ambedkar bhavan", alias: "AM", lat: 19.07239, lng: 72.85522, zoom: 3 },
{ place: "university of mumbai sports complex", alias: "USC", lat: 19.07380, lng: 72.85437, zoom: 3 },
{ place: "centre for central euresian studies", lat: 19.07093, lng: 72.85757, zoom: 1 },
{ place: "department of applied psychology", lat: 19.07252, lng: 72.85697, zoom: 1 },
{ place: "basket ball courts", lat: 19.07282, lng: 72.85455, zoom: 2 },
{ place: "garware institute of career educations and development", alias: "GR", lat: 19.07380, lng: 72.85701, zoom: 3 },
{ place: "university department  of information techonology", lat: 19.07330, lng: 72.85833, zoom: 1 },
{ place: "instiute of distance learning(IDOL)", alias: "IDOL", lat: 19.07326, lng: 72.85861, zoom: 3 },
{ place: "nehru yuva kendra sanghthan", lat: 19.07204, lng: 72.86029, zoom: 1 },
{ place: "old lecture complex", alias: "OLC", lat: 19.07187, lng: 72.85768, zoom: 3 },
{ place: "new lecture complex", alias: "NLC", lat: 19.07212, lng: 72.85727, zoom: 3 }
];

let roads = {
    "north_gate_to_mahatma_jyotirao_phule_bhavan": [[19.07396, 72.85267],
    [19.07292, 72.85386], [19.07380, 72.85437],
    [19.07292, 72.85386], [19.07207, 72.85480],
    [19.07239, 72.85522], [19.07207, 72.85480],
    [19.07104, 72.85585], [19.07097, 72.85588],
    [19.06891, 72.85710]
    ],
    "east_gate_to_ambedkar_bhavan": [[19.07283, 72.86083], [19.07271, 72.85906], [19.07372, 72.85906],
    [19.07271, 72.85906], [19.07230, 72.85850], [19.07271, 72.85906], [19.07303, 72.85802],
    [19.07326, 72.85768],
    [19.07253, 72.85698],
    [19.07285, 72.85642],
    [19.07287, 72.85556],
    [19.07239, 72.85522],
    [19.07207, 72.85480]
    ],
    "phule_junction_to_east_gate": [[19.06891, 72.85710],
    [19.06887, 72.85707],
    [19.06885, 72.85711],
    [19.06888, 72.85717],
    [19.06873, 72.85740],
    [19.06888, 72.85717],
    [19.06892, 72.85750],
    [19.06886, 72.85772],
    [19.06845, 72.85799],
    [19.06822, 72.85801],
    [19.06845, 72.85799],
    [19.06858, 72.85840],
    [19.06964, 72.85937],
    [19.06980, 72.85845],
    [19.06964, 72.85937],
    [19.06974, 72.85937],
    [19.06958, 72.85998],
    [19.06974, 72.85937],
    [19.07022, 72.85941],
    [19.07036, 72.85975],
    [19.07022, 72.85941],
    [19.07111, 72.85927],
    [19.07118, 72.85937],
    [19.07196, 72.86005], [19.07274, 72.86001], [19.07283, 72.86120]
    ],
    "dnyaneshwar_bhavan_to_CSMT_road": [[19.07250, 72.85822], [19.07290, 72.85844]],
    "mahatma_jyotirao_phule_bhavan_to_buddha_circle": [
        [19.06891, 72.85710], [19.06993, 72.85746],
        [19.07041, 72.85762], [19.07108, 72.85822]
    ],
    "lokmanya_tilak_bhavan_to_buddha_cirlce": [[19.07230, 72.85850], [19.07183, 72.85852], [19.07129, 72.85805], [19.07105, 72.85828]],
    "sahitya_bhavan_to_buddha_circle":
        [[19.07116, 72.85792], [19.07131, 72.85805], [19.07187, 72.85768], [19.07131, 72.85805], [19.07105, 72.85828]],
    "buddha_circle_to_east_gate": [[19.07041, 72.85762], [19.07108, 72.85822], [19.07105, 72.85828], [19.07108, 72.85897], [19.07103, 72.85834],
    [19.07107, 72.85839], [19.07109, 72.85840],
    [19.07111, 72.85927], [19.07118, 72.85937],
    [19.07196, 72.86005], [19.07274, 72.86001], [19.07283, 72.86083]],
    "old_jawaharlal_library_NLC_deskmush_bhavan_circle":
        [[19.07186, 72.85668],
        [19.07188, 72.85671], [19.07192, 72.85679],
        [19.07192, 72.85685], [19.07188, 72.85695],
        [19.07181, 72.85702], [19.07173, 72.85703],
        [19.07164, 72.85701], [19.07157, 72.85694],
        [19.07154, 72.85685], [19.07157, 72.85673],
        [19.07164, 72.85666], [19.07171, 72.85663],
        [19.07178, 72.85664], [19.07188, 72.85671]]
    ,
    "KRC_to_csmt_road_toward_ambedkar": [[19.07186, 72.85668], [19.07255, 72.85587], [19.07287, 72.85556]],
    "marathi_bhasa_bhavan_to_road_going_toward_buddha": [[19.07066, 72.85811], [19.07078, 72.85796], [19.07105, 72.85828]],
    "biophysics_to_road_going_toward_buddha_circle": [[19.07013, 72.85710], [19.06994, 72.85746]],
    "CBS_to_phule": [[19.06766, 72.85440], [19.06959, 72.85627], [19.06983, 72.85656], [19.06891, 72.85710]],
    "road_around_nanotechnology": [[19.06889, 72.85557], [19.06953, 72.85480], [19.06893, 72.85420], [19.06825, 72.85497]]

};

//label(alias field of variable 'locations') for each place with their geolocation attributes
const label_place_coords = {
    EG: [19.07287, 72.86085],
    A: [19.07280, 72.86039],
    ME: [19.07304, 72.86024],
    MB: [19.07097, 72.85822],
    RB: [19.07122, 72.85797],
    TB: [19.07276, 72.86000],
    AL: [19.06980, 72.85845],
    C: [19.07271, 72.85904],
    K: [19.07303, 72.85802],
    D: [19.07116, 72.85931],
    E: [19.07022, 72.85941],
    F: [19.06963, 72.85943],
    G: [19.06847, 72.85814],
    H: [19.06890, 72.85711],
    I: [19.06984, 72.85656],
    J: [19.07207, 72.85480],
    L: [19.07289, 72.85389],
    Q: [19.06993, 72.85746],
    LTB: [19.07230, 72.85850],
    DB: [19.07250, 72.85822],
    IDOL: [19.07326, 72.85861],
    PHB: [19.07372, 72.85906],
    NLC: [19.07212, 72.85727],
    Y: [19.07292, 72.85845],
    P: [19.07239, 72.85522],
    O: [19.07287, 72.85556],
    N: [19.07285, 72.85642],
    M: [19.07253, 72.85698],
    BC: [19.07111, 72.85832],
    KBP: [19.07036, 72.85975],
    OLC: [19.07187, 72.85768],
    CA: [19.07108, 72.85887],
    SH: [19.06958, 72.85998],
    SV: [19.06822, 72.85801],
    PH: [19.06873, 72.85740],
    CEBS: [19.06841, 72.85534],
    GR: [19.07380, 72.85701],
    AM: [19.07239, 72.85522],
    NG: [19.07396, 72.85267],
    USC: [19.07380, 72.85437],
    R: [19.07232, 72.85893],
    S: [19.07171, 72.85845],
    T: [19.07140, 72.85821],
    U: [19.07200, 72.85811],
    V: [19.07221, 72.85838],
    W: [19.07201, 72.8579],
    X: [19.07328, 72.85770],
    PB: [19.06843, 72.85725]
};

//graph of university of mumbai for navigating with vehicle
const graph_drive = {
    EG: ["A"],
    A: ["TB", "EG", "D", "ME"],
    TB: ["A", "C"],
    C: ["TB", "R", "PHB", "IDOL", "Y"],
    R: ["LTB", "C"],
    LTB: ["R", "S"],
    S: ["T", "LTB"],
    T: ["BC", "S", "OLC"],
    Y: ["C", "K", "DB"],
    PHB: ["C"],
    IDOL: ["C"],
    DB: ["Y"],
    K: ["NLC", "X", "Y"],
    X: ["M", "K"],
    NLC: ["K"],
    M: ["GR", "X", "N"],
    GR: ["M"],
    N: ["M", "O"],
    O: ["N", "P"],
    P: ["O", "AM"],
    AM: ["P", "J"],
    D: ["A", "E", "BC"],
    ME: ["A"],
    E: ["D", "BC", "KBP", "F"],
    BC: ["D", "CA", "RB", "MB", "T"],
    RB: ["BC"],
    MB: ["BC"],
    Q: ["H", "BC"],
    CA: ["BC"],
    OLC: ["BC"],
    KBP: ["E"],
    F: ["E", "SH", "G", "AL"],
    SH: ["F"],
    AL: ["F"],
    G: ["F", "SV", "H", "PB"],
    PB: ["G"],
    SV: ["G"],
    H: ["PH", "I", "G", "Q"],
    PH: ["H"],
    I: ["H", "J", "CEBS"],
    CEBS: ["I"],
    J: ["I", "L", "AM", "P"],
    L: ["J", "NG", "USC"],
    NG: ["L"],
    USC: ["L"]
};
//graph of university of mumbai for pedestrian navigation
const graph_walk = {
    EG: ["A"],
    A: ["TB", "EG", "D", "ME"],
    TB: ["A", "C"],
    C: ["TB", "R", "PHB", "IDOL", "Y"],
    Y: ["DB","C", "K"],
    R: ["C", "LTB", "S"],
    PHB: ["C"],
    IDOL: ["C"],
    DB: ["Y", "V"],
    LTB: ["R", "V"],
    S: ["R", "T", "U"],
    T: ["S", "BC", "OLC"],
    U: ["W", "V"],
    W: ["U", "OLC", "NLC"],
    V: ["U", "LTB", "DB"],
    K: ["NLC", "X", "Y"],
    NLC: ["K", "W"],
    X: ["M", "K"],
    M: ["GR", "X", "N"],
    GR: ["M"],
    N: ["M", "O"],
    O: ["N", "P"],
    P: ["O", "AM"],
    AM: ["P", "J"],
    D: ["A", "E", "BC"],
    ME: ["A"],
    E: ["D", "KBP", "F"],
    BC: ["D", "CA", "OLC", "RB", "MB", "T"],
    RB: ["BC"],
    MB: ["BC"],
    Q: ["H", "BC"],
    CA: ["BC"],
    OLC: ["BC", "T", "W"],
    KBP: ["E"],
    F: ["E", "SH", "G", "AL"],
    SH: ["F"],
    AL: ["F"],
    G: ["F", "SV", "H", "PB"],
    PB: ["G"],
    SV: ["G"],
    H: ["PH", "I", "G", "Q"],
    PH: ["H"],
    I: ["H", "J", "CEBS"],
    CEBS: ["I"],
    J: ["I", "L", "AM", "P"],
    L: ["J", "NG", "USC"],
    NG: ["L"],
    USC: ["L"]
};
//function to find shortest path between two places.
function bfsShortestPath(graph, start, end) {
    if (!graph[start] || !graph[end]) {
        return "invalid start or end location";
    }
    const visited = new Set();
    const queue = [[start]];
    while (queue.length > 0) {
        const path = queue.shift();
        const node = path[path.length - 1];
        if (node === end) {
            return path;
        }
        if (!visited.has(node)) {
            visited.add(node);
            for (const neighbor of graph[node]) {
                const newPath = [...path, neighbor];
                queue.push(newPath);
            }
        }
    }
    return 'no path found from ${start} to ${end}';
}

//generating array of geolocation from shortest path between two places.
function shortest_path_coordinates(path) {
    let path_coords = [];
    for (let i of path) {
        path_coords.push(label_place_coords[i]);
    }
    return path_coords;
}

function drawRoad() {
    for (let i in roads) {
        context.lineWidth = 2;
        context.strokeStyle = '#b7e5e454';
        for (let j = 0; j < roads[i].length - 1; j++) {
            let p1 = roads[i][j];
            let [x, y] = latLngToCanvas(p1[0], p1[1]);
            context.moveTo(x, y);
            p1 = roads[i][j + 1];
            [x, y] = latLngToCanvas(p1[0], p1[1]);
            context.lineTo(x, y);
            context.stroke();
        }
    }
}

function drawHighlight(r) {
    context.strokeStyle = 'red';
    context.lineWidth = 4;
    for (let j = 0; j < r.length - 1; j++) {

        let p1 = r[j];
        let [x, y] = latLngToCanvas(p1[0], p1[1]);
        context.moveTo(x, y);
        p1 = r[j + 1];
        [x, y] = latLngToCanvas(p1[0], p1[1]);
        context.lineTo(x, y);
        context.stroke();
    }
    Start_navigation.style.display = 'block';
}

function drawPlaces() {
    locations.forEach(location => {
        if (location.zoom >= zoomPlace) {
            const [x, y] = latLngToCanvas(location.lat, location.lng);

            context.fillStyle = 'blue';
            context.beginPath();
            const radius = 5;
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();

            // Adjust font size dynamically
            const fontSize = (1 + zoomPlace) * 6; // e.g., zoomPlace 3 => 4px, zoomPlace 1 => 12px
            context.font = `${fontSize}px "Times New Roman"`;
            context.fillStyle = 'white';
            let placeName = location.place.split(" ").slice(0, 3).join(" ");
            context.fillText(placeName, x - radius * 15, y + radius * 5);
        }
    });
}

function DrawMap() {
    context.clearRect(0, 0, map.width, map.height);
    context.drawImage(uom, 0, 0, map.width, map.height);
    console.log(uom.height, uom.width);
    drawRoad();
    drawPlaces();
    let start_place, end_place;
    if (NavigationRunning) {

        let start_found = false;
        let end_found = false;
        for (let i of locations) {

            if (start_found && end_found) {
                break;
            }

            if (i.place == inputs[0].value && !start_found) {
                start_place = i.alias;
                start_found = true;
            }
            else if (i.place == inputs[1].value && !end_found) {
                end_place = i.alias;
                end_found = true;
            }

        }
        drawHighlight(ShowSE_direction(start_place, end_place));
    }
}

function ShowSE_direction(start_place, end_place) {
    let [dest_lat, dest_lng] = latLngToCanvas(end_pos[0], end_pos[1]);
    context.drawImage(img, dest_lat - 25, dest_lng - 50, 50, 50);

    let [src_lat, src_lng] = latLngToCanvas(start_pos[0], start_pos[1]);
    context.drawImage(img, src_lat - 25, src_lng - 50, 50, 50);


    let graph_mode = document.getElementById("navigation_walk").checked ? graph_walk : graph_drive;


    const shortest = bfsShortestPath(graph_mode, start_place, end_place);
    console.log(shortest);
    let coordinates = shortest_path_coordinates(shortest);
    console.log(coordinates);
    return coordinates;
}
let watchId = null;
let path_coords = [];
function StartNavigation() {

    if ('geolocation' in navigator) {
        console.log("geolocation is supported by your browser");
        let x, y;
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                let accuracy = position.coords.accuracy;
                latitude = latitude.toFixed(5);
                longitude = longitude.toFixed(5);
                path_coords.push([latitude, longitude]);
                context.fillStyle = 'green';
                context.beginPath();
                let radius = 10;
                for (let coords of path_coords) {
                    [x, y] = latLngToCanvas(coords[0], coords[1]);
                    context.arc(x, y, radius, 0, Math.PI * 2);  // Increased marker size
                    context.fill();
                }
            },
            (error) => {
                NavigationRunning = false;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.error('Permission denied. Please allow location access.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.error('Position unavailable. Please check your device.');
                        break;
                    case error.TIMEOUT:
                        console.error('Request timed out. Please try again.');
                        break;
                    default:
                        console.error('An unknown error occurred.');
                }
            },
            {
                enableHighAccuracy: true, // Request high accuracy for better results
                maximumAge: 0,           // Prevent caching of results
                timeout: 5000            // Timeout after 5 seconds
            }
        );
    }
    else {
        console.error('Geolocation is not supported by your browser.');
    }
}

function stopTracking() {
    if (watchId != null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        path_coords=[];
        console.log('tracking stopped');
    }
}

Start_navigation.addEventListener("click", function () {
    StartNavigation();
})

function resizeCanvas() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (vw > 900) {
        map.width = vw;
        map.height = vh;
    } else {
        map.width = vw;
        map.height = vh * 0.7;
    }
    DrawMap();
}

function latLngToCanvas(lat, lng) {
    let y, x;
    y = ((maxLat - lat) / (maxLat - minLat)) * parseFloat(map.height);
    x = ((lng - minLng) / (maxLng - minLng)) * parseFloat(map.width);

    return [x, y];
}

window.onload = resizeCanvas;
window.onresize = resizeCanvas;
