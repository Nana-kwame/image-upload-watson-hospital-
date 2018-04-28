var mongoose = require("mongoose");

mongoose.connect("mongodb://nanaKwame:adomako21@ds157320.mlab.com:57320/image-upload");

var mongoSchema = mongoose.Schema;

var imageSchema = {
    
    "filename": String,
    "originalName": String,
    "desc": String,
    "hosID": String,
    "created":  { type: Date, default: Date.now }
};

module.exports = mongoose.model('Image', imageSchema);