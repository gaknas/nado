const { Router } = require('express')
const router = Router()

router.get('/', (req, res) => {
  res.redirect('/search')
})

router.get('/search', (req, res) => {
  res.render('search')
})

module.exports = router
