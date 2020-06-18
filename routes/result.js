const { Router } = require('express')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var rp = require('request-promise')
const router = Router()

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
  function zap (url) {
      return new Promise( (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url)
        xhr.setRequestHeader("User-Agent", "Request-promise")
        xhr.setRequestHeader("X-API-KEY", "635b82ed-9445-41ee-8360-b5efdad83d43")
        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.responseText)
            } else {
                resolve(JSON.parse(xhr.responseText))
            }
        }
        xhr.onerror = () => {
            reject(xhr.responseText)
        }
        xhr.send()
    })
  }

  function update(req, res, next) {
    var genre = req.body.genre
    var rfrom = req.body.rfrom
    var rto = req.body.rto
    var yfrom = req.body.yfrom
    var yto = req.body.yto
    if (!(yfrom)) yfrom = 1
    if (!(yto)) yto = 2020
    genre = genres[genre]
    var baseurl = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-filters?order=RATING"
    var finurl = `${baseurl}&genre=${genre}&ratingFrom=${rfrom}&ratingTo=${rto}&yearFrom=${yfrom}&yearTo=${yto}&page=`
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
        for (i = 2; i < response.pagesCount; i++) {
            zap(finurl + String(i))
            .then( newdata => response.films = response.films.concat(newdata.films) )
            .catch( error => console.error(error) )
        }
        setTimeout(() => {
            response.films.forEach( (el, index) => {
                var c = el.countries.map( co => {
                    return co.country;
                }).join(',')

                var g = el.genres.map( ge => {
                    return ge.genre;
                }).join(',')

                if (!(el.filmLength)) {
                    response.films[index].filmLength = "Не найдено"
                }
                response.films[index].countries = c
                response.films[index].genres = g
            })
            req.films = response.films
            next()
        }, 1000)
    })
    .catch(function (err) {
        req.error = err
        next(err)
    })
  }

  router.get('/films/:filmid', (req, res) => {
    console.log(`new connection at /res${req.url};`)
    console.log(`method: ${req.method}`)
    console.log()
    zap('https://kinopoiskapiunofficial.tech/api/v2.1/films/' + req.params.filmid)
    .then(desc => {
        var film = desc.data
        var c = film.countries.map( co => {
            return co.country;
        }).join(',')

        var g = film.genres.map( ge => {
            return ge.genre;
        }).join(',')

        if (!(film.filmLength)) {
            film.filmLength = "Не найдено"
        }
        film.countries = c
        film.genres = g
        if (!(film.description)) {
            film.description = "Не найдено"
        }
        res.render('sresult', {
            film: film
        })
    })
    .catch(err => console.error(err))
  })

  router.use(update)

  router.post('/', (req, res) => {
    console.log(`new connection at /res${req.url};`)
    console.log(`method: ${req.method}`)
    console.log()
    res.render('result', {
        films: req.films
    })
  })

  module.exports = router