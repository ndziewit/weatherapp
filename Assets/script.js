$(document).ready(function() {

    var city = "";
    var cityList = JSON.parse(localStorage.getItem("cityList")); 
    if(cityList === null){
        cityList = [];
    } else{
        searchHistory();
        callAPI(cityList[cityList.length - 1]);
    }
    
    function outputDate(x){
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + x);
        var m = currentDate.getMonth() + 1;
        var d = currentDate.getDate();
        var y = currentDate.getFullYear();
        return m + "/" + d + "/" + y;
    }
    
    function callAPI(x){
        city = x;
        var apiKey = "1038457a8b05ec14177bf42c8664144d";
        
        var query = "https://api.openweathermap.org/data/2.5/forecast/?units=imperial&cnt=6&q=" + city + "&appid=" + apiKey;
        
        $.ajax({
            url:query,
            method:"GET"
        }).then(function(response){ 
            $('#city').text(city);
            $('#five-day').empty();
            for(var i = 0; i < 6; i++){
                if (i === 0){
                    $('#date').text(" as of " + outputDate(i));
                    $('#temp').text(parseInt(response.list[i].main.temp));
                    $('#humidity').text(response.list[i].main.humidity);
                    $('#wind').text(response.list[i].wind.speed);
                    var icon = "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png"
                    $('#icon').attr("src", icon);
                } else {
                    var newDiv = $('<div>').addClass('forecast').addClass('col-md-2');
                    var dateObj = $('<div>').text(outputDate(i));
                    newDiv.append(dateObj);
                    var weatherIcon = $('<img>').attr("src", "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + ".png")
                    newDiv.append(weatherIcon);
                    var temp = $('<div>').text("Temp: " + parseInt(response.list[i].main.temp));
                    newDiv.append(temp);
                    var humidity = $('<div>').text("Humidity: " + response.list[i].main.humidity);
                    newDiv.append(humidity);
    
                    $('#five-day').append(newDiv);
                }
            }
            
        })
    }
        
    function setStorage(){
        localStorage.setItem("cityList", JSON.stringify(cityList));
    }
    
    function searchHistory(){
        $('#past-cities').empty();
        if(cityList.length > 10){
            cityList.shift();
        }
        for(var i = 0; i < cityList.length; i++){
            var cityDiv = $('<div>');
            cityDiv.text(cityList[i]);
            cityDiv.addClass('city-list');
            $('#past-cities').prepend(cityDiv);
        }
    }

        $('#search-button').on("click", function(){
        city = $('#search-box').val();
        cityList.push(city);
        setStorage();
        searchHistory();
        callAPI(city);
    })
              

    $(document).on("click", ".city-list" , function() {
        callAPI($(this).html());
    });
    
    
    });