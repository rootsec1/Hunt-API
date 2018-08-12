module.exports = (app) => {
    const items = require('../controllers/item.controller');
    const ext = require('../../config').BASE_URL+'items';

    app.post(ext, items.create);
    app.get(ext, items.get);
    app.put(ext+'/:id', items.update);
    app.delete(ext+'/:id', items.delete);
};