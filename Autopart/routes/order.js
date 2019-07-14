var express = require('express');
var router = express.Router();
var moment = require('moment');
var monk = require('monk');
var db = monk('localhost:27017/Autoparts');


router.get('/', function (req, res) {
    var collection = db.get('orders');
    collection.find({ userName: req.query.userName}, function (err, orders) {
        if (err) throw err;
        res.json(orders);
    });
});



function getData(itemcollection) {
    
    // Return new promise 
    return new Promise(function (resolve, reject) {
        //items = [];
        // Do async job
        itemcollection.find({}).then((items) => {
            // only the name field will be selected
            resolve(items);
        }).catch(function (err) {
            console.log("jai was here");
            reject(err);
        })
    });
}

function getUserName(str) {

    var startIdx = str.indexOf("username") + "username".length + 3;
    var finalIdx = startIdx + str.substring(startIdx).indexOf('"');
    var userName = str.substring(startIdx, finalIdx);
    return userName;
}

router.post('/', function (req, res) {
    var collection = db.get('orders');
    // iterate over body to find the itemlist and add list to db
    var itemcollection = db.get('items');
    var dataPromise = getData(itemcollection);

    dataPromise.then(function (items) {
        //console.log(items);
        var orderitems = [];
       // var updatedItems = [];
        var totalAmount = 0;
        for (itemindex in req.body) {
            item = {
                name: req.body[itemindex].name,
                price: req.body[itemindex].price,
                part_no: req.body[itemindex].part_no,
                count: req.body[itemindex].count
            };
            orderitems.push(item);
            // Find the item which is ordered 
            updatedItem = items.filter(dbitem => dbitem.part_no == item.part_no)[0];
            updatedItem.quantity -= item.count;
           // updatedItems.push(updatedItem);
            totalAmount += parseFloat(item.count) * parseFloat(item.price);
            console.log(totalAmount);
            itemcollection.update({ _id: updatedItem._id }, { $set: { quantity: updatedItem.quantity } });
        }

        var currentUser = req.cookies.user;
        var userName = getUserName(currentUser);
        var currentDate = moment().format('LLL');
        var subtotal = totalAmount;
        var estimatedshipping = totalAmount * .05;
        var totalPurchase = subtotal + estimatedshipping;
        collection.insert({
            items: orderitems,
            subtotal: subtotal,
            estimatedshipping: estimatedshipping,
            totalPurchase: totalPurchase, 
            userName: userName,
            orderTime: currentDate
        }, function (err, items) {
            if (err) throw err;

            res.json(items);
        });
    }).catch(function (error) {
        console.log("Jai was here1");
        console.log(error);
    });

});

module.exports = router;