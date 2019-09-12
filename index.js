const express = require('express')
const path = require('path')
const app = express()
const exhb = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose')
const flash = require('connect-flash')
const key = require('./key/key')
const passport = require('./middleware/passport-local')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'images')))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(flash())

const hbs = exhb.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

const store = new MongoStore({
    collection: 'sessions',
    uri: key.Mongo_URI,
}) 

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'pages')

app.use(session({
    secret: 'some secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    },
    store
}))

app.use(passport.init)
app.use(passport.session)
app.use(require('./middleware/middle'))

app.use('/', require('./routes/home'))
app.use('/shop', require('./routes/shop'))
app.use('/frameworks', require('./routes/frames'))
app.use('/card', require('./routes/card'))
app.use('/auth', require('./routes/auth'))
app.use('/orders', require('./routes/orders'))
app.use('/profile', require('./routes/profile')) 


app.use(function(req, res, next) {
    const err = new Error('Not Found')
    err.status = 404
    res.render('error', { err })
})

process.on('unhandlesRejection', (reason, p) => {
    console.log('UnhandlesRejection at : '+ p + ' Reason: '+ reason)
    process.exit(1)
}) // прикручивать к сложным промесам

const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(key.Mongo_URI, {
            useNewUrlParser: true})
        app.listen(PORT, () => {
            console.log(`Server is on port ${PORT}`)
        })
    } catch(e) { 
        console.log(e)
        process.exit(1) }
}

start()

