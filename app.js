const express = require('express');
const app = express();
const morgan = require('morgan');   //this package is for logging get/post requests on the server

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

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
    res.status(err.status || 500);
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