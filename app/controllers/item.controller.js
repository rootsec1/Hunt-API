const Item = require('../models/item.model');
const Store = require('../models/store.model');
const config = require('../../config');
const request = require('request');

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
                    discount: req.body.discount?req.body.discount:0,
                    colors: req.body.colors?req.body.colors:null
                });
                item.save((err,data)=>sendData(err,data,req,res));
            }
        });
    } else sendData('Missing request body params',null,req,res);
};

exports.get = (req,res)=>{
    if(req.query.uid && req.query.id) Item.findById(req.query.id, (err,data)=>sendData(err,data,req,res));
    else if(req.query.uid && req.query.latitude && req.query.longitude && req.query.department) {
        //UID = Customer UID
        Item.find({ 'store.department': req.query.department }, (errItems1,dataItems1)=>{
            if(errItems1 || dataItems1.length===0) sendData(errItems1||'No items found with the department '+req.query.department, null, req,res);
            else {
                const itemsInRadius = [];
                let lat2 = req.query.latitude;
                let lon2 = req.query.longitude;

                dataItems1.map((item,index)=>{
                    const storeDistanceThreshold = item.store.delivery_distance_threshold;
                    let lat1 = item.store.latitude;
                    let lon1 = item.store.longitude;

                    var R = 6371; // km
                    var dLat = toRad(lat2-lat1);
                    var dLon = toRad(lon2-lon1);
                    lat1 = toRad(lat1);
                    lat2 = toRad(lat2);
                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                    var separationDistance = (R * c)/1000;
                    
                    if(separationDistance<=storeDistanceThreshold) itemsInRadius.push(item);
                    if(index===dataItems1.length-1) sortItemsIntoCategories(itemsInRadius, (categories)=>sendData(null,categories,req,res));
                });
            }
        });
    }
    else if(req.query.uid && req.query.latitude && req.query.longitude && req.query.query) {
        //UID = Store UID
        console.log('Here');
        const query = { 'store.uid': req.query.uid, $or: [{ name: { $regex: req.query.query, $options: 'i' }}, { subcategory: { $regex: req.query.query, $options: 'i' }}, { category: { $regex: req.query.query, $options: 'i' }}] };
        Item.find(query, (errItems,dataItems)=>{
            if(!errItems && dataItems.length) {
                
            } else sendData('No nearby places that have '+query,null,req,res);
        });
    }
    else if(req.query.uid && req.query.query) {
        const query = { 'store.uid': req.query.uid, $or: [{ name: { $regex: req.query.query, $options: 'i' }}, { subcategory: { $regex: req.query.query, $options: 'i' }}, { category: { $regex: req.query.query, $options: 'i' }}] };
        Item.find(query, (err,data)=>sendData(err,data,req,res));
    }
    else if(req.query.uid && req.query.category && req.query.subcategory) Item.find({ 'store.uid': req.query.uid, category: req.query.category, subcategory: req.query.subcategory }, (err,data)=>sendData(err,data,req,res));
    else if(req.query.uid && req.query.category) Item.find({ 'store.uid': req.query.uid, category: req.query.category }, (err,data)=>sendData(err,data,req,res));
    else if(req.query.uid && req.query.all==1) Item.find({ 'store.uid': req.query.uid }, (err,data)=>sendData(err,data,req,res));
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

function sortItemsIntoCategories(items, callback) {
    if(items.length) {
        let categories = {};
        items.map(item=>{
            if(!categories.hasOwnProperty(item.category)) categories[item.category] = [];
            categories[item.category].push(item);
        });
        callback(categories);
    } else sendData(err|'No items present',null,req,res);
}

function sendData(err,data,req,res) {
    if(err) {
        res.status(400).json({ error: err });
        console.log('[!ERR-'+req.method+'] '+req.url);
    } else {
        res.status(200).send(data);
        console.log('['+req.method+'] '+req.url);
    }
}

function toRad(Value) {
    return Value * Math.PI / 180;
}