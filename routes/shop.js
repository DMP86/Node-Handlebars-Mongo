const {Router} = require('express')
const router = Router()
const { check } = require('../middleware/passport-local')

const Shop = require('../models/mongooseShop')

router.get('/', check, async (req, res) => {
    const shops = await Shop.find()
    res.render('shops', {
    title: 'Магазин сайтов',
    isScript: true,
    shops
    })
})

module.exports = router