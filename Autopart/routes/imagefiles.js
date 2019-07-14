var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/Autoparts');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/prod-images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '.jpg')
    }
})
var upload = multer({ storage: storage });


router.post('/', upload.single('myFile'), (req, res, next) => {
    const file = req.body.file;
    console.log("in api: ");
    console.log(file);
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.json(file);
});


module.exports = router;
