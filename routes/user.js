var _that = this;
var utils = require('./modules/utils');
var fs = require('fs');
var crypto = require('crypto');
var async = require('async');
<<<<<<< HEAD
var fs = require('fs');
var path = '/home/susmani/cloudcomic/CloudComics/public/shared-cbs/';

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('comicdb', server);
 //youtube.com: he man yea
db.open(function(err, db) {
    if(!err) {
        //console.log("Connected to 'comicsdb' database");
        db.collection('users', {strict:true}, function(err, collection) {
            if (err) {
				console.log('no users, going to populate devs');
				populateUsers();
			}
        });
    }
=======
var db = '';
 
utils.connectToDatabase('localhost', 27017, true, function(db){
	_that.db = db;
>>>>>>> e3d81c8cc8d83475511ed39d7f8fc9c2c23c9756
});

exports.login = function (req, res) {
    var params = req.body;
    if (!params.email || !params.password) res.send(400, {
        'error': 'bad email or password'
    });
    else {
        db.collection('users', function (err, collection) {
            collection.findOne({
                'email': params.email
            }, function (err, item) {
                if (err) res.send(400, {
                    'error': 'user does not exist - error: ' + err
                });
                else if (item) {
                    pass = crypto.createHash('md5').update(params.password).digest("hex");
                    if (pass == item.password) {
                        req.session.user = item.hash;
                        res.send(200, {
                            'success': 'login was successful'
                        });
                    } else res.send(400, {
                        'error': 'wrong password'
                    });
                } else res.send(400, {
                    'error': 'user does not exist'
                });
            });
        });
    }
};

exports.logout = function (req, res) {
    delete req.session.user;
    res.send(200, {
        success: 'user has been logged out successfully'
    });
};

<<<<<<< HEAD
exports.currentUserSpace = function (req, res){
	if (req.session.user){
		db.collection('users', function (err, collection){
			collection.findOne({'hash':req.session.user}, function (err, item){
				if (err || !item) res.send(400,{'error':'user does not exist - error: '+ err});
				else {
					 db.collection('comics', function(err, collection) {
						if (err) res.send(400,{'error':'could not retrieve comics - error: '+ err});
						else{
							collection.find().toArray(function(err, items) {
								var total = 0;
								var i = 0;	
							
								sizeByHash_static(items[i].hash, function(totalSize){
									total += totalSize;
									
								});
								
							});
						}
					});
				}
			});
		});
	}
}


//needs to refactored
var sizeByHash_static = function (hash, cb){
	readSizeRecursive(path +hash,hash,  function (err, total){	
		cb(total);
	});
=======
exports.currentUserSpace = function (req, res) {
    if (req.session.user) {
        db.collection('users', function (err, collection) {
            collection.findOne({
                'hash': req.session.user
            }, function (err, item) {
                if (err || !item) res.send(400, {
                    'error': 'user does not exist - error: ' + err
                });
                else {
                    db.collection('comics', function (err, collection) {
                        if (err) res.send(400, {
                            'error': 'could not retrieve comics - error: ' + err
                        });
                        else {
                            collection.find().toArray(function (err, items) {
                                //iterate through items and add total space
								//to be refactored and made async
>>>>>>> e3d81c8cc8d83475511ed39d7f8fc9c2c23c9756

                            });
                        }
                    });
                }
            });
        });
    }
}

exports.checkUserAuth = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.send(403, {
            'error': 'you are not allowed to access this page'
        });
    }
}

//temp dev functions 
var populateUsers = function () {
    var users = [{
        hash: '266838132a71c9faee5332d93a94427e',
        email: 'dev@comiccloud.com',
        password: 'e77989ed21758e78331b20e477fc5582'
    }]
    db.collection('users', function (err, collection) {
        collection.insert(users, {
            safe: true
        }, function (err, result) {});
    });
};
/*
{
	hash: '16901b0b80a5b41114fce6bea3b53aab',
	email: 'dev@example.com', 
	password: 'b03fcd47ab8ff99f095ca6c7160a2003', 
	comics: ['5cdb276602b77aabb111926ec8b52726', 'e49052ec72615734f84eef847f68cb18'],
	_id: '925b03cddb0d9e875c1674d25768c00a'
}
*/
