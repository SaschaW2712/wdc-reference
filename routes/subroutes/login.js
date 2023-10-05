var express = require('express');
var path = require('path');
var router = express.Router();
var misc = require('../../define/misc');
var quick = require('../../define/queryStrings');

//check user is not already "logged in" as such
router.use('/login', function(req,res,next)
{
	console.log("1: check if logged in");
	if(req.session.user)
	{
		console.log("userID: " + req.session.user);
		console.log("1: already logged in");
		res.sendStatus(200);
		return;
	}
	else
	{
		console.log("1: NOT already logged in");
		next();
	}
})

//CHECK USER EXISTS
router.use('/login', function(req,res, next)
{
	console.log("2: check user exists");
	//connect to single connection
	req.pool.getConnection(function(error, connection) {
		if (error) {
			console.log("2: connection error");

			res.sendStatus(500);
			return;
		}

		//set up query
		var query = quick.selectUser('e');
		console.log(req.body.email);

		//run request
		connection.query(query, [req.body.email], function(error, rows, fields) {
			connection.release();
			if (error) {
				console.log("2: query error");
				console.log(error);
				res.sendStatus(500);
			}

			//check that something DOES exist
			else if (!rows) {

				console.log("2: nothing in table");
				console.log(req.body.email);
				console.log(query);
				res.sendStatus(401);
				return;
			}
			else if (!rows[0]) {
				console.log("2: table is weird");
				console.log(rows);

				res.sendStatus(401);
				return;
			}

			//check that the existing user is NOT a guest
			else if (rows[0].access == 'guest') {
				console.log("2: user is guest?");

				res.sendStatus(401);
				return;
			}
			else
			{
			//set in query session object to pass along
			req.query.userID = rows[0].userID;
			req.query.access = rows[0].access; //admin - implement later
            req.query.password = rows[0].password;
			next();
			}
		})
	})
	//go to next middleware
});

//CHECK PASSWORD MATCHES
router.use('/login', async function(req,res,next)
{
	console.log("3: check password matches");
	try {
		if (await misc.decrypt(req.query.password, req.body.password))
		{
			console.log("3: decrypt a-ok");
			next();
		}
		else
		{
			console.log("3: decrypt FAIL incorrect PASSWORD");
			console.log("3: given = " + req.body.password);
			res.sendStatus(401);
			return;
		}
	} catch (error) {
		console.log("3: decrypt FAIL bc it sucks");
		console.log(error);
		res.sendStatus(500);
		return;
	}
	if (!req.query.password) {
		console.log("3: we don't have a password?");

		res.sendStatus(401);
		return;
	}
})

//CONNECT TO SESSION
router.use('/login', function(req,res,next)
{
	console.log("4: connect to session");
	const userID = req.query.userID;
	const access = req.query.access; //admin - implement later
	req.session.regenerate(function(error)
	{
		if(error)
		{
			console.log("4: session regeneration error");

			res.sendStatus(500);
			return;
		}
		else
		{
			req.session.user = userID;
			console.log("userID: " + req.session.user);
			req.session.access = access;
			next();
		}

	})
})

router.post('/login', function(req, res, next) {
	res.sendStatus(200);
})

module.exports = router;