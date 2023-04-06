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
  const myLatLng = { lat: -25.363, lng: 131.044 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: myLatLng,
  });

  new google.maps.Marker({
    position: myLatLng,
    map,
    title: "Hello World!",
  });
}

function initialize() {
  console.log("Hello! 01");
}

// Call the initMap function after the Google Maps API has loaded
window.onload = function () {
  initMap();
  initialize();
};
