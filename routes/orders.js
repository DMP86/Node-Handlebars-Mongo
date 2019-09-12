const {Router} = require('express')
const router = Router()
const { check } = require('../middleware/passport-local')
const Order = require('../models/order')

router.post('/', check, async (req, res) => {
    if (!req.user.cart.items) res.redirect('/shop')
    try {
        const user = await req.user.populate('cart.items.shopID').execPopulate()
        const items = user.cart.items.map(item => ({
            count: item.count,
            shop: {...item.shopID}
        }))
        const order = new Order({
            shops: items,
            userID: user._id,
            cost: req.body.cost
        })
   
        await order.save()
        await req.user.clearCart()
        res.redirect('/orders')
    } catch(e) { console.log(e) }
})

router.get('/', check, async (req, res) => {
    try {
        const orders = await Order.find({
            userID: req.user._id
        }).populate('userID', 'email')

        res.render('orders', {
            title: 'Заказы',
            orders
        })
 
    } catch(e) { console.log(e) }
})


module.exports = router
