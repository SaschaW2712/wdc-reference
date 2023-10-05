var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var quick = require('../../define/queryStrings');
var misc = require('../../define/misc');

//1---check if the address (i.e. actual physical location)
//----is in database
//----return addressID from the database if there
//----else continue

router.post('/event/addAddress', function(req,res,next)
{
	//console.log("1: GET: first get address called");
	res.redirect(307,'/event/getAddress');
})

router.post('/event/getAddress', function(req, res,next) {
	//console.log("1: GET: call successful");
	let pool = req.pool;
	// Get the AddressID from database
	pool.getConnection(function(error, connection) {
		if (error){
			console.log("1: GET: connection error");
			res.send(500);
			return;
		}

		//make query string
		let chain = quick.andChain("country = ?", "street = ?", "streetAdd = ?", "suburb = ?", "postcode = ?", "state = ?")
		let query = quick.select("(addressID)","addresses", chain);

		//console.log("1: QUERY!!!!");
		console.log(query);
		//console.log("1: QUERY END!!!!");

		//set query variables
		let street = req.body.street;
		let streetAdd = req.body.streetAdd;
		let suburb = req.body.suburb;
		let postcode = req.body.postcode;
		let state = req.body.state;
		let country = req.body.country;

		connection.query(query, [street, streetAdd, suburb, postcode, state, country], function(error, rows, fields)
		{
			connection.release();
			if(error)
			{
				console.log("1: GET: query error");
				console.log(error);
				res.sendStatus(418);
				return;
			}
			else if(!rows)
			{
				console.log("1: GET: no addresses");
				res.redirect(307,'/event/createAddress');
			}
			else if (!rows[0])
			{
				console.log("1: GET: retrives ROWS BUT THEY HAVE NOTHING?");
				res.redirect(307,'/event/createAddress');
			}
			else
			{
				//console.log("1: GET: there's something");
				req.session.addressID = rows[0].addressID;
				console.log("req.session.addressID: " + req.session.addressID);
				res.json(req.session.addressID);
			}
		});
	});
});

//2b---addAdress to database if not there
router.post('/event/createAddress', function(req, res) {
	//console.log("2: CREATE: createAddress called");
	let pool = req.pool;
// Check if Address is in database
	// If it is return addressid
	pool.getConnection(function(error, connection) {
		if (error){
			console.log("2: CREATE: connection error");
			res.sendStatus(500);
			return;
		}

		//create query

		let street = req.body.street;
		let streetAdd = req.body.streetAdd;
		let suburb = req.body.suburb;
		let postcode = req.body.postcode;
		let state = req.body.state;
		let country = req.body.country;

//      extra:"(street, streetAdd, suburb, postcode, state, country)", //7
		let query = quick.insertAddress();
		//console.log("2:  query:" + query);

		connection.query(query, [street,streetAdd,suburb,postcode,state,country], function(error, rows, fields)
		{
			connection.release();
			if(error)
			{
				console.log("2: CREATE: query error");
				console.log(error);
				res.sendStatus(418);
				return;
			}
			else
			{
				//console.log("2: CREATE: success!");
				//console.log("GET: second call from CREATE");
				res.redirect(307, '/event/getAddress');
			}
		});
	});
});

//3---fully do the plan
router.post('/event/createPlan', function(req, res, next) {
	//console.log("3: CREATE PLAN CALLED");
	let pool = req.pool;
	// Insert New Plan into database
	//FIRST STEP - set up connection!
	  pool.getConnection(function(error, connection) {
		  if (error){
				console.log("3: connection error");
			  res.send(500);
			  return;
		  }

		  //create query
//		  all: "(creatorID, addressID, status, description, name, start, end)", //3 ->6

		  let query = quick.insertEvent('A');

		  //get plan details
		  let creatorID = req.session.user;
		  let addressID = req.session.addressID;
		  let status = 'plan';
		  let description = req.body.description;
		  let name = req.body.name;
		  let start = req.body.start;
		  let end = req.body.end;

		  connection.query(query,[creatorID,addressID,status,description,name,start,end], function(error, rows, fields)
		  {
			  if(error)
			  {
				console.log("3: FIRST query error");
				console.log(error);
				  res.sendStatus(418);
				  return;
			  }
			  else
			  {
				let query = quick.selectLastEventID();
				connection.query(query, function(error, rows, fields)
				{
					connection.release();
					if(error)
					{
						console.log("3: second query error");
						res.sendStatus(418);
						return;
					}
					else
					{
						req.session.eventID = rows[0].eventID;
						console.log("req.session.eventID: " + req.session.eventID);
						res.json({eventID: rows[0]});
					}
				});
			  }
		  })
	  })

  });


//4---addtimes to database
//4.1-get days

router.post('/event/addTimes', function(req, res, next) {
	//console.log("9: ADD TIMES");

	let query = quick.insertTime();

	//get times details
	// req.session.eventID = req.body.eventID;
	let eventID = req.session.eventID;
	let start = new Date(req.body.start);
	let end = new Date(req.body.end);
	// console.log("Start req.body: " + req.body.start);
	// console.log("End req.body: " + req.body.end);
	// console.log("Start datetime: " + start);
	// console.log("End datetime: " + end);

	// Create array of times
	let times = [];
	let day = 1000 * 60 * 60 * 24;
    // Number of days
    let days = Math.ceil((end.getTime() - start.getTime())/ day);
    // Number of half-hour time_slots
    let time_slots = ((end.getHours()+end.getMinutes()/60)-(start.getHours()+start.getMinutes()/60))*2;

	let running_time = new Date();
	running_time.setFullYear(start.getFullYear(),start.getMonth(),start.getDate());
	let first_hour = start.getHours();
	let first_minute = start.getMinutes();

	//console.log("Before Loop ");
	// Create array of times
	for (let i = 0; i < days; i++) {
		//Start time of each day
		running_time.setHours(first_hour);
		running_time.setMinutes(first_minute);
		running_time.setSeconds(0);

		for (let j = 0; j < time_slots; j++) {
			//console.log("Inside Loop ");
			let time = new Date(running_time);
			times.push(time.toISOString().slice(0, 19).replace('T', ' '));
			running_time.setMinutes(running_time.getMinutes() + 30);
		}
		running_time.setDate(running_time.getDate() + 1);
	}
	//console.log("After Loop ");

	for (let i = 0; i < times.length; i++){
		//console.log("Loop" + i);
		let pool = req.pool;
		// Insert New Times into database
		//FIRST STEP - set up connection!
		req.pool.getConnection(function(error, connection) {
			if (error) {
				console.log("9: connection error");
				console.log(error);
				res.sendStatus(500);
				return;
			}
			//run request
			connection.query(query, [eventID,times[i]], function(error, rows, fields) {
				connection.release();
				if (error) {
					console.log("9: query  error");
					console.log(error);
					res.sendStatus(500);
				}
				else
				{
					//console.log("9: successful");
				}
			})
		})
	}
	res.json({eventID: req.session.eventID});
	//res.sendStatus(200);
});

//5---create invitations
//5---create guest accounts for emails NOT in database already
router.use('/event/addGuestEmails', function(req, res, next) {
	console.log("create invitations start!");
	//console.log("1: check if emails are in database");

	req.session.eventID = req.body.eventID;
	let emails = req.body.invitees;

	//set up query
		//var query = quick.insertIgnore("users", "(email, access)", "(?, 'guest')");
		var query = "INSERT IGNORE INTO users (email, access) VALUES (?, 'guest')";
		//console.log("1: query string created");

	for (let i = 0; i < emails.length; i++) {
		//console.log("Inside Invitation Loop");
		//connect to single connection
		req.pool.getConnection(function(error, connection) {
		if (error) {
			console.log("1: connection error");
			console.log(error);
			res.sendStatus(500);
			return;
		}

		//run request
		connection.query(query, emails[i] , function(error, rows, fields) {
			connection.release();
			if (error) {
				console.log("1: query  error");
				console.log(error);
				res.sendStatus(500);
			}
			else
			{
				//console.log("1: successful");
				//go to next middleware
			}
		})
	})
	}
	res.sendStatus(200);
})

//5--- get userIDs to invite
router.use('/event/getUserID', function(req, res, next) {
	//connect to single connection
	console.log("2: get userID from emails");

	//set up query
	//var query = selectUser('e', "userID");

	//console.log("2: query string made");

	req.pool.getConnection(function(error, connection) {
		if (error) {
			console.log("2: connection error");
			res.sendStatus(500);
			return;
		}
		let email = req.body.email;
		req.session.email = email;
		var query = quick.select("userID", "users", "email = ?");
		//run request
		connection.query(query, email, function(error, rows, fields) {
			connection.release();
			if (error) {
				console.log("2: query error");
				res.sendStatus(500);
			} else {
				{
					req.session.guestID = rows[0].userID; // Fixed so that it saves the guestID
					//res.json(rows);
					next();
				}
			}
		})
	})
})

//5--- add invitations and availabilities for each invitee
router.use('/event/getUserID', function(req, res, next) {
	//connect to single connection
	console.log("addInvitation");

	// Add invitation
	req.pool.getConnection(function(error, connection) {
		if (error) {
			console.log("addI: connection error");
			res.sendStatus(500);
			return;
		}
		let eventID = req.session.eventID; // req.session.eventID set in /event/addTimes will return NULL if not
		let guestID = req.session.guestID; // working correctly
		//console.log("invite userID: " + guestID);
		//set up query
		var query = "INSERT INTO invitations (eventID, guestID) VALUES (?,?);";

		//run request
		connection.query(query, [eventID,guestID], function(error, rows, fields) {
			connection.release();
			if (error) {
				console.log("add: query error");
				res.sendStatus(500);
			} else {
				{
					//console.log("add invite: successful");
					//go to next middleware
					//res.json({userID: guestID});
					//res.sendStatus(200);
					next();
				}
			}
		})
	})
})

//6--CREATE AVAILABLITY
router.use('/event/getUserID', function(req, res, next) {
	//connect to single connection
	// Add availability
	console.log("addAvails");
	req.pool.getConnection(function(error, connection) {
		if (error) {
			console.log("addI: connection error");
			res.sendStatus(500);
			return;
		}
		let eventID = req.session.eventID // req.session.eventID set in /event/addTimes will return NULL if not
		let guestID = req.session.guestID; // working correctly
		//console.log("avail userID: " + req.session.guestID);

		//set up query
		var query = quick.insertJoin("invitations", "invitationID", "times", "timeID", "availablity", "eventID");

		//run request
		connection.query(query, [eventID,guestID], function(error, rows, fields) {
			connection.release();
			if (error) {
				console.log("add avail: query error");
				res.sendStatus(500);
			} else {
				{
					//console.log("add: successful");
					//go to next middleware
					//res.json({userID: guestID});
					//res.sendStatus(200);
					res.json({email: req.session.email});
				}
			}
		})
	})
})


module.exports = router;
