"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
//General properties
exports.UPLOAD_PATH = 'uploads';
exports.PORT = 30000;
//Multer Settings for file upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, exports.UPLOAD_PATH);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
exports.upload = multer({ storage: storage });
//Intialise App
exports.app = express();
exports.app.use(cors());
//Load routes
var routes = require('./routes');
//Setup Database
let url = "mongodb://127.0.0.1/imageupload";
mongoose.connect(url, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log('Connected to Mongo');
    }
});
exports.app.listen(exports.PORT, function () {
    console.log('listening on port: ' + exports.PORT);
});
//# sourceMappingURL=server.js.map