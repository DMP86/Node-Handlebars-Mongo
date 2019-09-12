const {Router} = require('express')
const router = Router()
const Frame = require('../models/frame')

router.get('/', async (req, res) => {
    const frames = await Frame.getAll()
    res.render('index', {
        title: 'Главная NodeJS',
        isFrameworks: true,
        frames,
        date: new Date(),
        isHome: true
    })
  }
)
router.post('/', async (req, res) => {
    const frame = new Frame (req.body.title, req.body.url)
    console.log( await frame.save())
    res.redirect('/')
})

module.exports = router