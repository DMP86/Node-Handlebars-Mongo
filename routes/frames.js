const {Router} = require('express')
const router = Router()
const Frame = require('../models/frame')

router.get('/:id', async (req, res) => {
    const frame = await Frame.getById(req.params.id)
    res.render('framework', {
        title: `${frame.name}`,
        frame
    })
})

router.post('/add', async (req, res) => {
    const shop = new Frame({
        title: req.body.title,
        price: req.body.price,
        img: req.body.url
    })

    try{
        await Frame.save(shop)
        res.redirect('/') 
    } catch(e) { console.log(e) }
    
})


module.exports = router