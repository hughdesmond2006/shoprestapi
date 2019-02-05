const express = require('express');
const app = express();
const morgan = require('morgan');   //this package is for logging get/post requests on the server
const bparser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(
    'mongodb://hugh:' +
    process.env.MONGO_ATLAS_PW +
    '@scoopycluster-shard-00-00-qdudo.mongodb.net:27017,scoopycluster-shard-00-01-qdudo.mongodb.net:27017,scoopycluster-shard-00-02-qdudo.mongodb.net:27017/test?ssl=true&replicaSet=scoopycluster-shard-0&authSource=admin&retryWrites=true',
    {
        useNewUrlParser: true
    }
);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bparser.urlencoded({extended: false}));
app.use(bparser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//routes that handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//if you react this line then nothing before could handle the request so its an error
app.use((req, res, next) => {
    const error = new Error('Not Found!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

/**app.use((req, res, next) => {
    res.status(200).json({
        message: 'it works!'
    });
});**/

module.exports = app;