$(document).ready(function() {

    var city = "";
    var cityList = JSON.parse(localStorage.getItem("cityList")); 
    if(cityList === null){
        cityList = [];
    } else{
        searchHistory();
        getWeather(cityList[cityList.length - 1]);
    }

    function setStorage(){
        localStorage.setItem("cityList", JSON.stringify(cityList));
    }
    
        $('#search-button').on("click", function(){
        city = $('#search-box').val();
        cityList.push(city);
        setStorage();
        searchHistory();
        getWeather(city);
    })

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
    
    function getDate(x){
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + x);
        var m = currentDate.getMonth() + 1;
        var d = currentDate.getDate();
        var y = currentDate.getFullYear();
        return m + "/" + d + "/" + y;
    }
    
    function getWeather(x){
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
                    $('#date').text(" as of " + getDate(i));
                    $('#temp').text(parseInt(response.list[i].main.temp));
                    $('#humidity').text(response.list[i].main.humidity);
                    $('#wind').text(response.list[i].wind.speed + " mph");
                    var uvQuery = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + response.city.coord.lat +"&lon=" + response.city.coord.lon
                    getUV(uvQuery);
                    var icon = "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png"
                    $('#icon').attr("src", icon);
                } else {
                    var newDiv = $('<div>').addClass('forecast').addClass('col-md-2');
                    var dateObj = $('<div>').text(getDate(i));
                    var fiveDayIcon = $('<img>').attr("src", "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + ".png")
                    var temp = $('<div>').text("Temp: " + parseInt(response.list[i].main.temp));
                    var humidity = $('<div>').text("Humidity: " + response.list[i].main.humidity);
                    newDiv.append(dateObj);
                    newDiv.append(fiveDayIcon);
                    newDiv.append(temp);
                    newDiv.append(humidity);
    
                    $('#five-day').append(newDiv);
                }
            }
            
        })
    }

    function getUV(x){
        $.ajax({
            url:x,
            method:"GET"
        }).then(function(response){
            var uv = response.value;
            var index = "";
            if(uv < 3){
                index = 'Low';
            } if(uv > 3 && uv < 5){
                index = 'Moderate';
            } if(uv > 5 && uv < 8){
                index = 'High';
            } if(uv > 8 && uv < 11){
                index = 'Extreme';
                uv = "* " + uv + " *";
            }
            $('#uv-index').addClass("uv" + index);
            $('#uv-index').text(uv + " " + index);
        })
    }
    
        
    $(document).on("click", ".city-list" , function() {
        $('#uv-index').removeClass();
        getWeather($(this).html());
    });
    
    
    });