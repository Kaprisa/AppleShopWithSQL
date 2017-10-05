const express = require('express')
var favicon = require('serve-favicon')
const sql = require('mssql')
const session = require('express-session')
const MssqlStore = require('connect-mssql')(session)
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const promisify = require('es6-promisify')
const expressValidator = require('express-validator')
const routes = require('./routes/index')
const helpers = require('./helpers')
const errorHandlers = require('./handlers/errorHandlers')
require('./handlers/passport')
const mssqlConfig = require('./db')

const app = express()

app.use(favicon(path.join(__dirname, 'public/images', 'apple.ico')))

app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(expressValidator())

app.use(cookieParser())

const options = {
  table: 'Sessions',
  ttl: 3600,
  autoRemoveInterval: 3600,
  autoRemoveCallback: function() { console.log('Expired sessions were removed') }
}

app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MssqlStore(mssqlConfig, options)
}))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  req.login = promisify(req.login, req)
  next()
})

app.use( async (req, res, next) => {
  if (req.user) {
    const query =
      `SELECT Count(*) AS count, SUM(P.Price) AS price FROM ShoppingCards S
       JOIN Products P
       ON P.ID = S.ProductID
       WHERE UserID = ${req.user.ID}`
    const { recordset: [ { count, price } ] } = await new sql.Request().query(query)
    res.locals.card = {
      count,
      price: price || 0
    }
  }
  const { recordset: types } = await new sql.Request().query('SELECT * FROM ProductTypes WHERE ID IN (Select TypeID FROM ProductModels)')
  res.locals.types = types
  res.locals.h = helpers
  res.locals.user = req.user || null
  res.locals.currentPath = req.path
  next()
})

app.use('/', routes)

app.use(errorHandlers.notFound)

if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors)
}

app.use(errorHandlers.productionErrors)

module.exports = app
