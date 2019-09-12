const {Router} = require('express')
const { check } = require('../middleware/passport-local')
const router = Router()
const upload = require('../middleware/file')

router.get('/', check, async (req, res) => {

  res.render('profile', {
    title: 'Профиль',
    isProfile: true,
    user: req.user.toObject()
  })
})

router.post('/', check, upload.single('avatar'), async (req, res) => {
    try{
        console.log(req.file)
        req.user.avatar = req.file.filename
        req.user.name = req.body.name
        await req.user.save()
        res.redirect('/profile')
    } catch(e) { console.log(e) }
})

module.exports = router