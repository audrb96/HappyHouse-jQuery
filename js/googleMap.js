let map2;
let markers = [];
function initMap() {
map2 = new google.maps.Map(document.getElementById("map"), {
center: {
lat: 37.5642135,
lng: 127.0016985
},
zoom: 11
});
    let mulimarker = {
        coords: {lat : 37.6542584, lng : 127.0418641},
        iconImage : "img/my_position.png",
        content : '노원구'
    };
    addMarker(mulimarker);
    mulimarker = {
        coords: {lat : 37.6662953, lng : 126.9947673},
        iconImage : "img/my_position.png",
        content : '도봉구'
    };
    addMarker(mulimarker);
    mulimarker = {
        coords: {lat : 37.6482758, lng : 126.9813016},
        iconImage : "img/my_position.png",
        content : '강북구'
    };
    addMarker(mulimarker);
    mulimarker = {
        coords: {lat : 37.6023622, lng : 127.0076835},
        iconImage : "img/my_position.png",
        content : '성북구'
    };
    addMarker(mulimarker);
    mulimarker = {
        coords: {lat : 37.5836082, lng : 127.0330003},
        iconImage : "img/my_position.png",
        content : '동대문구'
    };
    addMarker(mulimarker);
    mulimarker = {
        coords: {lat : 37.5950824, lng : 127.0781537},
        iconImage : "img/my_position.png",
        content : '중랑구'
    };
    addMarker(mulimarker);
    mulimarker = {
        coords: {lat : 37.5463043, lng : 127.0683181},
        iconImage : "img/my_position.png",
        content : '광진구'
    };
    addMarker(mulimarker);
    mulimarker = {
        coords: {lat : 37.5493321, lng : 127.128875},
        iconImage : "img/my_position.png",
        content : '강동구'
    };
    addMarker(mulimarker);
    mulimarker = {
        coords: {lat : 37.5048039, lng : 127.0793597},
        iconImage : "img/my_position.png",
        content : '송파구'
    };
    addMarker(mulimarker);

    mulimarker = {
        coords: {lat : 37.4969117, lng : 127.0328342},
        iconImage : "img/my_position.png",
        content : '강남구'
    };
    addMarker(mulimarker);

    mulimarker = {
        coords: {lat : 37.6175734, lng : 126.8898114},
        iconImage : "img/my_position.png",
        content : '은평구'
    };
    addMarker(mulimarker);

    mulimarker = {
        coords: {lat : 37.5833447, lng : 126.9181076},
        iconImage : "img/my_position.png",
        content : '서대문구'
    };
    addMarker(mulimarker);

    mulimarker = {
        coords: {lat : 37.561629, lng : 126.8910906},
        iconImage : "img/my_position.png",
        content : '마포구'
    };
    addMarker(mulimarker);
}



function addMarker(props) {
    const marker = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(props.coords.lat), parseFloat(props.coords.lng)),
        map2: map2
    });


    if (props.iconImage) {
        marker.setIcon(props.iconImage);
    }

    if (props.content) {
        infoWindow = new google.maps.InfoWindow({
            content: props.content
        });

    }

    marker.addListener('click', function () {
        map2.setZoom(17);
        map2.setCenter(marker.getPosition());
        bounceMarker(marker);
    });
    markers.push(marker);
    setMapOnAll(map2);
}

function setMapOnAll(map2) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map2);
    }
}