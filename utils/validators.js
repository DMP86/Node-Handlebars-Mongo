const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body('email').isEmail().withMessage('Введите корректный email')
    .custom( async value => {
        const user = await User.findOne({ email: value}).catch(e => console.log(e))
        if(user) return Promise.reject('Такой пользователь уже существует')  
    }).normalizeEmail(),
    body('password', 'Пароль от 5 до 64 символов').isLength({min: 5, max: 64}).isAlphanumeric(),
    body('confirm').custom((value, {req}) => {
        if(value !== req.body.password) throw new Error('Пароли должны совпадать')
        return true
    })
]