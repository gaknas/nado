const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const createError = require('http-errors')
const nadoRoutes = require('./routes/nado')
const resRoutes = require('./routes/result')

const PORT = process.env.PORT || 3000

const app = express()
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', nadoRoutes)
app.use('/res', resRoutes)

app.use(function(req, res, next) {
  next(createError(404));
})

app.use(errorHandler)
function errorHandler (err, req, res, next) {
  res.status(err.status || 500)
  if (req.error) {
      res.render('error', {
          title: "Error",
          error: err,
          message: req.error.message
      })
  }
  else {
      res.render('error', {
          title: "Error",
          error: err,
          message: err.messange
      })
  }
}

async function start() {
  try {
    app.listen(PORT, () => {
      console.log('Server has been started...')
      console.log()
    })
  } catch (e) {
    console.log(e)
  }
}

start()
