'use strict';

var app = angular.module('autopart', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'ngResource',
    'ngSanitize',
    'angularModalService',
    'ngCookies',
    'angularUtils.directives.dirPagination',
    'angularFileUpload',
    'ngFileUpload'
    ]);


app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/signUp', {
            templateUrl: 'partials/signup.html',
            controller: 'SignupCtrl'
        })
        .when('/signIn', {
            templateUrl: 'partials/signin.html',
            controller: 'SigninCtrl'
        })
        .when('/add-prod', {
            templateUrl: 'partials/add-products.html',
            controller: 'AddProductCtrl'
        })
        .when('/item/:id', {
            templateUrl: 'partials/add-products.html',
            controller: 'EditProductCtrl'
        })
        .when('/item/delete/:id', {
            templateUrl: 'partials/delete-products.html',
            controller: 'DeleteProductCtrl'
        })
        .when('/item/bin/:id', {
            templateUrl: 'partials/move-to-bin.html',
            controller: 'MoveToBinCtrl'
        })
        .when('/bin', {
            templateUrl: 'partials/bin.html',
            controller: 'HomeCtrl'
        })
        .when('/bin/restore/:id', {
            templateUrl: 'partials/restore.html',
            controller: 'RestoreCtrl'
        })
        .when('/item/view/:id', {
            templateUrl: 'partials/description.html',
            controller: 'ViewProductCtrl'
        })
        .when('/Cart', {
            templateUrl: 'partials/cart-view.html',
            controller: 'cartCtrl'
        })
        .when('/Orders', {
            templateUrl: 'partials/my-orders.html',
            controller: 'OrdersCtrl'
        })
        .when('/about', {
            templateUrl: 'partials/about.html',
            controller: 'HomeCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode(true);
});

function getAllUsers(Users) {

    // Return new promise 
    return new Promise(function (resolve, reject) {
        // Do async job
        Users.query(function (users) {
            //console.log("In get: ");
            //console.log(users);
            resolve(users);
        })
    });
}

app.controller('SignupCtrl', ['$scope', '$resource', '$location',
    function ($scope, $resource, $location) {
        var Users = $resource('/api/users');
        var dataPromise = getAllUsers(Users);
        $scope.allUsers = [];
        $scope.allUserEmail = [];
        dataPromise.then(function (users) {
            angular.forEach(users, function (value, key) {
                $scope.allUsers.push(value.username);
                $scope.allUserEmail.push(value.email);
            });
        }, function (err) {
            console.log("error in dataPromise in SignUpCtrl - " + err);
        });
       
        $scope.submit = function () {

            var Users = $resource('/api/users');

            // validate username
            for (var i = 0; i < $scope.allUsers.length; i++) {
                if ($scope.allUsers[i] == $scope.user.username) {
                    $scope.usernameErrMsg = "Username already taken. Please choose another username!";
                    break;
                }
                else {
                    $scope.usernameErrMsg = "";
                }
            }
            if (($scope.user.username == undefined) || ($scope.user.username != undefined && $scope.user.username.trim().length == 0)) $scope.usernameErrMsg = "Username cannot be empty. Please enter a username!";
            // validate name
            if ($scope.user.fullname == undefined) $scope.fullnameErrMsg = "Name cannot be empty. Please enter your name!";
            else if ($scope.user.fullname.trim().length == 0) $scope.fullnameErrMsg = "Name cannot be empty. Please enter your name!";
            else $scope.fullnameErrMsg = "";

            for (var i = 0; i < $scope.allUserEmail.length; i++) {
                if ($scope.allUserEmail[i] == $scope.user.email) {
                    $scope.emailErrMsg = "Email already in use. Please choose another email or log in using existing credentials!";
                    break;
                }
                else {
                    $scope.emailErrMsg = "";
                }
            }
            if ($scope.user.email == undefined) $scope.emailErrMsg = "Email cannot be empty. Please enter your email!";
            else if ($scope.user.email.trim().length == 0) $scope.emailErrMsg = "Email cannot be empty. Please enter your email!";
            else if (ValidateEmail($scope.user.email) == false) $scope.emailErrMsg = "Invalid email address. Please enter correct email address!";
            else $scope.emailErrMsg = "";

            if ($scope.user.phone == undefined) $scope.phoneErrMsg = "Phone number cannot be empty. Please enter your phone number!";
            else if ($scope.user.phone.trim().length == 0) $scope.phoneErrMsg = "Phone number cannot be empty. Please enter your phone number!";
            else if (isNaN($scope.user.phone)) $scope.phoneErrMsg = "Invalid phone number. Please enter numbers only without spaces or special characters!";
            else if ($scope.user.phone.trim().length != 10 || $scope.user.phone.trim().length < 9) $scope.phoneErrMsg = "Phone number has to be 9 digits. Please enter your phone number!";
            else $scope.phoneErrMsg = "";

            if ($scope.user.password == undefined) $scope.pwdErrMsg = "Password cannot be empty. Please enter your password!";
            else if ($scope.user.password.trim().length == 0) $scope.pwdErrMsg = "Password cannot be empty. Please enter your password!";
            else if ($scope.user.password.trim().length < 8) $scope.pwdErrMsg = "Password has to be greater than eight characters!";
            else $scope.pwdErrMsg = "";

            if ($scope.user.confirmpassword == undefined) $scope.cnfPwdErrMsg = "Password cannot be empty. Please enter your password!";
            else if ($scope.user.confirmpassword.trim().length == 0) $scope.cnfPwdErrMsg = "Password cannot be empty. Please enter your password!";
            else if ($scope.user.password != $scope.user.confirmpassword) $scope.cnfPwdErrMsg = "Passwords do not match. Please re-enter!";
            else $scope.cnfPwdErrMsg = "";

            // if every field validates, proceed with registration
            if ($scope.usernameErrMsg.length == 0 && $scope.fullnameErrMsg.length == 0
                && $scope.emailErrMsg.length == 0 && $scope.phoneErrMsg.length == 0
                && $scope.phoneErrMsg.length == 0 && $scope.pwdErrMsg.length == 0 && $scope.cnfPwdErrMsg.length == 0  ) {

                Users.save($scope.user
                    , function () {
                        $location.path('/');
                    });
            }
            
        };

    }]);

function ValidateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

app.controller('SigninCtrl', ['$scope', '$rootScope', '$resource', '$location','$cookies',
    function ($scope, $rootScope, $resource, $location, $cookies) {
        $scope.errorMsg = "";
      
        $scope.submit = function () {
            var Users = $resource('/api/users/:username&:password', { username: '@_username', password: '@_password' });
            Users.get({ username: $scope.user.username, password: $scope.user.password }, function (user) {
                if (user.username != undefined) {
                    $scope.user = user;
                    //alert($scope.user._id);
                    var userObj = {
                        currentUser: {
                            username: $scope.user.username,
                            fullname: $scope.user.fullname,
                            email: $scope.user.email,
                            id : $scope.user._id
                        }
                    };
                    $cookies.putObject('user', userObj);
                    $location.path('/');
                }
                else {
                    $scope.errorMsg = "Invalid username or password";
                }
            });
        };

    }]);

function getAllItems(Items) {

    // Return new promise 
    return new Promise(function (resolve, reject) {
        // Do async job
        Items.query(function (items) {
            resolve(items);
        })
    });
}

app.controller('HomeCtrl', 
    function ($scope, $rootScope, $resource, $location, $filter, $cookies, $route ) {

        
        var prods = $resource('/api/items');

        //var dataPromise = getAllItems(prods);
        
        prods.query(function (items) {
            $scope.items = items;
            $scope.filtered_items = items;
        });

        $scope.itemsPerPage = 9;
        
        
        // Start of user authentication
        var userObj = $cookies.getObject('user');
        //alert(userObj);
        if (userObj != undefined) {
            $scope.currentUser = userObj.currentUser.fullname;
            $scope.currentUserName = userObj.currentUser.username;
            $scope.userID = userObj.currentUser.id;
            $scope.validUser = true;
            if (userObj.currentUser.username == 'admin') $scope.admin = true;
            else $scope.admin = false;
            //alert("$scope.currentUser: " + $scope.currentUser);
        }
        else {
            $scope.validUser = false;
        }

        $scope.logout = function () {
            $cookies.remove("user");
            $scope.validUser = false;
            $location.path('/');
            $route.reload();
        }

        // End of user authentication

        
        // Start of cart functions
        // Register the functionality on loading home controller 
        $scope.addItemToCart = function (item) {
            var cartObjId = $scope.userID + 'cart';
            if (!angular.isUndefined($cookies.getObject(cartObjId)))  {
                var cartObj = $cookies.getObject(cartObjId);
                $scope.cart = cartObj.itemList;
                $scope.totalAmount = parseFloat(cartObj.total);
                
                $scope.newtotalAmount = $scope.totalAmount + parseFloat(item.price);
                
                //$scope.cart = .itemList;
                //$scope.totalAmount = parseFloat($cookies.get('totalAmount'));
                //$scope.totalAmount = $scope.totalAmount + parseFloat(item.price);

                // Check if item already present just update the count of item no
                var itemfound = false;
                var currentItemIndex;
                for (currentItemIndex in $scope.cart) {
                    if (item._id === $scope.cart[currentItemIndex]._id) {
                        itemfound = true;
                        break;
                    }
                }
                if (itemfound) {
                    if ($scope.cart[currentItemIndex].count + 1 > item.quantity) { alert('Cannot add item. Out of stock!');return };
                    $scope.cart[currentItemIndex].count = $scope.cart[currentItemIndex].count + 1;
                }
                else {
                    item.count = 1;
                    $scope.cart.push(item);
                }
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 1);
                $cookies.remove(cartObjId);
                //alert($scope.totalAmount);
                var newCartObj = {
                    itemList: $scope.cart,
                    total: $scope.newtotalAmount
                };
                $cookies.putObject(cartObjId, newCartObj, { 'expires': expireDate });
                console.log(newCartObj);
                console.log(cartObjId);
                $scope.totalAmount = $scope.newtotalAmount;
                //$cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
                //$cookies.put('totalAmount', $scope.totalAmount, { 'expires': expireDate });
                //console.log($scope.cart.length);
            }
            else {
                $scope.cart = [];
                $scope.totalAmount = 0;
                item.count = 1;
                $scope.cart.push(item);
                $scope.newtotalAmount = $scope.totalAmount + parseFloat(item.price);
                var cartObj = {
                    itemList: $scope.cart,
                    total: $scope.newtotalAmount
                };
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 1);
                //$cookies.putObject('cart', $scope.cart, { 'expires': expireDate });
                $cookies.putObject(cartObjId, cartObj, { 'expires': expireDate });
                //$cookies.put('totalAmount', $scope.totalAmount, { 'expires': expireDate });
                //console.log($scope.cart.length);
                console.log(cartObj);
                console.log(cartObjId);
            }
            alert('Item added to cart!')
        };

        $scope.removeItemCart = function (item) {
            var cartObjId = $scope.userID + 'cart';
            var cartObj = $cookies.getObject(cartObjId);
            $scope.cart = cartObj.itemList;
            $scope.totalAmount = parseFloat(cartObj.total);
            if (item.count > 1) {
                item.count -= 1;
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 1);
                for (var i = 0; i < $scope.cart.length; i++) {
                    if ($scope.cart[i].name == item.name) {
                        var idx = i;
                        $scope.newtotalAmount = $scope.totalAmount - item.price;
                        //alert(idx);
                        break;
                    }
                }
                $scope.cart[idx].count = item.count; 
                var newcartObj = {
                    itemList: $scope.cart,
                    total: $scope.newtotalAmount
                };
            }
            else if (item.count === 1) {
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 1);
                for (var i = 0; i < $scope.cart.length; i++) {
                    if ($scope.cart[i].name == item.name) {
                        var idx = i;
                        $scope.newtotalAmount = $scope.totalAmount - item.price;
                        break;
                    }
                }
                $scope.cart[idx].count = item.count;
                var newcartObj = {
                    itemList: $scope.cart,
                    total: $scope.newtotalAmount
                };
                $scope.cart.splice(idx, 1);
            }
            $cookies.putObject(cartObjId, newcartObj, { 'expires': expireDate });
            $scope.cart = newcartObj.itemList;
            $scope.totalAmount = parseFloat(newcartObj.total);
        };

        $scope.formatNumber = function (i) {
            return +((i).toFixed(2));
        }

        $scope.redirectToLogin = function () {
            $location.path('/signIn');
        }

       
        // End of cart functions

        $scope.search = "";
        $scope.selected_mc = [];
        $scope.selected_sub1 = [];
        $scope.selected_sub2 = [];

        // setting scope variables for filter criteria of main category
        $scope.filterMainCategory = function (main_category) {
            if (main_category) {
                if (main_category.substr(-1, 1) == 'Y') {
                    $scope.selected_mc.push(main_category.substr(0, main_category.length - 2).trim())
                    $scope.ref_mc = "";
                    $scope.ref_sub1 = "";
                    $scope.ref_sub2 = "";
                }
                else {
                    $scope.selected_mc.pop(main_category.substr(0, main_category.length - 2))
                }
            }
        };

        // setting scope variables for filter criteria of sub category 1
        $scope.filterSubCategory1 = function (sub_category1) {
            if (sub_category1) {
                if (sub_category1.substr(-1, 1) == 'Y') {
                    $scope.selected_sub1.push(sub_category1.substr(0, sub_category1.length - 2).trim())
                    $scope.ref_mc = "";
                    $scope.ref_sub1 = "";
                    $scope.ref_sub2 = "";
                }
                else {
                    $scope.selected_sub1.pop(sub_category1.substr(0, sub_category1.length - 2))
                }
            }
        };

        // setting scope variables for filter criteria of sub category 2
        $scope.filterSubCategory2 = function (sub_category2) {
            if (sub_category2) {
                if (sub_category2.substr(-1, 1) == 'Y') {
                    $scope.selected_sub2.push(sub_category2.substr(0, sub_category2.length - 2).trim())
                    $scope.ref_mc = "";
                    $scope.ref_sub1 = "";
                    $scope.ref_sub2 = "";
                }
                else {
                    $scope.selected_sub2.pop(sub_category2.substr(0, sub_category2.length - 2))
                }
            }
        };

        $scope.hrefLink = function (main_category, sub_category1, sub_category2) {
            console.log(main_category + "-" + sub_category1 + "-" + sub_category2);
            $scope.search = "";
            if (main_category) $scope.ref_mc = main_category.trim();
            else $scope.ref_mc = "";
            if (sub_category1) $scope.ref_sub1 = sub_category1.trim();
            else $scope.ref_sub1 = "";
            if (sub_category2) $scope.ref_sub2 = sub_category2.trim();
            else $scope.ref_sub2 = "";

            var w = document.getElementsByTagName('input');
            for (var i = 0; i < w.length; i++) {
                if (w[i].type == 'checkbox') {
                    if (w[i].value.trim() == main_category.trim() || w[i].value.trim() == sub_category1.trim() || w[i].value.trim() == sub_category2.trim()) {
                        w[i].checked = true;
                    }
                    else { w[i].checked = false; }
                }
            }
        };

        $scope.goHome = function () {
            $scope.ref_mc = "";
            $scope.ref_sub1 = "";
            $scope.ref_sub2 = "";
            $scope.selected_mc = [];
            $scope.selected_sub1 = [];
            $scope.selected_sub2 = [];
            $scope.search = "";
        };

        $scope.home = function () {
            $location.path('/');
        }

        $scope.searchFilter = function (val) {
            $scope.search = val;
            $scope.ref_mc = "";
            $scope.ref_sub1 = "";
            $scope.ref_sub2 = "";
        };
        
        $scope.restore = function (item) {
            item.flag = '1';
            //alert("in restore");
            //console.log(item);
            prods.update(item, function () {
                $location.path('/');
            });
        }
        $scope.selected_price = 2000;
        $scope.available_items = false;
        $scope.filterProductsPrice = function (item) {
            return (item.price < $scope.selected_price);
        }
       
    });

app.filter('filterProductsPrice', function () {
    // records is the items row sent by the function, scope is used to inject current $scope from calling filter function
    return function (records, scope) {
        if (scope.selected_price === undefined) scope.selected_price = "";
        // if items does not have any value, return
        if (!records) {
            return;
        }
        var output = [];
        angular.forEach(records, function (record) {
            if (scope.selected_price && parseFloat(record.price) <= scope.selected_price) {
                output.push(record);
            }
            if (!scope.selected_price) output.push(record);
        });
        return output;
    };
});

app.filter('filterAvailable', function () {
    // records is the items row sent by the function, scope is used to inject current $scope from calling filter function
    return function (records, scope) {
        if (scope.available_items === undefined) scope.available_items = false;
        // if items does not have any value, return
        if (!records) {
            return;
        }
        var output = [];
        angular.forEach(records, function (record) {
            if (scope.available_items && record.quantity > 0) {
                output.push(record);
            }
            if (!scope.available_items) output.push(record);
        });
        return output;
    };
});

app.filter('filterProducts', function () {
    // records is the items row sent by the function, scope is used to inject current $scope from calling filter function
    return function (records, scope) {
        
        if (scope.selected_mc === undefined) scope.selected_mc = [];
        if (scope.selected_sub1 === undefined) scope.selected_sub1 = [];
        if (scope.selected_sub2 === undefined) scope.selected_sub2 = [];
        if (scope.search === undefined) scope.search = "";

        if (scope.ref_mc === undefined) scope.ref_mc = "";
        if (scope.ref_sub2 === undefined) scope.ref_sub2 = "";
        if (scope.ref_sub1 === undefined) scope.ref_sub1 = "";

        // if items does not have any value, return
        if (!records) {
            return;
        }

        // declear output array for filtered item records
        var output = [];
        /*
        console.log("search: " + scope.search + " ---- " + scope.search.length);
        console.log("selected_mc: " + scope.selected_mc + " ---- " + scope.selected_mc.length);
        console.log("selected_sub1: " + scope.selected_sub1 + " ---- " + scope.selected_sub1.length);
        console.log("selected_sub2: " + scope.selected_sub2 + " ---- " + scope.selected_sub2.length);
        console.log("ref_mc: " + scope.ref_mc + " ---- " + scope.ref_mc.length);
        console.log("ref_sub1: " + scope.ref_sub1 + " ---- " + scope.ref_sub1.length);
        console.log("ref_sub2: " + scope.ref_sub2 + " ---- " + scope.ref_sub2.length);
        */

        angular.forEach(records, function (record) {
            
            if (scope.search.length == 0) {
                if (scope.ref_sub2.length > 0 || scope.ref_sub1.length > 0 || scope.ref_mc.length > 0) {
                    if (record.sub_category_2.trim() == scope.ref_sub2
                        || record.sub_category_1.trim() == scope.ref_sub1
                        || record.main_category.trim() == scope.ref_mc) {
                        output.push(record);
                    }
                }
                else {
                        if (scope.selected_sub2.includes(record.sub_category_2)
                            || scope.selected_sub1.includes(record.sub_category_1)
                            || scope.selected_mc.includes(record.main_category)) {
                            output.push(record);
                        }
                        else if (scope.selected_mc.length == 0
                            && scope.selected_sub1.length == 0
                            && scope.selected_sub2.length == 0) {
                            output.push(record);
                            }
                }
            }
            else {
                
                if (scope.selected_sub2.length > 0) {
                    for (var i = 0; i < scope.selected_sub2.length; i++) {
                        if (scope.selected_sub2[i].trim().toLowerCase().includes(scope.search.trim().toLowerCase())
                            && scope.selected_sub2[i].trim() == record.sub_category_2.trim()) {
                            output.push(record);
                        }
                    }
                }
                if (scope.selected_sub1.length > 0) {
                    for (var i = 0; i < scope.selected_sub1.length; i++) {
                        if (scope.selected_sub1[i].trim().toLowerCase().includes(scope.search.trim().toLowerCase())
                            && scope.selected_sub1[i].trim() == record.sub_category_1.trim()
                            && record.sub_category_2.trim().toLowerCase().includes(scope.search.trim().toLowerCase())) {
                            output.push(record);
                        }
                    }
                }
                if (scope.selected_mc.length > 0) {
                    for (var i = 0; i < scope.selected_mc.length; i++) {
                        if ((scope.selected_mc[i].trim().toLowerCase().includes(scope.search.trim().toLowerCase()))
                            || (scope.selected_mc[i].trim() == record.main_category.trim()
                            && (record.sub_category_1.trim().toLowerCase().includes(scope.search.trim().toLowerCase())
                            || record.sub_category_2.trim().toLowerCase().includes(scope.search.trim().toLowerCase())))) {
                            output.push(record);
                        }
                    }
                }
                if ((scope.selected_sub2.length == 0 && scope.selected_sub1.length == 0 && scope.selected_mc.length) == 0 &&
                    (record.main_category.trim().toLowerCase().includes(scope.search.trim().toLowerCase()) ||
                        record.sub_category_1.trim().toLowerCase().includes(scope.search.trim().toLowerCase()) ||
                        record.sub_category_2.trim().toLowerCase().includes(scope.search.trim().toLowerCase()))) {
                    output.push(record);
                }
                
            }
            
        });
        //console.log(output)
        // return filtered records
        return output;
    };
});

function setField1() {

    var mc_opt = document.getElementById('main-catg-opt').value;
    if (mc_opt == 'New') {
        document.getElementById('main-catg-inp').style.display = 'inline';
        document.getElementById('main-catg-dd').style.display = 'none';
        document.getElementById('sub-catg1-opt').value = 'New';
        document.getElementById('sub-catg2-opt').value = 'New';
        document.getElementById('sub-catg1-opt').disabled = true;
        document.getElementById('sub-catg2-opt').disabled = true;
        document.getElementById('sub-catg1-dd').style.display = 'none';
        document.getElementById('sub-catg2-dd').style.display = 'none';
        document.getElementById('sub-catg1-inp').style.display = 'inline';
        document.getElementById('sub-catg2-inp').style.display = 'inline';
    }
    else {
        document.getElementById('main-catg-inp').style.display = 'none';
        document.getElementById('main-catg-dd').style.display = 'inline';
        document.getElementById('sub-catg1-opt').disabled = false;
        document.getElementById('sub-catg2-opt').disabled = false;
    }
}

function setField2() {

    var sub1_opt = document.getElementById('sub-catg1-opt').value;
    if (sub1_opt == 'New') {
        document.getElementById('sub-catg1-inp').value = "";
        document.getElementById('sub-catg1-inp').style.display = 'inline';
        document.getElementById('sub-catg1-dd').style.display = 'none';
        document.getElementById('sub-catg2-dd').style.display = 'none';
        document.getElementById('sub-catg2-inp').style.display = 'inline';
        document.getElementById('sub-catg2-opt').value = 'New';
        document.getElementById('sub-catg2-opt').disabled = true;
    }
    else {
        document.getElementById('sub-catg1-inp').style.display = 'none';
        document.getElementById('sub-catg1-dd').style.display = 'inline';
        document.getElementById('sub-catg2-opt').disabled = false;
    }
};

function setField3() {

    var sub2_opt = document.getElementById('sub-catg2-opt').value;
    if (sub2_opt == 'New') {
        document.getElementById('sub-catg2-inp').style.display = 'inline';
        document.getElementById('sub-catg2-dd').style.display = 'none';
    }
    else {
        document.getElementById('sub-catg2-inp').style.display = 'none';
        document.getElementById('sub-catg2-dd').style.display = 'inline';
    }

};        




app.controller('AddProductCtrl', ['$scope', '$resource', '$location', '$routeParams', '$cookies', '$route',  
    function ($scope, $resource, $location, $routeParams, $cookies, $route) {     

        var userObj = $cookies.getObject('user');
        //alert(userObj);

        if (userObj != undefined) {
            $scope.currentUser = userObj.currentUser.fullname;
            $scope.validUser = true;
            $scope.currentUserName = userObj.currentUser.username;
            if (userObj.currentUser.username == 'admin') $scope.admin = true;
            else $scope.admin = false;
            //alert("$scope.currentUser: " + $scope.currentUser);
        }
        else {
            $scope.validUser = false;
        }

        $scope.logout = function () {
            $cookies.remove("user");
            $scope.validUser = false;
            $route.reload();
        }

        var Items1 = $resource('/api/items');
        Items1.query(function (items1) {
            $scope.items1 = items1;
        });
       
        document.getElementById('main-catg-dd').style.display = 'inline';
        document.getElementById('main-catg-inp').style.display = 'none';

        document.getElementById('sub-catg1-inp').style.display = 'none';
        document.getElementById('sub-catg1-dd').style.display = 'inline';

        document.getElementById('sub-catg2-inp').style.display = 'none';
        document.getElementById('sub-catg2-dd').style.display = 'inline';

       
        var currItemObj = $cookies.getObject('currItem');
        //alert(currItemObj);
        
        if (currItemObj != undefined) {
            //alert(currItemObj.currItem.item_id);
            var item_id = currItemObj.currItem.item_id;
            //alert(item_id);
            var prods = $resource('/api/items/:id', { id: item_id });
            prods.get({ id: item_id }, function (item) {
                $scope.item = item;
            });
            $cookies.remove("currItem");
        }
        
        $scope.save = function () {
            //alert("in save");
            var Items = $resource('/api/items');
            //alert($scope.item);
            Items.save($scope.item
                , function (item) {
                    var currItemObj = {
                        currItem: {
                            item_id: item._id
                        }
                    };
                    $cookies.putObject('currItem', currItemObj);
                    alert("Product added successfully!");
                //$location.path('/');
            });
            
        };

        $scope.goHome = function () {
            $location.path('/');
        };

        $scope.refresh = function () {
            $route.reload();
        }

        
    }]);

app.controller('EditProductCtrl', ['$scope', '$resource', '$location', '$routeParams', '$cookies', '$route',  
    function ($scope, $resource, $location, $routeParams, $cookies, $route) {

        var userObj = $cookies.getObject('user');
        //alert(userObj);

        document.getElementById('header-title').innerText = 'Update item';

        if (userObj != undefined) {
            $scope.currentUser = userObj.currentUser.fullname;
            $scope.validUser = true;
            $scope.currentUserName = userObj.currentUser.username;
            if (userObj.currentUser.username == 'admin') $scope.admin = true;
            else $scope.admin = false;
            //alert("$scope.currentUser: " + $scope.currentUser);
        }
        else {
            $scope.validUser = false;
        }

        $scope.logout = function () {
            $cookies.remove("user");
            $scope.validUser = false;
            $route.reload();
        }

        var Items1 = $resource('/api/items');
        Items1.query(function (items1) {
            $scope.items1 = items1;
        });

        document.getElementById('main-catg-dd').style.display = 'inline';
        document.getElementById('main-catg-inp').style.display = 'none';

        document.getElementById('sub-catg1-inp').style.display = 'none';
        document.getElementById('sub-catg1-dd').style.display = 'inline';

        document.getElementById('sub-catg2-inp').style.display = 'none';
        document.getElementById('sub-catg2-dd').style.display = 'inline';

        var prods = $resource('/api/items/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });
        prods.get({ id: $routeParams.id }, function (item) {
            $scope.item = item;
        });

        $scope.save = function () {
            $scope.item.flag = '1';
            prods.update($scope.item, function () {
                $location.path('/');
            });
        }
    }]);

app.controller('MoveToBinCtrl', ['$scope', '$resource', '$location', '$routeParams', '$cookies', 
    function ($scope, $resource, $location, $routeParams, $cookies) {

        var userObj = $cookies.getObject('user');
        //alert(userObj);

        if (userObj != undefined) {
            $scope.currentUser = userObj.currentUser.fullname;
            $scope.validUser = true;
            $scope.currentUserName = userObj.currentUser.username;
            if (userObj.currentUser.username == 'admin') $scope.admin = true;
            else $scope.admin = false;
            //alert("$scope.currentUser: " + $scope.currentUser);
        }
        else {
            $scope.validUser = false;
        }

        $scope.logout = function () {
            $cookies.remove("user");
            $scope.validUser = false;
            $route.reload();
        }

        var prods = $resource('/api/items/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });
        prods.get({ id: $routeParams.id }, function (item) {
            $scope.item = item;
        });

        //$scope.item.flag = '0';
        //alert($scope.item.name);
        $scope.moveToBin = function () {
            $scope.item.flag = '0';
            prods.update($scope.item, function () {
                $location.path('/');
            });
        }
    }]);

app.controller('DeleteProductCtrl', ['$scope', '$resource', '$location', '$routeParams', '$cookies', 
    function ($scope, $resource, $location, $routeParams, $cookies) {
        var prods = $resource('/api/items/:id');
        
        var userObj = $cookies.getObject('user');
        //alert(userObj);

        if (userObj != undefined) {
            $scope.currentUser = userObj.currentUser.fullname;
            $scope.validUser = true;
            $scope.currentUserName = userObj.currentUser.username;
            if (userObj.currentUser.username == 'admin') $scope.admin = true;
            else $scope.admin = false;
            //alert("$scope.currentUser: " + $scope.currentUser);
        }
        else {
            $scope.validUser = false;
        }

        $scope.logout = function () {
            $cookies.remove("user");
            $scope.validUser = false;
            $route.reload();
        }

        prods.get({ id: $routeParams.id }, function (item) {
            $scope.item = item;
        })

        $scope.delete = function () {
            prods.delete({ id: $routeParams.id }, function (item) {
                $location.path('/bin');
            });
        }
        
        $scope.close = function (result) {
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };
    }]);

app.controller('RestoreCtrl', ['$scope', '$resource', '$location', '$routeParams', '$cookies',
    function ($scope, $resource, $location, $routeParams, $cookies) {

        var userObj = $cookies.getObject('user');
        //alert(userObj);

        if (userObj != undefined) {
            $scope.currentUser = userObj.currentUser.fullname;
            $scope.validUser = true;
            $scope.currentUserName = userObj.currentUser.username;
            if (userObj.currentUser.username == 'admin') $scope.admin = true;
            else $scope.admin = false;
            //alert("$scope.currentUser: " + $scope.currentUser);
        }
        else {
            $scope.validUser = false;
        }

        $scope.logout = function () {
            $cookies.remove("user");
            $scope.validUser = false;
            $route.reload();
        }

        var prods = $resource('/api/items/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });
        prods.get({ id: $routeParams.id }, function (item) {
            $scope.item = item;
        });
        
        $scope.restore = function () {
            $scope.item.flag = '1';
            prods.update($scope.item, function () {
                $location.path('/bin');
            });
        }
    }]);

app.controller('ViewProductCtrl', ['$scope', '$resource', '$location', '$routeParams', '$cookies',
    function ($scope, $resource, $location, $routeParams, $cookies) {
        var prods = $resource('/api/items/:id');

        prods.get({ id: $routeParams.id }, function (item) {
            $scope.item = item;
        })

        
        var userObj = $cookies.getObject('user');
        //alert(userObj);
        
        if (userObj != undefined) {
            $scope.currentUser = userObj.currentUser.fullname;
            $scope.validUser = true;
            if (userObj.currentUser.username == 'admin') $scope.admin = true;
            else $scope.admin = false;
            //alert("$scope.currentUser: " + $scope.currentUser);
        }
        else {
            $scope.validUser = false;
        }

        $scope.logout = function () {
            $cookies.remove("user");
            $scope.validUser = false;
            $route.reload();
        }
        
    }]);

app.controller('OrdersCtrl', ['$scope', '$resource', '$location', '$routeParams', '$cookies',
    function ($scope, $resource, $location, $routeParams, $cookies) {

        var userObj = $cookies.getObject('user');
        //alert(userObj);

        if (userObj != undefined) {
            $scope.currentUser = userObj.currentUser.fullname;
            $scope.validUser = true;
            $scope.currentUserName = userObj.currentUser.username;
            if (userObj.currentUser.username == 'admin') $scope.admin = true;
            else $scope.admin = false;
            //alert("$scope.currentUser: " + $scope.currentUser);
        }
        else {
            $scope.validUser = false;
        }

        $scope.logout = function () {
            $cookies.remove("user");
            $scope.validUser = false;
            $route.reload();
        }
        //alert($scope.currentUserName);

        var Orders = $resource('/api/order/:username');
       
        Orders.query({ userName: $scope.currentUserName}, function (orders) {
            $scope.orders = orders;
        });

        $scope.formatNumber = function (i) {
            return +((i).toFixed(2));
        }
        //alert($scope.orders);

    }]);

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

app.controller('cartCtrl',
    function ($scope, $resource, $location, $cookies) {

        var userObj = $cookies.getObject('user');
        //alert(userObj);

        if (userObj != undefined) {
            $scope.currentUser = userObj.currentUser.fullname;
            $scope.userEmail = userObj.currentUser.email;
            $scope.validUser = true;
            $scope.userID = userObj.currentUser.id;
            if (userObj.currentUser.username == 'admin') $scope.admin = true;
            else $scope.admin = false;
            //alert("$scope.currentUser: " + $scope.currentUser);
        }
        else {
            $scope.validUser = false;
        }

        $scope.logout = function () {
            $cookies.remove("user");
            $scope.validUser = false;
            $route.reload();
        }

        var cartObjId = $scope.userID + 'cart';
        if (angular.isUndefined($cookies.get(cartObjId)) ||
            (!angular.isUndefined($cookies.get(cartObjId)) && $cookies.get(cartObjId).length == 25))
        { $scope.emptyCart = true; }
        else $scope.emptyCart = false;

        if (!angular.isUndefined($cookies.get(cartObjId))) {
            $scope.cart = $cookies.getObject(cartObjId).itemList;
            $scope.totalAmount = $cookies.getObject(cartObjId).total;
        }
        /*
        if (!angular.isUndefined($cookies.get('totalAmount'))) {
            $scope.totalAmount = parseFloat($cookies.get('totalAmount'));
        }
        */
        $scope.checkout = function () {
            //alert('item has been checked out from cart');

            if ($scope.cart.length <= 0) {
                $location.path('/');
                return;
            }

            // iffi to update database
            (function () {
                var orders = $resource('/api/order');
                var orderreq = $scope.cart;
                orderreq.totalAmount = $scope.totalAmount
                orders.save(orderreq, function () {
                    alert('Order has been placed!');
                    $location.path('/');
                });
            })();

            $scope.cart = [];
            $scope.totalAmount = 0;
            
            $cookies.remove(cartObjId);
            //$cookies.putObject(cartObjId, cartObj);
            //$cookies.put('totalAmount', $scope.totalAmount);
        };
    });
