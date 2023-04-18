var temperature = '';
var pressure = '';
var humidity = '';
var wind_speed = '';
var predictionDay = '';
var predictionTime = '';
var predictionInput = '';
var predictionStation = '';
var weatherinfo = '';

var stationPosition = {}
var address = ''

//populate the dropdown list
function populate() {
    var jqxhr = $.getJSON("/static/dublin.json", null, function(data) {
        var stations = data.station;
        console.log(stations)
        var From = "<option value=2020>Current location</option>";
        var To = "<option value=2018>Select location</option>";
        var lat = ''

        for (var i = 0; i < stations.length; i++) {
            var address = stations[i].address;
            var lng = stations[i].position_lat;
            var lat = stations[i].position_lng
            To += "<option  value=" + stations[i].number + ">" + address + "</option>"
            stationPosition = {
                lat: stations[i].position_lat,
                lng: stations[i].position_lng
            };

        }

        document.getElementById("from_places").innerHTML = To;
//        document.getElementById("to_places").innerHTML = To;
//        document.getElementById("station_name").innerHTML = To;

        console.log(address)
        console.log(stationPosition)

    })
};
populate()

// function to get the user selected location in other to know the station number.
document.getElementById('from_places').addEventListener('change', function() {
    predictionStation = this.value*1;
    console.log(predictionStation)
})

// get real-time weather data
function weather() {
    var request = $.getJSON("http://api.openweathermap.org/data/2.5/weather?id=7778677&APPID=b0059847f8ec020060d3e56bd7678549&units=metric",
        function(response) {
            weatherinfo = response
            temperature = response.main.temp;
            pressure = response.main.pressure;
            humidity = response.main.humidity;
            wind_speed = response.wind.speed;
        })
}

// prediction module
weather()
function prediction() {
    predictionDay = document.getElementById("dateInput").value;
    predictionTime = document.getElementById("timeInput").value;
    var sel = document.getElementById('station_name');

    //  prediction to variables to send to the flask app
    predictionInput = +temperature + " " + pressure + " " + humidity + " " + wind_speed + " " + predictionDay + " " + predictionTime + "  " + predictionStation

    console.log(predictionInput);
    // posting the prediction variables to the ask app and getting the result.
    $.getJSON("http://127.0.0.1:5000" + '/prediction', {
        post: predictionInput
    }, function(data) {
        //                var response=({{ data|safe }})
        var response = data;
//        alert(response)
        document.getElementById('predictionResults').innerHTML = response;
//        var answer = response[0];
    })

}

document.getElementById('submitPrediction').addEventListener('click', prediction);