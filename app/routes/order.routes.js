module.exports = (app) => {
    const orders = require('../controllers/order.controller');
    const ext = require('../../config').BASE_URL+'orders';

    app.post(ext, orders.create);
    app.get(ext, orders.get);
    app.put(ext+'/:id', orders.update);
    app.delete(ext+'/:id', orders.delete);
};