const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const key = require('../key/key')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const regMail = require('../emails/registration')
const resetEmail = require('../emails/reset')
const {validationResult} = require('express-validator')
const {registerValidators} = require('../utils/validators')
const passport = require('../middleware/passport-local')

const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: key.Send_Grid}
}))

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        logError: req.flash('logError'),
        regError: req.flash('regError'),
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

router.post('/login', passport.auth )

router.post('/register', registerValidators, async (req, res) => {

    const {email, password} = req.body
    
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            req.flash('regError', errors.array()[0].msg)
            res.status(422).redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, password: hashPassword, cart: { items: [] }
            })
            await user.save()
            res.redirect('/')
            await transporter.sendMail(regMail(email))
        }
    } catch(e) { console.log(e) }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Восстановление пароля',
        error: req.flash('error')
    })
})

router.post('/reset', async (req, res) => {
    try {
        const candidate = await User.findOne({email: req.body.email})
  
        if (candidate) {
            crypto.randomBytes(32, async (err, buffer) => {
                if (err) {
                    req.flash('error', 'Что-то пошло не так, повторите попытку позже')
                    return res.redirect('/auth/reset')
                } else {
                    const token = buffer.toString('hex')
                    console.log("TCL: token", token)
                    candidate.resetToken = token
                    candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                    console.log("TCL: candidate.resetTokenExp ", candidate.resetTokenExp )
                    await candidate.save()
                    await transporter.sendMail(resetEmail(candidate.email, token))
                    res.redirect('/auth/login')
                }
            })
        } else {
            req.flash('error', 'Такого email нет')
            res.redirect('/auth/reset')} 
    } catch (e) { console.log(e) }
})


router.get('/password/:token', async (req, res) => {
  
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })
  
        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
            title: 'Восстановить доступ',
            error: req.flash('error'),
            userId: user._id.toString(),
            token: req.params.token
            })
        }
    } catch (e) {
        console.log(e)
    }   
})

router.post('/password', async (req, res) => {
    try {
      const user = await User.findOne({
        _id: req.body.userId,
        resetToken: req.body.token,
        resetTokenExp: {$gt: Date.now()}
      })
  
        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Время жизни токена истекло')
            res.redirect('/auth/login')
        }
    } catch (e) {
      console.log(e)
    }
  })

module.exports = router

/*
try {
    const {email, password} = req.body
    const candidate = await User.findOne({email})
    if(candidate) {
        const isPass = await bcrypt.compare(password, candidate.password)
        if(isPass) {
            req.session.user = candidate
            req.session.isAuthenticated = true
            req.session.save( err => {
            if(err) throw err
            res.redirect('/')
            })
        } else {
            req.flash('logError', 'Ошибка в пароле')
            res.redirect('/auth/login') }
    } else {
        req.flash('logError', 'Нет такого пользователя')
        res.redirect('/auth/login') }
} catch(e) {console.log(e)} */