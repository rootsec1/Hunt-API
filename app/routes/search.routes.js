module.exports = (app) => {
    const searches = require('../controllers/search.controller');
    const ext = require('../../config').BASE_URL+'search';

    app.post(ext, searches.create);
    app.get(ext, searches.get);
    app.delete(ext+'/:id', searches.delete);
};