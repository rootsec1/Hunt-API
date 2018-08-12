const Store = require('../models/store.model');
const Item = require('../models/item.model');

exports.create = (req,res)=>{
    if(req.body.uid && req.body.name && req.body.department && req.body.phone && req.body.email && req.body.latitude && req.body.longitude && req.body.delivery_service) {
        const store = new Store({
            uid: req.body.uid,
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            department: req.body.department,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            image: req.body.image?req.body.image:'',
            //Delivery
            delivery_service: req.body.delivery_service,
            delivery_distance_threshold: req.body.delivery_distance_threshold?req.body.delivery_distance_threshold:null,
            extra_distance_unit_cost: req.body.extra_distance_unit_cost?req.body.extra_distance_unit_cost:null,
            //Account Details
            account_number: req.body.account_number?req.body.account_number:null,
            account_holder_name: req.body.account_holder_name?req.body.account_holder_name:null,
            ifsc: req.body.ifsc?req.body.ifsc:null
        });
        store.save((err,data)=>sendData(err,data,req,res));
    } else sendData('Missing request body params [uid/name/category/phone/email/latitude/longitude]',null,req,res);
};

exports.get = (req,res)=>{
    if(req.query.uid) Store.findOne({ uid: req.params.uid }, (err,data)=>sendData(err,data,req,res));
    else if(req.query.id) Store.findById(req.query.id, (err,data)=>sendData(err,data,req,res));
    else if(req.query.q==='all') Store.find({}, (err,data)=>sendData(err,data,req,res));
};

exports.update = (req,res)=>{
    if(req.body) {
        Store.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err,data) => {
            if(data) Item.updateMany({ 'store._id': req.params.id }, { $set: { store: data } }, { new: true }, (errItem,dataItem) => sendData(err|errItem,data,req,res));
            else sendData(err|'Store with provided ID not found',null,req,res);
        });
    }
    else sendData('Missing request body',null,req,res);
};

exports.delete = (req,res) => {
    Store.findByIdAndRemove(req.params.id, (err,data)=>{
        if(data) Item.deleteMany({ 'store._id': req.params.id }, (errItem,dataItem) => sendData(err|errItem,data,req,res));
        else sendData(err|'Store with provider ID not found',null,req,res);
    });
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