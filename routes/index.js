var express = require('express');
var path = require('path');
var router = express.Router();

//define folder
var quick = require('../define/queryStrings'); //for quick query string generation
var misc = require('../define/misc');

var signUpRouter = require('./subroutes/signUp');
var loginRouter = require('./subroutes/login');
var eventEditRouter = require('./subroutes/eventEdit');
router.post('/signUp*', signUpRouter);
router.post('/login*', loginRouter);
router.post('/event*', eventEditRouter);



/*
router.get('/template', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/template_delete_later.html'));
});
*/

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/');
  });

//LOGGED OUT FILE PATHS
  router.get('/logged_out', function(req, res, next) {
	res.sendFile(path.resolve(__dirname + '/../public/index.html'));
  })

  router.get('/logged_out/login_admin', function(req, res, next) {
	res.sendFile(path.resolve(__dirname + '/../public/logged_out_admin_signin.html'));
  });

  router.get('/logged_out/login_user', function(req, res, next) {
	res.sendFile(path.resolve(__dirname + '/../public/logged_out_user_signin.html'));
  });

  router.get('/logged_out/signup', function(req, res, next) {
	res.sendFile(path.resolve(__dirname + '/../public/logged_out_signup.html'));
  });

//LOGGING OUT  ROUTES
  router.get('/log_out', function(req,res,next)
  {
	console.log("SERVER: log out called");
	req.session.user = null;
	req.session.save(function(error) {
		if(error)
		{
			console.log("error" + error);
		}
		req.session.regenerate(function(error)
		{
			if(error)
			{
				console.log("error 2" + error);
			}
			res.sendStatus(200);
		});
	});
  })

  /*
function loggedIn (req,res,next)
{
	if(req.session.user)
	{
		next();
	}
	else
	{
		res.redirect('/logged_out');
	}
}
*/

//LOGGED OUT REDIRECT
router.get('*', function(req,res,next)
{
	console.log("CALLED");
	if(!req.session.user)
	{
		res.redirect('/logged_out');
	}
	else
	{
		console.log("USER EXISTS");
		next();
	}
});

//LOGGED IN ROUTES
router.get('/user', function(req, res, next) {
  res.redirect('/user/events');
})

//GET EVENT IDS FOR THING
router.get('/user/events', function(req, res, next) {
	//connect to single connection
	req.pool.getConnection(function(error, connection) {
		if (error) {
			console.log("connection error");
			console.log(error);
			res.sendStatus(500);
			return;
		}
		//set up query
		var query = quick.select("*", "invitations", "guestID = ?");

		//run request
		connection.query(query, req.session.user, function(error, rows, fields) {
			connection.release();
			if (error) {
				console.log("query error");
				console.log(error);
				res.sendStatus(500);
			} else {
				{
					console.log("success");
//					console.log(rows);
//					req.cookies.pasrse(rows);//go to next middleware
					next();
				}
			}
		})
	})

})

router.get('/user/account', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/user_account.html'));
})

router.get('/user/account/manage_account', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/user_manage_account.html'));
})

router.get('/user/account/manage_notifications', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/user_manage_notifications.html'));
})

router.get('/user/account/link_calendar', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/user_link_calendar.html'));
})

router.get('/user/events', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/user_events.html'));
})

router.get('/user/create_event', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/user_create_event.html'));
})

router.get('/user/event/:eventId/which', function(req, res, next) {
	if (req.session.user == req.session.currentEventOrganiser) {
		res.redirect('/user/event/' + req.params.eventId + '/organiser');
	} else {
		res.redirect('/user/event/' + req.params.eventId + '/attendee');
	}
})

router.get('/user/event/:eventId/organiser', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/user_view_event_organiser.html'));
})

router.get('/user/event/:eventId/attendee', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/attendee_view_event.html'));
})

router.get('/user/plan/:planId/which', function(req, res, next) {
	if (req.session.user == req.session.currentEventOrganiser) {
		res.redirect('/user/plan/' + req.params.planId + '/organiser');
	} else {
		res.redirect('/user/plan/' + req.params.planId + '/attendee');
	}
})

router.get('/user/plan/:planId/organiser', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/user_edit_plan_organiser.html'));
})

router.get('/user/plan/:planId/attendee', function(req, res, next) {
	//req.session.eventID = req.params.planId;
	res.sendFile(path.resolve(__dirname + '/../public/attendee_user_plan.html'));
})

//ADMIN REDIRECT
router.use('/admin*', function(req,res,next)
{
	if(req.session.access != 'admin')
	{
		res.sendStatus(403);
	}
	else
	{
		next();
	}
})

// ADMIN FILE PATHS
router.get('/admin', function(req, res, next) {
  res.redirect('/admin/events');
})

router.get('/admin/account', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/admin_account.html'));
})

router.get('/admin/account/manage_account', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/admin_manage_account.html'));
})

router.get('/admin/account/signup_admin', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/admin_signup_admin.html'));
})

router.get('/admin/events', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/admin_events.html'));
})

router.get('/admin/events/event', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/admin_manage_event.html'));
})

router.get('/admin/events/plan', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/admin_manage_plan.html'));
})

router.get('/admin/users', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/admin_users.html'));
})


// Temporary Delete later -------------------------------------------
router.get('/guest/view_plan', function(req, res, next) {
	res.sendFile(path.resolve(__dirname + '/../public/attendee_guest_plan.html'));
  });

router.get('/admin/users/manage_account', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../public/admin_users_manage_account.html'));
})

//DATABASE GET REQUESTS

// WORKING!!
// IF TIME: modify so that we only load events that are relavant to the
// logged in user (i.e. invited to or organises)
router.get('/request/getAllEvents', function(req, res, next) {
	req.pool.getConnection(function(error,connection){
	  if(error){
		res.sendStatus(500);
		return;
	  }

	  	var userID = req.session.user;
		// console.log("getEvents userID: " + userID);

		var query = quick.selectAllEvents();
		// console.log(query);

	  connection.query(query, [userID,userID], function(error, rows, fields) {
		connection.release();
		if (error) {
		  res.sendStatus(418);
		  return;
		}
		res.json(rows);
	  });
	});
});

// For account info page
router.get('/request/getUserById', function(req, res, next) {


  let query = quick.selectUser("id");

	req.pool.getConnection(function(error, connection) {
		if (error){
			res.sendStatus(500);
      		return;
		}

		connection.query(query, [req.session.user], function(error, rows, fields)
		{
			connection.release();
			if(error)
			{
				res.sendStatus(418);
				return;
			}

			res.json(rows);
		});
	});
});

//????
router.get('/request/getUserByEmail', function(req, res, next) {

	// console.log(req.query);
	let query = quick.selectUser('e');
	// console.log(query);

	req.pool.getConnection(function(error, connection) {
		if (error){
			console.log(error);
			res.sendStatus(500);
			return;
		}

		connection.query(query, [req.query.email], function(error, rows, fields)
		{
			connection.release();
			if(error)
			{
				// console.log(error);
				res.sendStatus(418);
				return;
			}

			res.json(rows);
		});
	});
});

router.get('/request/getEvent', function(req, res) {
	//FIRST STEP - set up connection!
		let pool = req.pool;
		pool.getConnection(function(error, connection) {
			if (error){
				res.send(500);
				return;
			}

			//create query
			let eventID = req.session.currentEventId;

			let query = "SELECT * FROM events INNER JOIN addresses ON events.addressID = addresses.addressID WHERE eventID = ?;";

			connection.query(query, [eventID], function(error, rows, fields)
			{
				connection.release();
				if(error)
				{
					res.sendStatus(418);
					return;
				}
				res.json(rows);
			});
		});
	});

router.get('/request/getTimesAndAvailabilities', function(req, res) {
	//FIRST STEP - set up connection!
		let pool = req.pool;
		pool.getConnection(function(error, connection) {
			if (error){
				res.send(500);
				return;
			}

			let eventID = req.session.currentEventId;

			//create query
			let query = "SELECT SUM(available) AS total_available, start FROM times " +
						"LEFT JOIN availablity ON times.timeID = availablity.timeID " +
						"WHERE eventID = ? " +
						"GROUP BY times.timeID " +
						"ORDER BY start;";

			connection.query(query, [eventID], function(error, rows, fields)
			{
				connection.release();
				if(error)
				{
					res.sendStatus(418);
					return;
				}
				res.json(rows);
			});
		});
	});

// Change so that it gets event from session
router.get('/request/getEventInvitees', function(req, res, next) {
		//FIRST STEP - set up connection!
		let pool = req.pool;
		pool.getConnection(function(error, connection) {
		  if (error){
			res.sendStatus(500);
			return;
		  }

		  let eventID = req.session.currentEventId;

		  let query = quick.selectEventInvitees();

		  connection.query(query, [eventID], function(error, rows, fields)
		  {
			  connection.release();
			  if(error)
			  {
				  res.sendStatus(418);
				  return;
			  }
			  res.json(rows);
		  });
	  });
  });

router.get('/request/getCurrentEventId', function(req, res, next) {
	if (req.session.currentEventId) {
		res.send(req.session.currentEventId.toString());
	} else {
		res.sendStatus(404);
	}
});

//DATABASE POST REQUESTS
router.post('/request/getAddress', function(req, res) {
	//FIRST STEP - set up connection!
	  let pool = req.pool;
	  pool.getConnection(function(error, connection) {
		  if (error){
			  res.sendStatus(500);
			  return;
		  }

		  //create query
		  let query = quick.selectAddress();

		  connection.query(query, [req.body.addressID], function(error, rows, fields)
		  {
			  connection.release();
			  if(error)
			  {
				  res.sendStatus(418);
				  return;
			  }
			  res.json(rows);
		  });
	  });
  });

//Update eventId in session info
router.post('/request/setEventId', function(req, res) {
	req.session.currentEventId = req.body.eventId;
	req.session.currentEventOrganiser = req.body.organiserId;
	console.log("currentEventOrganiser: " + req.session.currentEventOrganiser);
	res.sendStatus(200);
	return;
})


// Not finished
router.post('/request/getTotalAvailableInvitees', function(req, res, next) {
	//FIRST STEP - set up connection!
	  let pool = req.pool;
	  pool.getConnection(function(error, connection) {
		  if (error){
			  res.send(500);
			  return;
		  }

		  //get user details
		  var timeID = req.body.timeID;
		  var eventID = req.session.eventID; // Make sure that session is created

		  //create query
		  let query = quick.countTotalAvailableInvitees();

		  connection.query(query, [timeID,eventID], function(error, rows, fields)
		  {
			  connection.release();
			  if(error)
			  {
				  res.sendStatus(418);
				  return;
			  }
			  res.json(rows);
		  });
	  });
  });

// Move to index.js
router.post('/request/updateAvailability', function(req, res) {
    //FIRST STEP - set up connection!
    var pool = req.pool;

    //{avail: availability_strings, unavail: unavailability_strings}
    var avail_array = req.body.avail;
    var unavail_array = req.body.unavail;
	var userID = req.session.user;
	console.log("userID: " + userID);

    // Check if there is no availability to be added
	if (avail_array.length === 0) {
		// Add unavailability
		addUnavailToDatabase (req,res,userID,unavail_array);
	} else {
		// Add availability
		addAvailToDatabase(req,res,userID,avail_array,unavail_array,addUnavailToDatabase);
	}
});

function addAvailToDatabase (req,res,userID,avail_array,unavail_array,callback) {
	//FIRST STEP - set up connection!
    var pool = req.pool;
	// Add availability
	pool.getConnection(function(error, connection) {
		if (error){
			res.sendStatus(500);
			return;
		}

		let query = quick.updateAvailability(1,avail_array.length);
		// console.log(query);

		let data = [userID].concat(avail_array);
		// console.log("avail data: " + data);

		connection.query(query, data, function(error, rows, fields)
		{
			connection.release();
			if(error)
			{
				console.log("adding avail data connection error ");
				res.sendStatus(418);
				return;
			} else {
				// Check if there is no unavailability to be added
				if (unavail_array.length === 0) {
					res.sendStatus(200);
				} else {
					// Add unavilability
					callback(req,res,userID,unavail_array);
				}
			}
		});
	});
}

function addUnavailToDatabase (req,res,userID,unavail_array) {
	//FIRST STEP - set up connection!
    var pool = req.pool;
	// Add unavailability
	pool.getConnection(function(error, connection) {
		if (error){
			res.sendStatus(500);
			return;
		}

		let query = quick.updateAvailability(0,unavail_array.length);
		// console.log(query);

		let data = [userID].concat(unavail_array);
		// console.log("unavail data: " + data);

		connection.query(query, data, function(error, rows, fields)
		{
			connection.release();
			if(error)
			{
				console.log("adding unavail data connection error ");
				res.sendStatus(418);
				return;
			} else {
				res.sendStatus(200);
			}
		});
	});
}

module.exports = router;