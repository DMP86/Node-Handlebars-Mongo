const passport = require('passport')
const Local = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user')
const flash = require('connect-flash')

passport.use ( 
    new Local ( {passReqToCallback: true , usernameField: 'email'} , async (req, email, password, done) => {
      try{ 
        const user = await User.findOne({email})

        if(!user) return done(null, false, req.flash('logError', 'Нет такого пользователя'))

        if(user) {
            const isPass = await bcrypt.compare(password, user.password)

            if(!isPass) return done(null, false, req.flash('logError', 'Не корректный пароль'))

            console.log(isPass)
            if(isPass) {
                delete user.password
                return done(null, user) 
            }
        }
    } catch (e) { console.log(e) }
}))

passport.serializeUser( (user, done) => {
    done(null, user._id);
})
  
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id)
    delete user.password
    done(null, user)
})

 
module.exports = {
    init: passport.initialize(),
    session: passport.session(),
    auth: passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: 'login'
    }),
    check: (req, res, next) => {
 
        if(req.user) return next()
        res.redirect('/login')
    }
}
 
 
 
  /*
  const session = require('express-session')
  const redis = require('redis')
  const redisStorage = require('connect-redis')(session)
  const client = redis.createClient() */