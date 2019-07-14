var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/Autoparts');


router.get('/', function (req, res) {
    var collection = db.get('items');
    var filterCriteria = {};
    
    collection.find({}, function (err, filtered_items) {
        if (err) throw err;
        res.json(filtered_items);
    });
});

router.get('/:id', function (req, res) {
    var collection = db.get('items');
    collection.findOne({ _id: req.params.id }, function (err, item) {
        if (err) throw err;
        console.log(item);
        res.json(item);
    });
});

router.get('/:part_no', function (req, res) {
    var collection = db.get('items');
    collection.findOne({ part_no: req.params.part_no }, function (err, item) {
        if (err) throw err;
        console.log(item);
        res.json(item);
    });
});

router.post('/', function (req, res) {
    //console.log("in /")
    var collection = db.get('items');
    collection.insert({
        main_category: req.body.main_category.trim(),
        sub_category_1: req.body.sub_category_1.trim(),
        sub_category_2: req.body.sub_category_2.trim(),
        name: req.body.name.trim(),
        part_no: req.body.part_no.trim(),
        price: req.body.price.trim(),
        weight: req.body.weight.trim(),
        shape: req.body.shape.trim(),
        quantity: req.body.quantity.trim(),
        features: req.body.features.trim(),
        flag: "1"
    }, function (err, item) {
        if (err) throw err;
        res.json(item);
    });
});


router.put('/:id', function (req, res) {
    var collection = db.get('items');
    collection.update({
        _id: req.params.id
    },
        {
            main_category: req.body.main_category.trim(),
            sub_category_1: req.body.sub_category_1.trim(),
            sub_category_2: req.body.sub_category_2.trim(),
            name: req.body.name.trim(),
            part_no: req.body.part_no.trim(),
            price: req.body.price,
            weight: req.body.weight,
            shape: req.body.shape,
            quantity: req.body.quantity,
            features: req.body.features,
            flag: req.body.flag
        }, function (err, item) {
            if (err) throw err;
            res.json(item);
        });
});



router.delete('/:id', function (req, res) {
    var collection = db.get('items');
    collection.remove({ _id: req.params.id }, function (err, item) {
        if (err) throw err;
        res.json(item);
    });
});


router.post('/images/prod-images', function (req, res) {
    console.log("in post of empty");
});

module.exports = router;