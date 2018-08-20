const Order = require('../models/order.model');
const Item = require('../models/item.model');
const Customer = require('../models/customer.model');

exports.create = (req,res) => {
    if(req.body.delivery_location_latitude && req.body.delivery_location_longitude && req.body.customer && req.body.items) {
        Customer.findById(req.body.customer, (errCustomer,dataCustomer)=>{
            if(errCustomer || dataCustomer===null) sendData(errCustomer|'Customer with provided ID not found',null,req,res);
            else {
                const selectedItems = {};
                req.body.items.map((itemId,index)=>{
                    Item.findById(itemId, (errItem,dataItem)=>{
                        if(errItem || dataItem===null) sendData(errItem|'Item with provider ID not found',null,req,res);
                        else {
                            if(!selectedItems.hasOwnProperty(dataItem.store._id)) selectedItems[dataItem.store._id] = [];
                            selectedItems[dataItem.store._id].push(dataItem);
                        }
                        
                        if(index===req.body.items.length-1) {
                            Object.keys(selectedItems).map(storeId=>{
                                const order = new Order({
                                    delivery_location_latitude: req.body.delivery_location_latitude,
                                    delivery_location_longitude: req.body.delivery_location_longitude,
                                    customer: dataCustomer,
                                    items: selectedItems[storeId]
                                });
                                order.save((err,data)=>sendData(err,data,req,res));
                            });
                        }
                    });
                });
            }
        });
    } else sendData('Missing request body params [delivery_location_latitude,delivery_location_longitude,customer,store,items]',null,req,res);
};

exports.get = (req,res) => {
    if(req.query.id) Order.findById(req.query.id, (err,data)=>sendData(err,data,req,res));
    else if(req.query.store && req.query.status) Order.find({ 'store._id': req.query.store, status: req.body.status }, (err,data)=>sendData(err,data,req,res));
};

exports.update = (req,res) => {
    if(req.body.status && ['WAIT','ACK','COMPLETE'].includes(req.body.status.toUpperCase())) Order.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } }, { new: true }, (err,data)=>sendData(err,data,req,res));
    else sendData('Missing request body param [status] or invalid value provided. [ WAIT/ACK/COMPLETE ]');
};

exports.delete = (req,res) => Order.findByIdAndRemove(req.params.id, (err,data)=>sendData(err,data,req,res));

function sendData(err,data,req,res) {
    if(err) {
        res.status(400).json({ error: err });
        console.log('[!ERR-'+req.method+'] '+req.url);
    } else {
        res.status(200).send(data);
        console.log('['+req.method+'] '+req.url);
    }
}