var cityName = $("city-input");
var citySearchList = $("#city-list");
var currentWeather = $("#current-weather");
var uvIndex = "";
var cityNameTag = $("<h3>");
var lat = "";
var long = "";
var latLong = "";
var cityArray = [];
var apiKey = "";

// function to start from scratch and update cityArray with user input
function restart() {
    console.log("restart function");

    // empty currentWeather div tag
    $(currentWeather).text("");
    // empty 5day-forecast span tags
    document.getElementById("day7").innerHTML = "";
    document.getElementById("day15").innerHTML = "";
    document.getElementById("day23").innerHTML = "";
    document.getElementById("day31").innerHTML = "";
    document.getElementById("day39").innerHTML = "";

    // assign user input to cityName variable
    cityName = $("#city-input").val();
    // stop if user searches for blank value
    if (cityName === "") {
        return;
    }

    // add user input to cityArray
    cityArray.push(cityName);
    // empty input tag
    $("#city-input").innerHTML = "";
}

// function to create li & button tags and display cities searched
function renderCityList() {
    console.log("renderCityList function");
    // assign cityName to variable
    cityName = $("#city-input").val();
    console.log("city searched: " + cityName);

    // create li tags
    var listTag = $("<li>");
    // assigning list class
    $(listTag).attr("class", "list");
    // create button tag
    // var cityButtons = $("<button>");

    // assigning cityName to button tag
    $(listTag).text(cityName);

    // append button to li
    // listTag.append(cityButtons);

    // append li tag to page
    citySearchList.append(listTag);
}

// function to get city history from local storage
function cityHistory() {
    // retrieve city history from local storage
    var cityHistoryList = JSON.parse(localStorage.getItem("city-history-list"));

    // check if local storage has data
    if (cityHistoryList !== null) {
        console.log("cityHistory function");
        // append data to array
        cityArray = cityHistoryList;
    } else {
        return;
    }

    // create variable to retrieve values from local storage
    var keys = Object.entries(cityHistoryList);
    // go through each value in local storage
    keys.forEach(([key, value]) => {
        // create li tag
        var listTag = document.createElement("li");
        // assign value to li tag
        listTag.textContent = value;
        // assign class
        listTag.setAttribute("class", "list");
        // append to unordered list
        citySearchList.append(listTag);
    });
}

// function for current weather API call
function currentWeatherAPI() {
    console.log("currentWeatherAPI function");
    console.log("uvIndexAPI function");

    // add border and spacing for currentWeather div tag
    currentWeather.addClass("current-weather");

    // assign cityName to h3 tag
    $(cityNameTag).text(cityName);
    // append h3 tag to currentWeather div tag
    currentWeather.append(cityNameTag);


    // query URL for city weather
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

    // API call for city weather
    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {
            // variable to get icon for todays weather
            var todayIcon = response.weather[0].icon;
            // assign value to todayIconURL
            var todayIconURL = "https://openweathermap.org/img/wn/" + todayIcon + ".png";
            // append todayIconURL next to cityNameTag
            $(cityNameTag).append("<img src =" + todayIconURL + ">");

            // variable to get temp in F
            var f = Math.floor((response.main.temp - 273.15) * 1.8 + 32);
            // append temp to currentWeather
            $(currentWeather).append("Temperature: " + f + "&deg; F <br>");

            // variable to contain humidity and wind speed
            var humidity = "Humidity: " + response.main.humidity + "%";
            var windSpeed = "Wind Speed: " + response.wind.speed + " MPH";
            // append humidity and wind speed to currentWeather
            $(currentWeather).append(humidity + "<br />" + windSpeed + "<br>");

            // create variables to contain lat and long of searched city to get UV index
            lat = response.coord.lat;
            long = response.coord.lon;
            latLong = "&lat=" + lat + "&lon=" + long;

            // call uvIndex function
            uvIndexAPI();

        });
}

// function for UV index API call
function uvIndexAPI() {
    // create query URL for UV index
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + latLong;

    // API call for UV index
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        // create variable to get uvIndex
        uvIndex = response[0].value;
        // assign text to currentWeather
        $(currentWeather).append("UV Index: ");

        // check uvIndex, create span tags and assign appropriate color
        if (uvIndex < 3) {
            $("<span>", { class: "uvGreen", html: uvIndex }).appendTo(currentWeather);
        } else if (uvIndex > 3 && uvIndex < 7) {
            $("<span>", { class: "uvYellow", html: uvIndex }).appendTo(currentWeather);
        } else {
            $("<span>", { class: "uvRed", html: uvIndex }).appendTo(currentWeather);
        }
    });
}

// function for 5day-forecast API call
function fiveDayForecastAPI() {
    console.log("fiveDayForecast function");
    // query URL for five day forecast
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;

    // API call for 5day-forecast
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        // for-loop for 5day forecast
        for (var i = 7; i < response.list.length; i += 8) {
            $("#day" + i).addClass("five-day-forecast");
            // convert date from unix time stamp to mm/dd/yyyy format
            var unixTime = new Date(response.list[i].dt * 1000).toLocaleDateString(
                "en-US"
            );

            // variable to contain date
            var date = "<strong>" + unixTime + "</strong>";
            // variable to select weather icon
            var icon = response.list[i].weather[0].icon;
            // variable to contain weather icon
            var iconURL = "<img src=https://openweathermap.org/img/wn/" + icon + ".png> <br>";
            // variable to get temp in K
            kelvin = response.list[i].main.temp;
            // convert temp to fahrenheit
            var temp = "Temp: " + Math.floor((kelvin - 273.15) * 1.8 + 32) + "&deg; F <br>";
            // variable to contain humidity
            var humidity = "Humidity: " + response.list[i].main.humidity + "%";
            // append info to appropriate forecast date
            $("#day" + i).append(date, iconURL, temp, humidity);
        }
    });
}

// what happens when search icon button has been clicked
$("#search-button").on("click", function(event) {
    console.log("search has kicked off");
    event.preventDefault();

    // store data in userArray to localStorage
    localStorage.setItem("city-history-list", JSON.stringify(cityArray));

    // call functions
    restart();
    renderCityList();
    currentWeatherAPI();
    fiveDayForecastAPI();
});

// call cityHistory function to display city-history-list
cityHistory();