$.ajaxSetup({
    headers: {
        "X-API-KEY":"f3ea38a6-5767-48e2-82a9-731b2bbf64b3",
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
        <h1 class="name">
            ${film.nameRu}
        </h1>
        <img class="poster2" src="${film.posterUrl}" alt="Постер">
        <table class="info">
            <tbody>
                <tr>
                    <td class="table">Год</td>
                    <td class="vvod"> ${film.year} </td>
                </tr>
                <tr>
                    <td class="table">длительность </td>
                    <td class="vvod">  ${film.filmLength}</td>
                </tr>
                <tr>
                    <td class="table"> страна </td>
                    <td class="vvod">  ${film.countries}</td>
                </tr>
                <tr>
                    <td class="table"> жанр</td>
                    <td class="vvod">  ${film.genres}</td>
                </tr>
            </tbody>
        </table>
        <div class="desc">
            <h2 class="des">Описание</h2>
            <p class="description">
                ${film.description}
             </p>
        </div>
    </div>
    `;
}

function updateFilmsInfo(){
    $('#main').empty();
    $('#main').text("Загрузка...");

    $.ajax({
        url: 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=' + encodeURI($("#search").val()) + '&page=1',
        method: 'GET',
        success: function (data) {
            
            
            data.films.forEach( (el, index) => {

                var c = el.countries.map( co => {
                    return co.country;
                }).join(',');

                var g = el.genres.map( ge => {
                    return ge.genre;
                }).join(',');

                data.films[index].countries = c;
                data.films[index].genres = g;
            });

            
            data.films.forEach( (el,index) => {
                console.log(el.filmId);
                $.ajax({
                    url: 'https://kinopoiskapiunofficial.tech/api/v2.1/films/' + el.filmId,
                    method: 'GET',
                    async: false,
                    success: function (filmData) {
                        data.films[index].description = filmData.data.description;
                    }

                    //TODO обработать fail 
                    //https://stackoverflow.com/questions/8918248/ajax-success-and-error-function-failure
                });
            });

            console.log(data.films);

            var a = data.films.map( el => {
                return shablon(el);
            });

            console.log(a);

            var stringItems = a.join(' ');
            
            console.log(stringItems);

            $('#main').empty();

            if (data.films.length == 0){
                $('#main').text("Результатов нет.");
            }else{
                $('#main').html(stringItems);
            }
            
        }
    });
}