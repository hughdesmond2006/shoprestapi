const express = require('express');
const router = express.Router();

//200 status = successful fetch...
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders have been fetched'
    });
});

//201 status = resource created successfully..
router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: 'Order was created!',
        order: order
    });
});

router.get('/:orderId', (req, res, next) =>{
    res.status(200).json({
        message: 'Order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) =>{
    res.status(200).json({
        message: 'Order deleted',
        orderId: req.params.orderId
    });
});

module.exports = router;
