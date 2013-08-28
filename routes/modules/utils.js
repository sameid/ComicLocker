var mongo = require('mongodb');
var default_host = 'localhost';
var default_port = 27017;
var default_auto = true;
var comicdir = './public/shared-cbs/';
var db = ''; 

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

exports.connectToDatabase = function (host, port, auto, callback) {
    var server = new Server(host, port, {
        auto_reconnect: auto
    });
    db = new Db('comicdb', server);
    db.open(function (err, db) {
        if (!err) {
            console.log("Connected to 'comicsdb' database");
			callback(db);
        }
    });
}

//needs to be completed
var sizeByHash = function (hash, cb) {
    readSizeRecursive(path + hash, hash, function (err, total) {
        cb(total);
    });
};

function readSizeRecursive(item, hash, cb) {
    fs.lstat(item, function (err, stats) {
        var total = stats.size;
        if (!err && stats.isDirectory()) {
            fs.readdir(item, function (err, list) {
                async.forEach(
                    list,
                    function (diritem, callback) {
                        //console.log(item +'/'+ diritem);
                        readSizeRecursive(item + '/' + diritem, hash, function (err, size) {
                            if (!err && hash != diritem) total += size;
                            //console.log(total);
                            callback(err);
                        });
                    },
                    function (err) {
                        cb(err, total);
                    }
                );
            });
        } else {
            cb(err, total);
        }
    });
}