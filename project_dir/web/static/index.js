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

  stations.forEach((station, index) => {
    const marker = new google.maps.Marker({
      position: { lat: station.position_lat, lng: station.position_lng },
      label: (index + 1).toString(),
      map: map,
      title: station.name,
      description: current_availability[station.name]
        ? current_availability[station.name].available_bikes
        : "unknown",
      description2: current_availability[station.name]
        ? current_availability[station.name].available_stands
        : "unknown",
      status: current_availability[station.name].status,
      optimized: false,
    });

    markers.push(marker);

    // Add a click listener for each marker, and set up the info window.
    marker.addListener("click", () => {
      infoWindow.close();
      let content = "<strong>" + marker.getTitle() + "</strong>";
      content += "<br>Available Bikes: " + marker.description;
      content += "<br>Available Stands: " + marker.description2;
      content += "<br>Status: " + marker.status;

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
}

// Call the initMap function after the Google Maps API has loaded
window.onload = function () {
  initMap();
};
