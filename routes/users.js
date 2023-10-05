var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var quick = require('../define/queryStrings'); //for quick query string generation


// https://ethereal.email/messages
//
// Ethereal Account Credentials
// Name: Geo Kling
// Username: geo.kling99@ethereal.email
// Password: NPuumu8ayR1pzsn9xy

 var transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'geo.kling99@ethereal.email',
      pass: 'NPuumu8ayR1pzsn9xy'
  }
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET userID */
router.get('/getUserID', function(req, res, next) {
  res.json({userID: req.session.user});
});

/* Plan updated */
router.post('/eventupdated', function(req, res) {
  	//FIRST STEP - set up connection!
	  let pool = req.pool;
	  pool.getConnection(function(error, connection) {
		  if (error){
			  res.send(500);
			  return;
		  }

		  //get user details
		  var name = req.body.name;
		  var description = req.body.description;
      var eventId = req.body.eventID;

      console.log("description in route: " + description);

		  //create query
      // Using escapes to sanitise input
		  let query = quick.updatePlanDetails(eventId, name, description);
      console.log(query);

		  connection.query(query, function(error, rows, fields)
		  {
			  connection.release();
			  if(error)
			  {
          console.log(error);
				  res.sendStatus(500);
				  return;
			  } else {
          res.sendStatus(200);
        }
		  });
	  });
});

/* Address updated */
router.post('/addressupdated', function(req, res) {
  //FIRST STEP - set up connection!
  let pool = req.pool;
  pool.getConnection(function(error, connection) {
    if (error){
      res.send(500);
      return;
    }

    //get address details
    var addressID = req.body.addressID;
    var street = req.body.street;
    var streetAdd = req.body.streetAdd;
    var suburb = req.body.suburb;
    var state = req.body.state;
    var postcode = req.body.postcode;
    var country = req.body.country;

    //create query
    let query = "UPDATE addresses " +
                "SET street = ?, streetAdd = ?, suburb = ?, postcode = ?, state = ?, country = ? " +
                "WHERE addressID = ?;";

    connection.query(query, [street,streetAdd,suburb,postcode,state,country,addressID], function(error, rows, fields)
    {
      connection.release();
      if(error)
      {
        console.log(error);
        res.sendStatus(500);
        return;
      } else {
        res.sendStatus(200);
      }
    });
  });
});

/* Remove Invitee */
router.post('/removeinvitees', function(req, res) {
  //FIRST STEP - set up connection!

  //get invitee details
  var eventID = req.body.eventID;
  var emails = req.body.delete_invitations;
  //create query
  let query = "DELETE invitations FROM invitations " +
              "INNER JOIN users ON invitations.guestID = users.userID " +
              "WHERE (eventID = ?) AND (email = ?);";

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
    connection.query(query, [eventID,emails[i]] , function(error, rows, fields) {
      connection.release();
      if (error) {
        console.log("1: query  error");
        console.log(error);
        res.sendStatus(500);
      }
    })
  })
  }
  res.sendStatus(200);
});

router.post('/finaliseevent', function(req, res) {
    	//FIRST STEP - set up connection!
	  let pool = req.pool;
	  pool.getConnection(function(error, connection) {
		  if (error){
			  res.send(500);
			  return;
		  }

		  //get event details
      var eventID = req.body.eventID;
		  var name = req.body.name;
		  var description = req.body.description;
      var start = req.body.start;
      var end = req.body.end;

      console.log("eventID: " + eventID);
      console.log("name: " + name);
      console.log("description: " + description);
      console.log("start: " + start);
      console.log("end: " + end);

		  //create query
		  let query = "UPDATE events " +
                  "SET name = ?, description = ?, start = ?, end = ?, status = 'event' " +
                  "WHERE eventID = ?;";

      console.log(query);

		  connection.query(query, [name,description,start,end,eventID], function(error, rows, fields)
		  {
			  connection.release();
			  if(error)
			  {
          console.log(error);
				  res.sendStatus(500);
				  return;
			  } else {
          res.sendStatus(200);
        }
		  });
	  });
});

router.post('/finaliseEventDeleteActions', function(req, res) {
  //FIRST STEP - set up connection!
let pool = req.pool;
pool.getConnection(function(error, connection) {
  if (error){
    res.send(500);
    return;
  }

  //get event details
  var eventID = req.body.eventID;

  console.log("eventID: " + eventID);

  //create query
  let query = "DELETE times, availablity " +
              "FROM times " +
              "INNER JOIN availablity ON times.timeID = availablity.timeID " +
              "WHERE eventID = ?;";

  console.log(query);

  connection.query(query, [eventID], function(error, rows, fields)
  {
    connection.release();
    if(error)
    {
      console.log(error);
      res.sendStatus(500);
      return;
    } else {
      res.sendStatus(200);
    }
  });
});
});

/* Email Notifications */
router.post('/emailcreated', function(req,res){
  let invitees = req.body.invitees;
  let organiser = req.body.organiser;
  let name = req.body.name;
  //let loc = req.body.loc;
  let descr = req.body.descr;
  let dates = req.body.dates;
  let times = req.body.times;

  emailCreated(invitees, organiser, name, descr, dates, times);

  res.send();
});

router.post('/emailfinalised', function(req,res){
  let invitees = req.body.invitees;
  let organiser = req.body.organiser;
  let name = req.body.name;
  //let loc = req.body.loc;
  let descr = req.body.descr;
  let dates = req.body.dates;
  let times = req.body.times;

  emailFinalised(invitees, organiser, name, descr, dates, times);

  res.send();
});

router.post('/emailcancelled', function(req,res){
  let invitees = req.body.invitees;
  let organiser = req.body.organiser;
  let name = req.body.name;
  //let loc = req.body.loc;
  let descr = req.body.descr;
  let dates = req.body.dates;
  let times = req.body.times;

  emailCancelled(invitees, organiser, name, descr, dates, times);

  res.send();
});

router.post('/emailresponded', function(req,res){
  let invitees = req.body.invitees;
  let organiser = req.body.organiser;
  let name = req.body.name;
  //let loc = req.body.loc;
  let descr = req.body.descr;
  let dates = req.body.dates;
  let times = req.body.times;

  emailResponded(invitees, organiser, name, descr, dates, times);

  res.send();
});


function emailCreated(invitees, organiser, name, descr, dates, times) {
  console.log('here');
  var mailOptions = {
    from: 'Calendar App <calendarappevents@gmail.com>',
    to: invitees, // To Invitees with selected notification
    subject: 'You have been invited to an event!',
    html: `<div style="background-color: #E1E1FF;
    text-align: center;
      font-family: 'Roboto', Helvetica, Verdana, sans-serif;
      font-size: 1.5em;
      padding: 15px;">
      <div style="font-family: 'Chelsea Market', 'American Typewriter', Georgia, serif;font-weight: bold;
      font-size: 2.5em;
      color: #504EA6;
      text-align: center;
      height: 100px;
      line-height: 100px;">Calendar App</div>
      <br/>
      <p>You have been invited to an event!</p>
      <br/>
      <p>Log into your account to view the event and specify your availability!</p>
      <br/>
  </div>`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
 };

function emailFinalised(invitees, organiser, name, descr, dates, times) {
  var mailOptions = {
    from: 'Calendar App <calendarappevents@gmail.com>',
    to: invitees, // To Invitees with selected notification
    subject: 'An event you were invited to has been finalised!',
    html: `<div style="background-color: #E1E1FF;
    text-align: center;
      font-family: 'Roboto', Helvetica, Verdana, sans-serif;
      font-size: 1.5em;
      padding: 15px;">
      <div style="font-family: 'Chelsea Market', 'American Typewriter', Georgia, serif;font-weight: bold;
      font-size: 2.5em;
      color: #504EA6;
      text-align: center;
      height: 100px;
      line-height: 100px;">Calendar App</div>
      <br/>
      <p>An event you were invited to was finalised!</p>
      <br/>
      <p>Log into your account to view the date and time of the event!</p>
      <br/>
  </div>`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
 };

 function emailCancelled(invitees, organiser, name, descr, dates, times) {
  var mailOptions = {
    from: 'Calendar App <calendarappevents@gmail.com>',
    to: invitees, // To Invitees with selected notification
    subject: 'An event you were invited to has been cancelled.',
    html: `<div style="background-color: #E1E1FF;
    text-align: center;
      font-family: 'Roboto', Helvetica, Verdana, sans-serif;
      font-size: 1.5em;
      padding: 15px;">
      <div style="font-family: 'Chelsea Market', 'American Typewriter', Georgia, serif;font-weight: bold;
      font-size: 2.5em;
      color: #504EA6;
      text-align: center;
      height: 100px;
      line-height: 100px;">Calendar App</div>
      <br/>
      <p>Sorry! An event you were invited to was cancelled.</p>
      <br/>
  </div>`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
 };

 function emailResponded(invitees, organiser, name, descr, dates, times) {
  var mailOptions = {
    from: 'Calendar App <calendarappevents@gmail.com>',
    to: invitees, // To Invitees with selected notification
    subject: 'An invitee has responded to your event',
    html: `<div style="background-color: #E1E1FF;
    text-align: center;
      font-family: 'Roboto', Helvetica, Verdana, sans-serif;
      font-size: 1.5em;
      padding: 15px;">
      <div style="font-family: 'Chelsea Market', 'American Typewriter', Georgia, serif;font-weight: bold;
      font-size: 2.5em;
      color: #504EA6;
      text-align: center;
      height: 100px;
      line-height: 100px;">Calendar App</div>
      <br/>
      <p>An invitee has specified their availability for your event!</p>
      <br/>
      <p>Log into your account to view the event and see invitees' availability for your event!</p>
      <br/>
  </div>`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
 };

module.exports = router;
