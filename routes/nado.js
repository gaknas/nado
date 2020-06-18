const { Router } = require('express')
var rp = require('request-promise')
const router = Router()

function getRand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

router.get('/', (req, res) => {
  res.redirect('/search')
})

router.get('/search', (req, res) => {
  console.log(`new connection at ${req.url};`)
  console.log(`method: ${req.method}`)
  console.log()
  res.render('search', {
    title: "Find a film"
  })
})

router.get('/byname', (req, res) => {
  console.log(`new connection at ${req.url};`)
  console.log(`method: ${req.method}`)
  console.log()
  res.render('byname')
})

router.get('/random', (req, res) => {
  console.log(`new connection at ${req.url};`)
  console.log(`method: ${req.method}`)
  console.log()
  var urlr = `/res/films/${getRand(300, 10000)}`
  res.redirect(urlr)
})

module.exports = router
