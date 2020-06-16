var rp = require('request-promise')

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

function updateFilmsInfo(genre, rfrom, rto, yfrom, yto, req, res) {
    if (!(yfrom)) yfrom = 1
    if (!(yto)) yto = 1
    genre = genres[genre]

    var options = {
        uri: 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-filters?',
        qs: {
            genre: genre,
            ratingFrom: rfrom,
            ratingTo: rto,
            yearFrom: yfrom,
            yearTo: yto,
            page: 1
        },
        headers: {
            'User-Agent': 'Request-Promise',
            "X-API-KEY":"635b82ed-9445-41ee-8360-b5efdad83d43",
        },
        json: true
    }

    rp(options)
    .then(function (response) {
        req.films = response.films
    })
    .catch(function (err) {
        req.error = err
        next(err)
    })
}

module.exports = updateFilmsInfo