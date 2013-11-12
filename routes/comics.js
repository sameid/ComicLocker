
/*
{
	hash: '925b03cddb0d9e875c1674d25768c00a',
	page_count: 20,
	user_hash: '16901b0b80a5b41114fce6bea3b53aab',
	date: '2013/3/7',
	_id: '5cdb276602b77aabb111926ec8b52726',
  title: 'The Amazing Spiderman'
}
*/
var mongo = require('mongodb');
var _that = this;
var utils = require('./modules/utils');
var fs = require('fs');
var unzip = require('unzip');
var crypto = require('crypto');
var async = require('async');
var path = utils.comicdir;
var db = utils.db;


 /**
  * Allows users to get a specific page of a comic by it's hash
  * METHOD get
  * ACTION /comics/:hash/:page
  * ENCTYPE n/a
  * PARAMS {{}}
  * comics.exports.findPageByHash
  */
exports.findPageByHash = function (req, res){
	var hash = req.params.hash;
	var page = req.params.page;
	db.collection('comics', function(err, collection) {
        collection.findOne({'hash':hash.toString()}, function(err, item) {
            if (!err){
		console.log(item);
				if (page > item.page_count || page < 1){
				 res.send(400,{'error':'hash was found, but page does not exist'});
				}
				else{
					var img = fs.readFileSync(path + hash + '/' + page + '.jpg');
					res.writeHead(200, {'Content-Type': 'image/jpeg' });
					res.end(img, 'binary');			
				}
			}
			else {
				res.send(400,{'error':'hash does not exist'});
			}
        });
    });
	
} 
 
 /**
  * Allows users to get a specific comic by it's hash
  * METHOD get
  * ACTION /comics/:hash
  * ENCTYPE n/a
  * PARAMS {{}}
  * comics.exports.findByHash
  */
exports.findByHash = function(req, res) {
    var hash = req.params.hash;
    console.log('Retrieving comic: ' + hash);
    db.collection('comics', function(err, collection) {
        collection.findOne({'hash':hash.toString()}, function(err, item) {
            res.send(200,item);
        });
    });
};

 /**
  * Allows user to get all hashes of comics that have been uploaded
  * METHOD get
  * ACTION /comics
  * ENCTYPE n/a
  * PARAMS {}
  * comics.exports.findAll
  */
exports.findAll = function(req, res) {
    db.collection('comics', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(200,items);
        });
    });
};
 
 /**
  * Gives user the ability to upload a comic to the cloud
  * METHOD post
  * ACTION /comics
  * ENCTYPE multipart/form-data  
  * PARAMS {{type=file, name=newComic}}
  * comics.exports.uploadComic
  * needs alot of refactoring for multifile upload (jquery multi file)
  */
exports.uploadComic = function(req, res) {
    console.log("Downloading comic from client...");
	fs.readFile(req.files.file.path, function (err, data) {
		if (err){ res.send(500,{'error':'could not read file - error: '+err}); console.log(err);}
		var filehash = crypto.createHash('md5').update(req.files.file.name).digest("hex");
		console.log("New comic: " + filehash);
		fs.mkdir(path + filehash + '/', function(err){
			console.log(err);
			if(err)res.send(500,{'error':'could not parse file - error: ' + err})
		});
		
		var hashpath = path + filehash + '/'
		var fullpath = hashpath + filehash;
		
		fs.writeFile(fullpath, data, function (err) {
			if (!err){
				console.log("Comic has been successfully uploaded, unarchiving...");
				var i = 0;
				var pipe = fs.createReadStream(fullpath).pipe(unzip.Parse());
				pipe.on('entry', function (entry){
					i++;
					var entryName= entry.path;
					var type = entry.type;
					var size = entry.size;
					//console.log(entryName + ' ' + type + ' ' + size);
					entry.pipe(fs.createWriteStream(hashpath + i + '.jpg'));
				});
				pipe.on('close', function (){
					console.log("Unarchiving is complete.");
					var comic = {"hash": filehash, "page_count": i, "title": req.files.file.name};
					console.log("Adding comic to mongo..");
					//console.log('Indexing comic to mongo: ' + JSON.stringify(comic);
					db.collection('comics', function(err, collection) {
						collection.insert(comic, {safe:true}, function(err, result) {
							if (err) {
								res.send(500,{'error':'could not insert hash into collection: ' + err});
							} else {
								console.log('Success: ' + JSON.stringify(result[0]));
								res.send(200,{'success':'hash has been added successfully'});
							}
						});
					});
				});
			}
		});
	});
}
 
  /**
  * Gives user the ability to delete a comic by it's hash
  * METHOD delete
  * ACTION /comics/:hash
  * ENCTYPE n/a  
  * PARAMS {}
  * comics.exports.deleteComic
  */
exports.deleteByHash = function(req, res) {
    var hash = req.params.hash;
    console.log('Deleting comic: ' + hash);
    db.collection('comics', function(err, collection) {
        collection.remove({'hash':hash.toString()}, {safe:true}, function(err, result) {
            if (err) {
                res.send(500, {'error':'could not delete comic - error:' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(200, {'success':'comic with hash: '+hash +' was deleted successfully'});
            }
        });
    });
};

exports.addTagByHash = function(req, res){
	var tagHash = req.params.tagHash;
	var comicHash = req.params.comicHash;
	
	db.collection('comics', function(err, collection){
	
	});
};


//temp dev tools
var populateDB = function() {
    db.collection('comics', function(err, collection) {
        //collection.insert(comics, {safe:true}, function(err, result) {});
    });
};

/*
{
	hash: '925b03cddb0d9e875c1674d25768c00a',
	page_count: 20,
	user_hash: '16901b0b80a5b41114fce6bea3b53aab',
	date: '2013/3/7',
	_id: '5cdb276602b77aabb111926ec8b52726',
	tags: ['tagID1-101', 'tagID1-102','tagID1-103']
}
*/
