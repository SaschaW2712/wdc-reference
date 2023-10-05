// router.post('/request/createUser', function(req, res) {
//   //FIRST STEP - set up connection!
// 	let pool = req.pool;
// 	pool.getConnection(function(err, connection) {
// 		if (err){
// 			res.send(500);
// 			return;
// 		}

// 		//create query
// 		let query = quick.insertUser();

// 		//get user details
// 		var name = req.body.name;
// 		var email = req.body.email;
// 		var access = 'user';
// 		try {
// 			var password = await(login.encrypt(req.body.password));
// 		} catch (err) {
// 			res.send(500);
// 			return;
// 		}
// 		connection.query(query,[email,password,name,access], function(error, rows, fields)
// 		{
// 			connection.release();
// 			if(err)
// 			{
// 				res.sendStatus(418);
// 				return;
// 			}
// 		});
// 	});
// });


// router.post('/event/checkIfAddressExists', function(req, res) {
// 	let pool = req.pool;
// 	// Check if Address is in database
// 		// If it is return addressid
// 		pool.getConnection(function(err, connection) {
// 			if (err){
// 				res.send(500);
// 				return;
// 			}

// 			//create query
// 			let street = req.body.street;
// 			let streetAdd = req.body.streetAdd;
// 			let suburb = req.body.suburb;
// 			let postcode = req.body.postcode;
// 			let state = req.body.state;
// 			let country = req.body.country;

// 			let query = quick.checkIfAddressExists(street,streetAdd,suburb,postcode,state,country);

// 			connection.query(query, function(error, rows, fields)
// 			{
// 				connection.release();
// 				if(err)
// 				{
// 					res.sendStatus(418);
// 					return;
// 				}
// 				res.json(rows);
// 			});
// 		});
//   });

// router.post('/event/getAddress', function(req, res) {
// 	let pool = req.pool;
// 	// Get the AddressID from database
// 	pool.getConnection(function(err, connection) {
// 		if (err){
// 			res.send(500);
// 			return;
// 		}

// 		//create query
// 		let query = quick.selectAddressID(street,streetAdd,suburb,postcode,state,country);

// 		connection.query(query, function(error, rows, fields)
// 		{
// 			connection.release();
// 			if(err)
// 			{
// 				res.sendStatus(418);
// 				return;
// 			}
// 			res.json(rows);
// 		});
// 	});
// });

// router.post('/event/addAddress', function(req, res) {
// let pool = req.pool;
// // Check if Address is in database
// 	// If it is return addressid
// 	pool.getConnection(function(err, connection) {
// 		if (err){
// 			res.send(500);
// 			return;
// 		}

// 		//create query
// 		let street = req.body.street;
// 		let streetAdd = req.body.streetAdd;
// 		let suburb = req.body.suburb;
// 		let postcode = req.body.postcode;
// 		let state = req.body.state;
// 		let country = req.body.country;

// 		let query = quick.insertAddress(extra);

// 		connection.query(query, [street,streetAdd,suburb,postcode,state,country], function(error, rows, fields)
// 		{
// 			connection.release();
// 			if(err)
// 			{
// 				res.sendStatus(418);
// 				return;
// 			}
// 		});
// 	});
// 	// Get the AddressID from database
// 	pool.getConnection(function(err, connection) {
// 		if (err){
// 			res.send(500);
// 			return;
// 		}

// 		//create query
// 		let query = quick.selectAddressID(street,streetAdd,suburb,postcode,state,country);

// 		connection.query(query, function(error, rows, fields)
// 		{
// 			connection.release();
// 			if(err)
// 			{
// 				res.sendStatus(418);
// 				return;
// 			}
// 			res.json(rows);
// 		});
// 	});
// });


// router.post('/event/createPlan', function(req, res, next) {
// 	let pool = req.pool;
// 	// Insert New Plan into database
// 	//FIRST STEP - set up connection!
// 	  pool.getConnection(function(err, connection) {
// 		  if (err){
// 			  res.send(500);
// 			  return;
// 		  }

// 		  //create query
// 		  let query = quick.insertEvent(all); // not finished check QueryStrings.js

// 		  //get plan details
// 		  let creatorID = req.session.user;
// 		  let addressID = req.body.addressID;
// 		  let status = 'plan';
// 		  let description = req.body.description;
// 		  let name = req.body.name;
// 		  let start = req.body.start;
// 		  let end = req.body.end;

// 		  connection.query(query,[creatorID,addressID,status,description,name,start,end], function(error, rows, fields)
// 		  {
// 			  connection.release();
// 			  if(err)
// 			  {
// 				  res.sendStatus(418);
// 				  return;
// 			  }
// 		  });
// 	  });

// 	  // Get the EventID from database
// 	  pool.getConnection(function(err, connection) {
// 			if (err){
// 				res.send(500);
// 				return;
// 			}

// 			//create query
// 			let query = quick.selectLastEventID();

// 			connection.query(query, function(error, rows, fields)
// 			{
// 				connection.release();
// 				if(err)
// 				{
// 					res.sendStatus(418);
// 					return;
// 				}
// 				res.json(rows);
// 			});
// 		});
//   });

//unfinished
// router.get('/request/getEvent', function(req, res, next) {
//   console.log("id: " + req.params.id);

//   let query = quick.selectEvent(req.query.id);

// 	req.pool.getConnection(function(error, connection) {
// 		if (error){
// 			res.sendStatus(500);
// 			return;
// 		}
// 		connection.query(query, function(error, rows, fields)
// 		{
// 			connection.release();
// 			if(error)
// 			{
// 				res.sendStatus(418);
// 				return;
// 			}
// 			res.json(rows);
// 		});
// 	});
// });

//unfinished
// router.get('/request/getEventWithAddresses', function(req, res, next) {
// 	console.log("id: " + req.params.id);

// 	let query = quick.selectEventWithAddresses(req.query.id);

// 	  req.pool.getConnection(function(error, connection) {
// 		  if (error){
// 			res.sendStatus(500);
// 			return;
// 		  }

// 		  connection.query(query, function(error, rows, fields)
// 		  {
// 			  connection.release();
// 			  if(error)
// 			  {
// 				  res.sendStatus(418);
// 				  return;
// 			  }

// 			  res.json(rows);
// 		  });
// 	  });
//   });

// router.use('/event/addTimes', function(req,res,next)
// {
// 	let start = new Date(req.body.start);
// 	let end = new Date(req.body.end);
// 	try
// 	{
// 		misc.times(start, end, req.session.eventID, req.session);
// 	} catch(error)
// 	{
// 		console.log("nope");
// 		console.log(error);
// 		res.sendStatus(500);
// 	}
// 	console.log(req.session.timess);
// 	next();
// })

// router.use('/event/addTimes', function(req, res, next) {
// 	//connect to single connection
// 	req.pool.getConnection(function(error, connection) {
// 		if (error) {
// 			console.log("connection error");
// 			console.log(error);
// 			res.sendStatus(500);
// 			return;
// 		}
// 		//set up query
// 		var query = quick.insert("times", "(eventID, start)", "(?,?)");

// 		//run request
// 		connection.query(query, req.session.timess, function(error, rows, fields) {
// 			connection.release();
// 			if (error) {
// 				console.log("query error");
// 				console.log(error);
// 				res.sendStatus(500);
// 			} else {
// 				{
// 					console.log("success");
// 					res.sendStatus(200);
// 					return;
// 					//go to next middleware

// 				}
// 			}
// 		})
// 	})

// })

// //4---make requests for time objects
// //4.3-push times to database
// router.use('/event/addTimes', function(req,res,next)
// {
// 	//set up query
// 	var query = quick.insertTime();

// 	for(time in req.session.times)
// 	{
// 		let pool = req.pool;
// 		pool.getConnection(function(error, connection) {
// 			if (error){
// 				console.log("Oh no!");
// 				res.sendStatus(500);
// 				return;
// 			}
// 			//run request
// 			connection.query(query, time, function(error, rows, fields) {
// 				if (error) {
// 					res.sendStatus(418);
// 				}
// 				else
// 				{
// 					console.log("success");
// 					res.json(req.body.eventID);
// 				}
// 			})
// 			connection.release();
// 		})
// 	}

// })

// //6--CREATE AVAILABLITY
// router.post('/event/addAvails', function(req, res, next) {
// 	//connect to single connection

// 	req.pool.getConnection(function(error, connection) {
// 		if (error) {
// 			console.log("connection error");
// 			console.log(error);
// 			res.sendStatus(500);
// 			return;
// 		}

// 		//set up query
// 		//var query = quick.insertJoin("invitations", "invitationID", "times", "timeID", "availablity", "eventID");
// 		var query = quick.insertJoin("invitations", "invitationID", "times", "timeID", "availablity", "eventID");
// //		var query = "INSERT INTO availablity (timeID, invitationID) " +
// //			"SELECT timeID,invitationID FROM times INNER JOIN invitations ON times.eventID = invitations.eventID " +
// //			"WHERE times.eventID = " + req.session.eventID + " AND guestID = " + userID + ";";

// 		//run request
// 		connection.query(query, req.body.eventID, function(error, rows, fields) {
// 			connection.release();
// 			if (error) {
// 				console.log("query error");
// 				console.log(error);
// 				res.sendStatus(500);
// 			} else {
// 				{
// 					console.log("success");
// 					//go to next middleware
// 					res.redirect('/user/events/');
// 					res.sendStatus(200);
// 				}
// 			}
// 		})
// 	})

// })


// //5--- get userIDs to invite
// router.get('/event/addInvitations', function(req, res, next) {
// 	//connect to single connection
// 	console.log("addInvitations");

// 	let userIDs = req.session.userIDs;
// 	console.log("userIDs: " + userIDs[0]);
// 	//set up query
// 	var query = "INSERT INTO invitations (eventID, guestID) VALUES (?,?);";

// 	for (let i = 0; i < userIDs.length; i++) {
// 		req.pool.getConnection(function(error, connection) {
// 			if (error) {
// 				console.log("2: connection error");
// 				res.sendStatus(500);
// 				return;
// 			}
// 			//run request
// 			connection.query(query, [req.session.eventID,userIDs[i]], function(error, rows, fields) {
// 				connection.release();
// 				if (error) {
// 					console.log("2: query error");
// 					res.sendStatus(500);
// 				} else {
// 					{
// 						console.log("2: successful");
// 						//go to next middleware
// 					}
// 				}
// 			})
// 		})
// 	}
// 	res.sendStatus(200);
// })


// //6--CREATE AVAILABLITY
// router.get('/event/addAvails', function(req, res, next) {
// 	//connect to single connection
// 	req.pool.getConnection(function(error, connection) {
// 		if (error) {
// 			console.log("connection error");
// 			console.log(error);
// 			res.sendStatus(500);
// 			return;
// 		}
// 		//set up query
// 		//var query = quick.insertSelectInner("invitations", "invitationID", "times", "timeID", "availablity", "eventID");
// 		var query = "INSERT INTO availablity (timeID, invitationID) " +
// 			"SELECT timeID,invitationID FROM times INNER JOIN invitations ON times.eventID = invitations.eventID " +
// 			"WHERE times.eventID = " + req.session.eventID + ";";

// 		//run request
// 		connection.query(query, function(error, rows, fields) {
// 			connection.release();
// 			if (error) {
// 				console.log("query error");
// 				console.log(error);
// 				res.sendStatus(500);
// 			} else {
// 				{
// 					console.log("success");
// 					//go to next middleware
// 					location.assign('/user/events/');
// 					res.sendStatus(200);
// 				}
// 			}
// 		})
// 	})

// })

// //5---PAIR UP USERIDS WITH THE EVENTID
// router.use('/event/addInvitations', function(req,res,next)
// {
// 	console.log("3: PAIR UP USERIDS WITH THE EVENTID");
// 	try
// 	{
// 		req.session.invitePairs = misc.pairs(req.session.inviteID, req.session.eventID);
// 	} catch(error)
// 	{
// 		console.log("3: PAIR ERROR??");
// 		res.sendStatus(500);
// 		return;
// 	}
// 	next();
// })

// //5---CREATE INVITATIONS FROM PAIRS, RETURN WITH EVENTID
// router.use('/event/addInvitations', function(req, res, next) {
// 	console.log("4: actually create the invitations now LMAO");
// 	//connect to single connection
// 	req.pool.getConnection(function(error, connection) {
// 		if (error) {
// 			console.log("4: connection error");
// 			console.log(error);
// 			res.sendStatus(500);
// 			return;
// 		}
// 		//set up query
// 		var query = quick.insert("invitations", "(eventID, userID)", '?');

// 		//run request
// 		connection.query(query, req.session.invitePairs, function(error, rows, fields) {
// 			connection.release();
// 			if (error) {
// 				console.log("4: query error" );
// 				console.log(error);
// 				res.sendStatus(500);
// 			} else {
// 				{
// 					res.redirect(307,'/event/addAvails');
// 				}
// 			}
// 		})
// 	})

// })

// //5--- get userIDs to invite
// router.post('/event/addInvitation', function(req, res, next) {
// 	//connect to single connection
// 	console.log("addInvitation");

// 	req.pool.getConnection(function(error, connection) {
// 		if (error) {
// 			console.log("addI: connection error");
// 			res.sendStatus(500);
// 			return;
// 		}
// 		let eventID = req.session.eventID // req.session.eventID set in /event/addTimes will return NULL if not
// 		let guestID = req.session.guestID; // working correctly
// 		console.log("userIDs: " + req.session.guestID);
// 		//set up query
// 		var query = "INSERT INTO invitations (eventID, guestID) VALUES (?,?);";

// 		//run request
// 		connection.query(query, [eventID,guestID], function(error, rows, fields) {
// 			connection.release();
// 			if (error) {
// 				console.log("add: query error");
// 				res.sendStatus(500);
// 			} else {
// 				{
// 					console.log("add: successful");
// 					//go to next middleware
// 					res.json({userID: guestID});
// 					//res.sendStatus(200);
// 				}
// 			}
// 		})
// 	})
// })