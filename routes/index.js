<<<<<<< HEAD

=======
>>>>>>> e3d81c8cc8d83475511ed39d7f8fc9c2c23c9756

exports.index = function(req, res){

	res.render('index', { title: 'Express' });
}

exports.login = function (req, res){
	res.render('login');
}

exports.upload = function (req, res){
	res.render('upload');
}


