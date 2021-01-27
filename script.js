// get data from local storage - searched cities to appear from recent to old on page
var searchedCities = localStorage.getItem("city-list")

// what should happen if searchCities is empty
if (searchedCities === null) {
    // do nothing and leave it as an empty array
    searchedCities = [];
}
// what happens if searchCities has data - aka data in localStorage
else {
    // parse string into an object - ??? understand this more
    searchedCities = JSON.parse(searchedCities);
}

// what happens when Search button is clicked
$("#search-city").on("click", function (event) {
    // show search button
    console.log(event.target);
    // select city input field
    var cityInput = document.querySelector("#city-input");
    
    // take user input, push into array, save to local storage
    searchedCities.push(cityInput.value);
    localStorage.setItem("city-list", JSON.stringify(searchedCities));

    // use function to display city search history onto page
    renderCityList();
});

// function to display list of searched cities
function renderCityList() {
    // select element where buttons are going to be added
    var cityList = $("#city-list");

    // looping thru each item in searchedCities array
    for(var i = 0; i < searchedCities.length; i++){
        // display list of searched cities
        console.log(searchedCities[i]);

        // create button for each item, add class and city name
        var button = $("<button>").addClass("city-button").text(searchedCities[i]);
        // create line break
        var line = $("<br>");
    }

    // append button to cityList
    $(cityList).append(line);
    $(cityList).prepend(button);
    $(cityList).prepend(line);
}

// calling function to display searchedCities
renderCityList();