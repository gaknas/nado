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
    $('#content').text("Загрузка...")

    $.ajax({
        url: 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=' + encodeURI($("#search").val()) + '&page=1',
        method: 'GET',
        success: function (data) {
            var pc = data.pagesCount
            for (i = 2; i < pc; i++) {
                $.ajax({
                    url: `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURI($("#search").val())}&page=${i}`,
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
            var genre = $("#genre").val()
            data.films.forEach( (el, index) => {
                var checker = false

                var c = el.countries.map( co => {
                    return co.country;
                }).join(',')

                var g = el.genres.map( ge => {
                    return ge.genre;
                })

                g.forEach(ge => {
                    if (ge == genre) {
                        checker = true
                    }
                })

                if (checker) {
                    checker = false
                    g = g.join(',')
                    data.films[index].countries = c;
                    data.films[index].genres = g;
                } else {
                    data.films[index] = null
                }
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
                $('#content').text("Результатов нет.");
            }else{
                $('#content').html(stringItems);
            }
            
        },
        error: (e) => {
            $('#content').text("Результатов нет")
            console.log(e.responseText)
        }
    });
}