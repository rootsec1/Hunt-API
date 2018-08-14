const Item = require('../models/item.model');
const Store = require('../models/store.model');

exports.create = (req,res)=>{
    if(req.body.product_id && req.body.name && req.body.subcategory && req.body.category && req.body.price && req.body.store) {
        Store.findById(req.body.store, (err,data)=>{
            if(err || data===null) sendData('Store with provided ID not found',null,req,res);
            else {
                const item = new Item({
                    product_id: req.body.product_id,
                    name: req.body.name,
                    subcategory: req.body.subcategory,
                    category: req.body.category,
                    price: req.body.price,
                    store: data,
                    image: req.body.image?req.body.image:'',
                    discount: req.body.discount?req.body.discount:0
                });
                item.save((err,data)=>sendData(err,data,req,res));
            }
        });
    } else sendData('Missing request body params',null,req,res);
};

exports.get = (req,res)=>{
    if(req.query.id) Item.findById(req.query.id, (err,data)=>sendData(err,data,req,res));
    else if(req.query.query) {
        const query = { $or: [{ name: { $regex: req.query.query, $options: 'i' }}, { subcategory: { $regex: req.query.query, $options: 'i' }}] };
        Item.find(query).sort({ priority: 'desc' }).exec((err,data)=>sendData(err,data,req,res));
    }
    else if(req.query.uid && req.query.category && req.query.subcategory) Item.find({ 'store.uid': req.query.uid, category: req.query.category, subcategory: req.query.subcategory }, (err,data)=>sendData(err,data,req,res));
    else if(req.query.uid && req.query.category) Item.find({ 'store.uid': req.query.uid, category: req.query.category }, (err,data)=>sendData(err,data,req,res));
    else if(req.query.uid) Item.find({ 'store.uid': req.query.uid }, (err,data)=>{
        if(data.length) { 
            let categories = {};
            data.map(item=>{
                if(!categories.hasOwnProperty(item.category)) categories[item.category] = [];
                categories[item.category].push(item);
            });
            sendData(err,categories,req,res);
        } else sendData(err|'No items present',null,req,res);
    });
};

exports.update = (req,res)=>{
    if(req.body) Item.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err,data)=>sendData(err,data,req,res));
    else sendData('Missing request body',null,req,res);
};

exports.delete = (req,res) => Item.findByIdAndRemove(req.params.id, (err,data)=>sendData(err,data,req,res));

function sendData(err,data,req,res) {
    if(err) {
        res.status(400).json({ error: err });
        console.log('[!ERR-'+req.method+'] '+req.url);
    } else {
        res.status(200).send(data);
        console.log('['+req.method+'] '+req.url);
    }
}