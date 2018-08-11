module.exports = (app) => {
    const stores = require('../controllers/store.controller');
    const ext = require('../../config').BASE_URL+'stores';

    app.post(ext, stores.create);
    app.get(ext, stores.get);
    app.put(ext+'/:id', stores.update);
    app.delete(ext+'/:id', stores.delete);
};