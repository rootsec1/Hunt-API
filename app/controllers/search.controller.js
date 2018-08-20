const Search = require('../models/search.model');

exports.create = (req,res)=> {
    if(req.body.name) {
        Search.findOne({ name: req.body.name }, (err,data)=>{
            if(err) sendData(err,null,req,res);
            else if(data) Search.findByIdAndUpdate(data._id, { $set: { count: data.count+1 } }, { new: true }, (err,data)=>sendData(err,data,req,res));
            else {
                const search = new Search({ name: req.body.name });
                search.save((err,data)=>sendData(err,data,req,res));
            }
        });
    } else sendData('Post body param [name] does not exist.',null,req,res);
};

exports.get = (req,res)=>{
    if(req.query.id) Search.findById(req.query.id, (err,data)=>sendData(err,data,req,res));
    else Search.find({}, (err,data)=>sendData(err,data,req,res));
};

exports.delete = (req,res) => Search.findByIdAndRemove(req.params.id, (err,data)=>sendData(err,data,req,res));

function sendData(err,data,req,res) {
    if(err) {
        res.status(400).json({ error: err });
        console.log('[!ERR-'+req.method+'] '+req.url);
    } else {
        res.status(200).send(data);
        console.log('['+req.method+'] '+req.url);
    }
}