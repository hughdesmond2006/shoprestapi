const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products');

//config for multer image upload
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:|\./g,'-') + ' - ' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5   //5mb
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', ProductsController.products_get);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.product_create);

router.get('/:productId', ProductsController.products_getone);

router.patch('/:productId', checkAuth, ProductsController.product_update);

router.delete('/:productId', checkAuth, ProductsController.product_delete);

module.exports = router;
