var multer = require('multer');
var express = require('express');
var cors = require('cors');
var app = express();

var path = require('path');
var fs = require('fs')
var del = require('del');





var UPLOAD_PATH = 'uploads';
var Image = require("./models/image");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: storage })

app.use(cors());

app.listen(process.env.PORT || 30000)
console.log("it is running");

app.post('/images', upload.single('image'), (req, res, next) => {

    //Create a new image model and fill the properties
    let newImage = new Image();
    newImage.filename = req.file.filename;
    newImage.originalName = req.file.originalname;
    newImage.desc = req.body.desc;
    newImage.hosID = req.body.hosID
    newImage.save(err => {
        if (err) {
            return res.sendStatus(400);
        }
        res.status(201).send({ newImage });
    });
});

//Get all uploaded images
app.get('/images', (req, res, next) => {
    // use lean() to get a plain JS object
    // remove the version key from the response
    Image.find({}, '-__v').lean().exec((err, images) => {
        if (err) {
            res.sendStatus(400);
        }

        // Manually set the correct URL to each image
        for (let i = 0; i < images.length; i++) {
            var img = images[i];
            img.url = req.protocol + '://' + req.get('host') + '/images/' + img._id;
        }
        res.json(images);
    })
});

app.get('/images/:id', (req, res, next) => {
    let imgId = req.params.id;

    Image.findById(imgId, (err, image) => {
        if (err) {

            return next(err);
        }
        if (image) {
            // stream the image back by loading the file

            res.setHeader('Content-Type', 'image/jpeg');
            fs.createReadStream(path.join(UPLOAD_PATH, image.filename)).pipe(res);
            console.log(image);
        }

    })
});

app.get('/image/:hosID', (req, res, next) => {
    Image.findOne({hosID: req.params.hosID}).select(" _id  desc originalName filename _v created")
    .exec((err, image) => {
        if(err){
            return next (err);
        }
        if(!image){
            res.json({success:false, message: "image not found"});
        } else {
            res.setHeader('Content-Type', 'image/jpeg');
            fs.createReadStream(path.join(UPLOAD_PATH, image.filename)).pipe(res);
            console.log(image);
        }
    })
    
    })



    /**wATSON IMPORTS */
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override')

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());


/**WATSON DISCOVERY QUERY */
app.use( function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.post('/watsonHospitals', function (req, res) {
    
    var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

    var discovery = new DiscoveryV1({
        username: "e7b4f01c-b48e-4396-b81e-af13c3ce8934",
        password: "0CLXM1k1uTWo",
        url: "https://gateway.watsonplatform.net/discovery/api",
        version_date: '2017-09-01'

    });

    discovery.query({
        environment_id: "4c5591b0-8aff-4b82-852c-d77e287b5375",
        collection_id: "b93af730-e0d9-4df2-ad1a-1a85a21fb1d4",
        query:   req.body.name + " services"
    },
        function (err, response) {
            if (err) {
                //console.log(err);
                res.status(401).send(err);
            } else {
                // res.send({
                //     passed: true,
                //     message: 'Post successful!'
                // });
                
                var cats = response.results;
                var foobar =  "";
                var counter = 2;

                cats.forEach(function(cat){
                    console.log(cat.enriched_text.entities);
                    var myAnswers= cat.enriched_text.entities.slice(3,9)               
                    myAnswers.forEach(function(entity){
                        foobar += "\n"+JSON.stringify(entity.text).replace(/\"/g, "");    
                        
                        
                    }, 2)
                })
                console.log(foobar);
                res.json(foobar, null, 5);
            }
        }
    )
});