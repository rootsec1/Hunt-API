module.exports = (app) => {
    const customers = require('../controllers/customer.controller');
    const ext = require('../../config').BASE_URL+'customers';

    app.post(ext, customers.create);
    app.get(ext, customers.get);
    app.put(ext+'/:id', customers.update);
    app.delete(ext+'/:id', customers.delete);
};