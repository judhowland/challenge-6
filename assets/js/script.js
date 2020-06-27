$("#city-search-button").on("click", function () {
    var cityName = $("#city-name").val();
    $("#city-name").val("");
    getTodayWeather(cityName);
    getForecastWeather(cityName);
    addCityToList(cityName);
});

function addCityToList(cityName) {
    var newRow = $("<button>").addClass("new-button").text(cityName);
    $("#previous-cities").append(newRow);
};

$("#previous-cities").on("click", "button", function() {
    getTodayWeather($(this).text());
    getForecastWeather($(this).text());
})

function getTodayWeather(cityName) {
    fetch(' https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&APPID=d4b74d5339d458e26b64aecdf7a1e8c0')
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    var iconApi = ("http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");

                    $("#city-name-display").text(cityName + " (" + new Date().toLocaleDateString() + ")");

                    $("#today-icon").attr("src", iconApi);

                    displayTodayWeather(data);
                });
            } else {
                alert("Error: " + response.StatusText);
            }
        });
};

function displayTodayWeather(data) {
    $("#today-temp").text(data.main.temp + "°F");
    $("#today-humidity").text(data.main.humidity + "%");
    $("#today-wind-speed").text(data.wind.speed + " MPH");
    //  $("#city-uv-index").text(data.)
};

function getForecastWeather(cityName) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=imperial&APPID=d4b74d5339d458e26b64aecdf7a1e8c0')
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayForecastWeather(data);
                });
            } else {
                alert("Error: " + response.StatusText);
            }
        });

};

function displayForecastWeather(data) {
    for (var i=0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.indexOf("12:00:00") !== -1) {
            var forecastCard = $("<div>").addClass("col-12 col-md-2 text-white bg-primary m-1 p-2");
            var forecastDate = $("<h6>").text(new Date(data.list[i].dt_txt).toLocaleDateString());
            var forecastIcon = $("<img>").attr("src", ("http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png"));
            var forecastTemp = $("<p>").addClass("text-sm").text("Temp:" + data.list[i].main.temp_max + " °F");
            var forecastHumidity = $("<p>").addClass("text-sm").text("Humidity:" + data.list[i].main.humidity + "%");

            // add the sections together
            forecastCard.append(forecastDate, forecastIcon, forecastTemp, forecastHumidity);
            $("#forecast-section").append(forecastCard);
        }
    }
};