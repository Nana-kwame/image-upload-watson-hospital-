import * as express from 'express';
import * as multer from 'multer'
import * as cors from 'cors'
import * as mongoose from 'mongoose'

//General properties

export let UPLOAD_PATH = 'uploads'
export let PORT = 30000;

//Multer Settings for file upload
 var storage = multer.diskStorage({
     destination: function(req,file,cb){
         cb(null, UPLOAD_PATH)
     },
     filename: function(req,file,cb){
         cb(null, file.fieldname + '-' + Date.now())
     }
 })

 export let upload = multer({storage: storage});

 //Intialise App
 export const app = express();
 app.use(cors());

 //Load routes
 var routes = require('./routes');

//Setup Database

let url ="mongodb://127.0.0.1/imageupload";

mongoose.connect(url, (err) => {
    if(err){
        console.log(err)
    }else {
        console.log('Connected to Mongo')
    }
})

app.listen(PORT, function() {
    console.log('listening on port: ' + PORT);
})