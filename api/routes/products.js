const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

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

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return{
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage ? "http://localhost:3000/" + doc.productImage.toString().replace("\\", '/').replace(/\s/g, '%20') : undefined,
                        _id: doc._id,
                        request:{
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };

            console.log(response);

            //if returns empty array, then its an error??
            /**if(docs.length >= 0){
                res.status(200).json(docs)
            } else {
                res.status(404).json({
                    message: 'no valid entry found for this ID'
                });
            }**/

            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({
                error: err
            });
        });
});

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'created product!!',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:productId', (req, res, next) =>{
    const id = req.params.productId;

    //Dummy response
    /**if(id === "special"){
        res.status(200).json({
            message: 'You got the special ID',
            id: id
        });
    }else{
        res.status(200).json({
            message: 'You passed an ID'
        });
    }**/

    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("from db:" + doc);
            if(doc){
                res.status(200).json({
                    product: doc,
                    request:{
                        type: 'GET',
                        description: 'Get All Products',
                        url: 'http://localhost:3000/products/'
                    }
                })
            } else {
                res.status(404).json({
                    message: 'no valid entry found for this ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.patch('/:productId', checkAuth, (req, res, next) =>{
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product Updated!!',
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.delete('/:productId', checkAuth, (req, res, next) =>{
    const id = req.params.productId;
    Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Deleted!!',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    body: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

module.exports = router;
