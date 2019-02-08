const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

//200 status = successful fetch...
router.get('/', checkAuth, OrdersController.orders_get);

//201 status = resource created successfully..
router.post('/', checkAuth, OrdersController.order_create);

router.get('/:orderId', checkAuth, OrdersController.order_getone);

router.delete('/:orderId', checkAuth, OrdersController.order_delete);

module.exports = router;
