var temperature = document.getElementById("temperature");
var description = document.getElementById("description");
var wind = document.getElementById("wind");
var date = document.getElementById("date");

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

  stations.forEach((station, index) => {
    let current_station_av = current_availability[station.name];

    const marker = new google.maps.Marker({
      position: { lat: station.position_lat, lng: station.position_lng },
      label: (index + 1).toString(),
      map: map,
      title: station.name,
      description: current_station_av.available_bikes,
      description2: current_station_av.available_stands,
      status: current_station_av.status,
      optimized: false,
    });

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
  });
}

// Call the initMap function after the Google Maps API has loaded
window.onload = function () {
  initMap();
};
