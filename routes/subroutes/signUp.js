var express = require('express');
var path = require('path');
var router = express.Router();

var misc = require('../../define/misc');
var quick = require('../../define/queryStrings');

console.log("connect");
//CHECK USER DOES NOT ALREADY EXIST
router.post('/signUp', function(req, res, next) {
	console.log('1: start');

	var newPool = req.pool;
	//connect to single connection
	newPool.getConnection(function(error, connection) {
		if (error) {
			console.log("new CONNECTION ERROR");
			console.log(error);
			res.sendStatus(500);
			return;
		}
		console.log("1: connected");
		//set up query
		var query = quick.selectUser("email", "(userID)");

		//run request
		connection.query(query, req.body.email, function(error, rows, fields) {
			connection.release();
			if (error) {
				res.sendStatus(500);
				return;
			}

			//go to next if nothing in response
			if (!rows.length) {
				console.log("1: empty");
				next();
			}
			else
			{
				console.log("1: SOMEONE ALREADY HERE");
				res.sendStatus(401);
				return;
			}
			//else return error

		});
	});
});

//CHECK ENCRYPT SUCCEEDS
router.use('/signUp', async function(req, res, next) {
	console.log('2: start');

	if (req.session.password) {
		console.log("session password EXISTS");
		req.session.password = null;
	}
	console.log("2: here");
	try {
		req.session.password = await misc.encrypt(req.body.password);
	} catch (error) {
		console.log("2: encrypt fail");
		res.sendStatus(500);
		return;
	}
	console.log("2: encrypt success");
	if (!req.session.password) {
		console.log("2: password not set?");
		res.sendStatus(401);
		return;
	}
	next();
});

//CHECK CREATION SUCCEEDS
router.use('/signUp', function(req, res, next) {
	console.log('3: start');

	//connect to single connection
	req.pool.getConnection(function(error, connection) {
		if (error) {
			console.log("3: connection error");
			res.sendStatus(500);
			return;
		}
		console.log("3: connected");
		//set up query
		var query = quick.insertUser();

		//set up parameters
		var email = req.body.email;
		var password = req.session.password;
		var name = req.body.name;

		console.log("3: query start");
		//run request
		connection.query(query, [email, password, name, 'user'], function(error, rows, fields) {
			connection.release();
			if (error) {
				console.log("3: query connect error");
				console.log(error);
				res.sendStatus(500);
				return;
			}
			else
			{
				next();
			}
		});
	});

	//go to next middleware

});

router.post('/signUp', function(req, res, next) {
	console.log('4: final signUp');
	res.redirect('/');
});

module.exports = router;