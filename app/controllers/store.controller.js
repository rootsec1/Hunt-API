const Store = require('../models/store.model');

exports.create = (req,res)=>{
    if(req.body.uid && req.body.name && req.body.category && req.body.phone && req.body.email && req.body.latitude && req.body.longitude) {
        const store = new Store({
            uid: req.body.uid,
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            category: req.body.category,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            image: req.body.image?req.body.image:'',
            delivery_distance_threshold: req.body.delivery_distance_threshold?req.body.delivery_distance_threshold:null,
            extra_distance_unit_cost: req.body.extra_distance_unit_cost?req.body.extra_distance_unit_cost:null,
            account_number: req.body.account_number?req.body.account_number:null,
            account_holder_name: req.body.account_holder_name?req.body.account_holder_name:null,
            ifsc: req.body.ifsc?req.body.ifsc:null,
            rating: req.body.rating?req.body.rating:null
        });
        store.save((err,data)=>sendData(err,data,req,res));
    } else sendData('Missing request body params [uid/name/category/phone/email/latitude/longitude]',null,req,res);
};

exports.get = (req,res)=>{
    if(req.query.q==='all') Store.find({}, (err,data)=>sendData(err,data,req,res));
    else if(req.query.latitude && req.query.longitude) {
        //Find all nearby stores
    }
    else if(req.query.uid) Store.findOne({ uid: req.params.uid }, (err,data)=>sendData(err,data,req,res));
};

exports.update = (req,res)=>{
    if(req.body) Store.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err,data)=>sendData(err,data,req,res));
    else sendData('Missing request body',null,req,res);
};

exports.delete = (req,res)=>{
    Store.findByIdAndRemove(req.params.id, (err,data)=>sendData(err,data,req,res));
};

function sendData(err,data,req,res) {
    if(err) {
        res.status(400).json({ error: err });
        console.log('[!'+req.method+'] '+req.url);
    } else res.status(200).send(data);
}