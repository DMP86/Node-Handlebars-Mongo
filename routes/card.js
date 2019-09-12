const {Router} = require('express')
const router = Router()
const { check } = require('../middleware/passport-local')
const Shop = require('../models/mongooseShop')

router.get('/', check, async(req, res) => {
    const user = await req.user
    .populate('cart.items.shopID').execPopulate()
    

    const cost = user.cart.items.reduce((sum, item) => sum += item.shopID.price * item.count , 0)

    res.render('card', {
        title: 'Корзина',
        isCard: true,
        cart: user.cart.items,
        cost
    })
})

router.post('/add', check, async (req, res) => {
    const shop = await Shop.findById(req.body.id)
    try { 
        await req.user.addToCart(shop)
        res.redirect('/card') 
    } catch(e) { console.log(e) }
})

router.delete('/remove/:id', check, async (req, res) => {
    try { 
        await req.user.removeFromCart(req.params.id)
        //res.status(200).json(req.user.cart.items)
        res.status(200).send()
    } catch(e) { console.log(e) }
})

module.exports = router