const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
//LOCAL
const config = require('./config');

mongoose.Promise = global.Promise;
const app = express();
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req,res)=>{
    res.status(200).json({ message: 'All API requests should be pointed at /api/v1/' });
    console.log('[GET] '+req.url);
});

require('./app/routes/store.routes')(app);
require('./app/routes/item.routes')(app);
require('./app/routes/customer.routes')(app);
app.listen(config.PORT, ()=>{
    console.log('[SERVER] Listening on PORT '+config.PORT);
    mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true }).then(()=>{
        console.log('[MONGODB] Connected to Database')
    }).catch(err=>{
        console.log('[!ERR-MONGODB] Error connecting to DB. '+err+'\nExiting...');
        process.exit();
    });
});