const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.redirect('/search')
})

router.get('/search', (req, res) => {
  console.log(`new connection at ${req.url};`)
  console.log(`method: ${req.method}`)
  console.log()
  res.render('search')
})

module.exports = router
