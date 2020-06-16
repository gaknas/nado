var genres = {
    'аниме': 1750,
    'биография': 22,
    'боевик': 3,
    'вестерн': 13,
    'военный': 19,
    'детектив': 17,
    'детский': 456,
    'для взрослых': 20,
    'документальный': 12,
    'драма': 8,
    'игра': 27,
    'история': 23,
    'комедия': 6,
    'концерт': 1747,
    'короткометражка': 15,
    'криминал': 16,
    'мелодрама': 7,
    'музыка': 21,
    'мультфильм': 14,
    'мюзикл': 9,
    'новости': 28,
    'приключения': 10,
    'реальное ТВ': 25,
    'семейный': 11,
    'спорт': 24,
    'ток-шоу': 26,
    'триллер': 4,
    'ужасы': 1,
    'фантастика': 2,
    'фильм-нуар': 18,
    'фэнтези': 5,
    'церемония': 1751
}

$.ajaxSetup({
    headers: {
        "X-API-KEY":"635b82ed-9445-41ee-8360-b5efdad83d43",
    },
});

$(function(){

    $("#buttonSearch").click(
        function(){
            updateFilmsInfo();
        }
    );
    
});


function shablon(film){
    var test = "test";

    return `
        <div class="item">
        <h1>
            ${film.nameRu}
        </h1>
        <img class="poster" src="${film.posterUrl}" alt="Постер">
        <table>
            <tbody>
                <tr>
                    <td class="type">Год</td>
                    <td> ${film.year} </td>
                </tr>
                <tr>
                    <td class="type">длительность </td>
                    <td>  ${film.filmLength}</td>
                </tr>
                <tr>
                    <td class="type"> страна </td>
                    <td>  ${film.countries}</td>
                </tr>
                <tr>
                    <td class="type"> жанр</td>
                    <td>  ${film.genres}</td>
                </tr>
            </tbody>
        </table>
        <div class="desc">
            <h2>Описание</h2>
            <p>
                ${film.description}
             </p>
        </div>
    </div>
    `;
}

function updateFilmsInfo(){
    $('#content').empty()
    $('#content').html("<h1>Загрузка...</h1>")
    var baseurl = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-filters?order=RATING"
    var genre = $("#genre").val()
    var rfrom = $("#rfrom").val()
    var rto = $("#rto").val()
    var yfrom = $("#yfrom").val()
    var yto = $("#yto").val()
    console.log(rfrom, rto)
    if (rto < rfrom) {
        var promez = 0
        promez = rto
        rto = rfrom
        rfrom = promez
        delete promez
    }
    console.log(rfrom, rto)
    var finurl = `${baseurl}&genre=${genres[genre]}&ratingFrom=${rfrom}&ratingTo=${rto}&yearFrom=${yfrom}&yearTo=${yto}&page=`
    $.ajax({
        url: finurl + "1",
        method: 'GET',
        success: function (data) {
            var pc = data.pagesCount
            for (i = 2; i < pc; i++) {
                $.ajax({
                    url: finurl + String(i),
                    method: 'GET',
                    async: false,
                    success: function (newdata) {
                        data.films = data.films.concat(newdata.films)
                    },
                    error: (e) => {
                        console.log(e.responseText)
                    }
                })
            }
            data.films.forEach( (el, index) => {
                var checker = false

                var c = el.countries.map( co => {
                    return co.country;
                }).join(',')

                var g = el.genres.map( ge => {
                    return ge.genre;
                }).join(',')

                data.films[index].countries = c
                data.films[index].genres = g
            })
            
            while (1) {
                var ind = data.films.indexOf(null)
                if (ind == -1) {
                    break
                } else {
                    data.films.splice(ind, 1)
                }
            }

            data.films.forEach( (el,index) => {
                console.log(el.filmId);
                $.ajax({
                    url: 'https://kinopoiskapiunofficial.tech/api/v2.1/films/' + el.filmId,
                    method: 'GET',
                    async: false,
                    success: function (filmData) {
                        data.films[index].description = filmData.data.description
                    },
                    error: function () {
                        data.films[index].description = "Описание не найдено"
                    }
                });
            });

            var a = data.films.map( el => {
                return shablon(el);
            });

            var stringItems = a.join(' ');

            $('#content').empty();

            if (data.films.length == 0){
                $('#content').html("<h1>Результатов нет</h1>")
            }else{
                $('#content').html(stringItems);
            }
            
        },
        error: (e) => {
            $('#content').html("<h1>Результатов нет</h1>")
            console.log(e.responseText)
        }
    });
}