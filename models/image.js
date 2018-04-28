var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/imageupload");

var mongoSchema = mongoose.Schema;

var imageSchema = {
    
    "filename": String,
    "originalName": String,
    "desc": String,
    "hosID": String,
    "created":  { type: Date, default: Date.now }
};

module.exports = mongoose.model('Image', imageSchema);