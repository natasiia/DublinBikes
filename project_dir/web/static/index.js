var stationInfo = {
  availableBikes: document.getElementById("available-bikes"),
  status: document.getElementById("status"),
  station: document.getElementById("station"),
  availableStands: document.getElementById("available-stands"),
};

$(".search-bar").on("keyup", function (e) {
  if (e.key === "Enter" || e.keyCode === 13) {
    let name = $(".search-bar").val();
    $.ajax({
      url: "/searchStation?name=" + name,
      cache: false,
      type: "GET",
      error: function (xhr, status, error) {
        $("#search-bar").notify(xhr.responseText, "error");
      },
      success: function (results) {
        let data = JSON.parse(results);
        stationInfo.station.innerHTML = data[0];
        stationInfo.availableStands.innerHTML = data[1];
        stationInfo.availableBikes.innerHTML = data[2];
        stationInfo.status.innerHTML = data[3];

        infoWindow.open(markers[name].getMap(), markers[name]);
      },
    });
  }
});

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: 53.35014, lng: -6.266155 },
  });

  // Create an info window to share between markers.
  const infoWindow = new google.maps.InfoWindow();

  const markers = [];

  const svgIcon = {
    url: "./static/images/bicycle.svg",
    scaledSize: new google.maps.Size(20, 20),
  };

  stations.forEach((station) => {
    const marker = new google.maps.Marker({
      position: { lat: station.position_lat, lng: station.position_lng },
      icon: svgIcon,
      map: map,
      title: station.name,
      description: current_availability[station.name]
        ? current_availability[station.name].available_bikes
        : "unknown",
      description2: current_availability[station.name]
        ? current_availability[station.name].available_stands
        : "unknown",
      optimized: false,
    });

    markers.push(marker);

    // Add a click listener for each marker, and set up the info window.
    marker.addListener("click", () => {
      infoWindow.close();
      let content = "<strong>" + marker.getTitle() + "</strong>";
      content += "<br>Available Bikes: " + marker.description;
      content += "<br>Available Stands: " + marker.description2;

      infoWindow.setContent(content);
      infoWindow.open(marker.getMap(), marker);
    });

    const toggleMarkersButton = document.getElementById("toggleMarkers");
    let markersVisible = true;

    toggleMarkersButton.addEventListener("click", () => {
      markers.forEach((marker) => {
        marker.setVisible(!markersVisible);
      });
      markersVisible = !markersVisible;
      toggleMarkersButton.innerText = markersVisible
        ? "Hide Markers"
        : "Show Markers";
    });
  });

  let heatmapData = stations.map((station) => {
    if (current_availability[station.name] !== undefined) {
      console.log(station.name);
      let weight;
      if (current_availability[station.name].available_bikes == 0) {
        weight = 1;
      } else if (
        current_availability[station.name].available_bikes > 0 &&
        current_availability[station.name].available_bikes < 10
      ) {
        weight = 1.5;
      } else {
        weight = 2;
      }

      console.log(weight);
      return {
        location: new google.maps.LatLng(
          station.position_lat,
          station.position_lng
        ),
        weight,
      };
    }
  });

  const heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    gradient: [
      "rgba(255, 255, 255, 0)", // transparent
      "rgba(255, 0, 0, 1)", // red
      "rgba(255, 255, 0, 1)", // yellow
      "rgba(0,128,0,1)", // green
    ],
    radius: 10,
  });

  const toggleHeatmapButton = document.getElementById("toggleHeatmap");
  let heatmapVisible = true;

  toggleHeatmapButton.addEventListener("click", () => {
    if (heatmapVisible) {
      heatmap.setMap(null);
      heatmapVisible = false;
      toggleHeatmapButton.innerText = "Show Heatmap";
    } else {
      heatmap.setMap(map);
      heatmapVisible = true;
      toggleHeatmapButton.innerText = "Hide Heatmap";
    }
  });

  heatmap.setMap(map);

  const showLocationButton = document.getElementById("showLocation");
  let marker;

  if (navigator.geolocation) {
    showLocationButton.addEventListener("click", () => {
      if (marker) {
        marker.setMap(null);
        marker = null;
        showLocationButton.textContent = "Show Location";
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const location = new google.maps.LatLng(latitude, longitude);
            map.setCenter(location);
            map.setZoom(13);
            marker = new google.maps.Marker({
              position: location,
              map: map,
            });
            showLocationButton.textContent = "Hide Location";
          },
          (error) => {
            console.error(error);
          }
        );
      }
    });
  } else {
    showLocationButton.disabled = true;
    console.error("Geolocation is not supported by this browser.");
  }
}

// Call the initMap function after the Google Maps API has loaded
window.onload = function () {
  initMap();
};
