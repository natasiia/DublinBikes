var stationInfo = {
  availableBikes: document.getElementById("available-bikes"),
  status: document.getElementById("status"),
  station: document.getElementById("station"),
  availableStands: document.getElementById("available-stands"),
};
const markers = [];

function getStationStats(name) {
  //    $.ajax({
  //      url: "/searchStation?name=" + name,
  //      cache: false,
  //      type: "GET",
  //      error: function (xhr, status, error) {
  //        $("#search-bar").notify(xhr.responseText, "error");
  //      },
  //      success: function (results) {
  //        stationDataCache[name] = {
  //            data:JSON.parse(results),
  //            timestamp:Date.now()
  //        }
  //        let data = JSON.parse(results);
  //        stationInfo.station.innerHTML = data[0];
  //        stationInfo.availableStands.innerHTML = data[1];
  //        stationInfo.availableBikes.innerHTML = data[2];
  //        stationInfo.status.innerHTML = data[3];
  //        markers[name];
  //      },
  //    });
}

function getStationNameFromNumber(number) {
  var name = "";
  stations.forEach((item) => {
    if (item.number == number) {
      name = item.name;
    }
  });
  return name;
}

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: 53.35014, lng: -6.266155 },
  });

  // Create an info window to share between markers.
  const infoWindow = new google.maps.InfoWindow();

  const svgIcon = {
    url: "./static/images/bicycle.svg",
    scaledSize: new google.maps.Size(20, 20),
  };

  // Iterate through each station in the stations array.
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
      let content = "";
      if ((marker, (open = "OPEN"))) {
        content =
          "<span class='open' style='color:green'>OPEN</span> <strong>" +
          marker.getTitle() +
          "</strong>  ";
      } else {
        content =
          "<span class='close' style='color:red'>CLOSE</span> <strong>" +
          marker.getTitle() +
          "</strong>  ";
      }

      content += "<br>Available Bikes: " + marker.description;
      content += "<br>Available Stands: " + marker.description2;

      content += `<canvas id="chart" style="width:100%;max-width:700px"></canvas>`;
      infoWindow.setContent(content);
      infoWindow.open(marker.getMap(), marker);
      const myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          const myChart = new Chart("chart", {
            type: "bar",
            data: [],
            options: {},
          });
        }, 100);
      });
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

  let directionsRenderer;
  let startPoint;

  // get the user's current location
  navigator.geolocation.getCurrentPosition((position) => {
    startPoint = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  });

  let stations_holder = document.getElementById("station-select");
  let stations_final = document.getElementById("station-dest");
  let buildRouteBtn = document.getElementById("buildRoute");
  let isDeletingRoute = false;

  stations_holder.innerHTML += "<option>CURRENT LOCATION</option>";

  stations.forEach((station) => {
    stations_holder.innerHTML += "<option>" + station.name + "</option>";
    stations_final.innerHTML += "<option>" + station.name + "</option>";
  });

  function deleteRoute() {
    // delete the old route, if it exists
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      let durationDiv = document.getElementById("duration");
      durationDiv.innerHTML = "";
    }
  }

  function buildRoute() {
    // get the selected options from the dropdowns
    const startValue = stations_holder.value;
    const endValue = stations_final.value;

    let start_index;
    let end_index;

    for (let i = 0; i < stations.length; i++) {
      if (startValue == stations[i].name) {
        start_index = i;
      }
      if (endValue == stations[i].name) {
        end_index = i;
      }
    }

    // check if both dropdowns have a value selected
    if (startValue && endValue) {
      // get the latitude and longitude for the start and end points
      if (startValue !== "CURRENT LOCATION") {
        startPoint = {
          lat: stations[start_index].position_lat,
          lng: stations[start_index].position_lng,
        };
      }

      const endPoint = {
        lat: stations[end_index].position_lat,
        lng: stations[end_index].position_lng,
      };

      // create a new DirectionsService object
      const directionsService = new google.maps.DirectionsService();

      // set up the request for the directions
      const request = {
        origin: startPoint,
        destination: endPoint,
        travelMode: google.maps.TravelMode.BICYCLING,
      };

      // use the DirectionsService to get the route and display it on the map
      directionsService.route(request, (result, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsRenderer = new google.maps.DirectionsRenderer({
            suppressBicyclingLayer: true,
          });
          directionsRenderer.setDirections(result);
          directionsRenderer.setMap(map);

          // zoom in on the route
          const bounds = new google.maps.LatLngBounds();
          result.routes[0].legs.forEach((leg) => {
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
          });
          map.fitBounds(bounds);

          // calculate the total duration of the route
          let totalDuration = 0;
          result.routes[0].legs.forEach((leg) => {
            totalDuration += leg.duration.value;
          });
          const minutes = Math.floor(totalDuration / 60);

          // display the duration on the page
          let durationDiv = document.getElementById("duration");
          durationDiv.innerHTML = `Trip duration: ${minutes} minutes`;
        } else {
          console.error("Error fetching directions:", result);
          alert("Error fetching directions");
        }
      });
    }
  }

  // set up the event listener for the button
  buildRouteBtn.addEventListener("click", () => {
    if (isDeletingRoute) {
      deleteRoute();
      buildRouteBtn.textContent = "Build Route";
      isDeletingRoute = false;
    } else {
      buildRoute();
      buildRouteBtn.textContent = "Delete Route";
      isDeletingRoute = true;
    }
  });
  document.getElementById("search").addEventListener("change", (event) => {
    var stationName = getStationNameFromNumber(event.target.value);
    markers.forEach((item) => {
      if (item.title == stationName) {
        google.maps.event.trigger(item, "click");
        getStationStats(stationName);
        document.getElementById("station-select").value = event.target.value;
      }
    });
  });
}

// Call the initMap function after the Google Maps API has loaded
window.onload = function () {
  initMap();
};
