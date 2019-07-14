'use strict';
var express = require('express');
var router = express.Router();

//var Promise = require('promise');

var monk = require('monk');
var db = monk('localhost:27017/Autoparts');

var crypto = require('crypto');
var genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};
var sha512 = function (password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return value;
};

/* GET users listing. */

router.get('/', function (req, res) {
    var collection = db.get('users');
    collection.find({}, function (err, users) {
        if (err) throw err;
        res.json(users);
    });
});

function getUserData(userCollection) {

    // Return new promise 
    return new Promise(function (resolve, reject) {
        // Do sync job
        userCollection.find({}).then((users) => {
            resolve(users);
        }).catch(function (err) {
            console.log("Error in getUserData - "+err);
            reject(err);
        })
    });
}

router.get('/:username&:password', function (req, res) {
    var collection = db.get('users');
    var dataPromise = getUserData(collection);
    
    dataPromise.then(function (users) {
        console.log(users);
        for (var i = 0; i < users.length; i++) {
            if (users[i].username == req.params.username) {
                var salt = users[i].salt;
                var hashPwd = sha512(req.params.password, salt);
                collection.findOne({ username: req.params.username, password: hashPwd }, function (err, user) {
                    if (err) throw err;
                    console.log(user);
                    res.json(user);
                });
            }
        }
    }, function (err) {
        console.log("error in dataPromise in router get uname and pwd - " + err);
    });
    //console.log("in get :/username&:password: " + req.params.username);

    
});


router.post('/', function (req, res) {
    var collection = db.get('users');
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(req.body.password, salt);
    collection.insert({
        username: req.body.username.trim(),
        fullname: req.body.fullname.trim(),
        email: req.body.email.trim(),
        phone: req.body.phone.trim(),
        address: req.body.address.trim(),
        password: passwordData,
        salt: salt
    }, function (err, user) {
        if (err) throw err;
        res.json(user);
    });
    
});

module.exports = router;
