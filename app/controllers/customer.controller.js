const Customer = require('../models/customer.model');

exports.create = (req,res)=>{
    if(req.body.uid && req.body.name && req.body.email && req.body.phone) {
        const customer = new Customer({
            uid: req.body.uid,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.body.image?req.body.image:'',
            account_number: req.body.account_number?req.body.account_number:null,
            account_holder_name: req.body.account_holder_name?req.body.account_holder_name:null,
            ifsc: req.body.ifsc?req.body.ifsc:null
        });
        customer.save((err,data)=>sendData(err,data,req,res));
    } else sendData('Missing request body params [uid/name/email/phone]',null,req,res);
};

exports.get = (req,res)=>{
    if(req.query.id) Customer.findById(req.query.id, (err,data)=>sendData(err,data,req,res));
    else if(req.query.uid) Customer.findOne({ uid: req.query.uid }, (err,data)=>sendData(err,data,req,res));
    else if(req.query.q==='all') Customer.find({}, (err,data)=>sendData(err,data,req,res));
    else sendData('Invalid query params, allowed = [ id/uid/q ]',null,req,res);
};


exports.update = (req,res)=>{
    if(req.body) Customer.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err,data)=>sendData(err,data,req,res));
    else sendData('Missing request body',null,req,res);
};

exports.delete = (req,res) => Customer.findByIdAndRemove(req.params.id, (err,data)=>sendData(err,data,req,res));

function sendData(err,data=null,req,res) {
    if(err) {
        res.status(400).json({ error: err });
        console.log('[!ERR'+req.method+'] '+req.url);
    } else {
        res.status(200).send(data);
        console.log('['+req.method+'] '+req.url);
    }
}