$("#city-search-button").on("click", function () {
    var cityName = $("#city-name").val();
    $("#city-name").val("");
    getTodayWeather(cityName);
    getForecastWeather(cityName);
    addCityToList(cityName);
});

function addCityToList(cityName) {
    var newRow = $("<button>").addClass("new-button m-2 p-1").text(cityName);
    $("#previous-cities").append(newRow);
};

$("#previous-cities").on("click", "button", function() {
    getTodayWeather($(this).text());
    getForecastWeather($(this).text());
})

function getTodayWeather(cityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&APPID=d4b74d5339d458e26b64aecdf7a1e8c0')
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    
                    var iconApi = ("https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");

                    var cityTitle = $("<h3>").text(cityName + " (" + new Date().toLocaleDateString() + ")");
                    var todayIcon = $("<img>").attr("src", iconApi);
    
                    $("#city-name-display").html(cityTitle).append(todayIcon);

                    // $("#today-icon").attr("src", iconApi);

                    displayTodayWeather(data);
                    getUvIndex(data);
                });
            } else {
                alert("Error: " + response.StatusText);
            }
        });
};

function getUvIndex (data) {
    var cityLat = data.coord.lat;
    var cityLon = data.coord.lon;
                   
    var uvApi = fetch("https://api.openweathermap.org/data/2.5/uvi?appid=d4b74d5339d458e26b64aecdf7a1e8c0&lat=" + cityLat +"&lon=" + cityLon)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    var cityUv = $("<p>").text("UV Index: ");
                    var btn = $("<span>").addClass("text-white btn btn-sm").text(data.value);
                    if (data.value < 2 ) {
                        btn.addClass("bg-success");
                    } else if (data.value < 7) {
                        btn.addClass("bg-warning");
                    } else {
                        btn.addClass("bg-danger");
                    }

                    $("#city-weather-data").append(cityUv.append(btn));
                });
            }
        });
};

function displayTodayWeather(data) {
    var temp = $("<p>").text("Temperature: " + data.main.temp + "°F");
    var humidity = $("<p>").text("Humidity: " + data.main.humidity + "%");
    var wind = $("<p>").text("Wind Speed: " + data.wind.speed + " MPH");
    // var uvIndex = $("<p>").
    //  $("#city-uv-index").text(data.)

    $("#city-weather-data").html(temp).append(humidity).append(wind);
};

function getForecastWeather(cityName) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=imperial&APPID=d4b74d5339d458e26b64aecdf7a1e8c0')
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayForecastWeather(data);
                });
            } else {
                alert("Error: " + response.StatusText);
            }
            var forecastTitle = $("<h3>").addClass("h3 col-sm-12 col-md-12 m-1").text("5-Day Forecast:");
            $("#forecast-title").html(forecastTitle);
        });

};

function displayForecastWeather(data) {
    for (var i=0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.indexOf("12:00:00") !== -1) {
            var forecastCard = $("<div>").addClass("col-sm-12 col-md-2 text-white bg-primary m-2 p-2");
            var forecastDate = $("<h6>").text(new Date(data.list[i].dt_txt).toLocaleDateString());
            var forecastIcon = $("<img>").attr("src", ("https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png"));
            var forecastTemp = $("<p>").addClass("font-weight-lighter").text("Temp: " + data.list[i].main.temp_max + " °F");
            var forecastHumidity = $("<p>").addClass("font-weight-lighter").text("Humidity: " + data.list[i].main.humidity + "%");

            // add the sections together
            $("#forecast-title").append(forecastCard.append(forecastDate, forecastIcon, forecastTemp, forecastHumidity));
            // $("#forecast-title").append(forecastCard);
        }
    }
};