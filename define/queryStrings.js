//this file generates the query strings for us so the code doesn't look as messy? maybe?

//VARAIBLE THINGS
//--SELECT_EXPR: table columns
const expr = {
	user: {
        user: "(email, password, name, access)", //3 para
        guest: "(email, name, access)" //3 para
    },

    event: {
        all: "(creatorID, addressID, status, description, name, start, end)", //3 ->6
        description: "(creatorID,description, name, start, end)", //2
        location: "(creatorID,addressID, name, start, end)", //2
        none:"(creatorID, name, start, end)" //1
    },

    address: {
        full: "(street, suburb, postcode, state, country)", //5
        extra:"(street, streetAdd, suburb, postcode, state, country)", //7
        street: "(street)" //1
    }
}

//--VALUES
function placeholder(para=1) {
	{
		var place = "(";
		for (let i = 0; i < para - 1; i++) {
			place += "?,";
		}
		place += "?)";
		return place;
	}
}

//BUILDING BLOCKS
//AND condition chain
function andChain(last, ...conditions)
{
	let string = "";
	for (condition of conditions)
	{
		string+= condition + " AND ";
	}
	string+= last;
	return string;
}

//BASIC FUNCTIONS
//SELECT a FROM b WHERE ???
function select(select_expr, table, condition) {
	var query = "SELECT " + select_expr + " FROM " + table + " WHERE " + condition + ";";
	return query;
}

//INSERT INTO
function insert(table, select_expr, values) {
	var query = "INSERT INTO " + table + select_expr + " VALUES " + values + ";";
	return query;
}


//INSERT IGNORE INTO tc(ca,cb) SELECT ta.ca, tb.cb FROM ta INNER JOIN tb ON ta.match = tb.match ;
function insertJoin(table_A, column_A, table_B, column_B, table_C, match)
{
	let insert = "INSERT IGNORE INTO " + table_C + "(" + column_A + "," + column_B + ")";
	let select = " SELECT " + table_A + "." + column_A + ", " + table_B + "." + column_B;
	let from = " FROM " + table_A + " INNER JOIN " + table_B;
	let on = " ON " + table_A + "." + match + " = " + table_B + "." + match + ";";
	let request = insert + select + from + on;
	return request;
}

//SELECT FUNCTIONS
//SELECT select_expr FROM table WHERE condition


function selectUser(input, output = "*")
{
	let condition = "";
	switch(input)
	{
		case "email":
		case "EMAIL":
		case 'e':
			condition = "email = ?";
			break;
		case "userID":
		case "id":
		case 'i':
		default:
			condition = "userID = ?";
	}

	let select_expr = "";

	switch(output)
	{
		case "ID":
		case 'i':
			select_expr = "(userID)";
			break;
		case "ALL":
		case "*":
		case '*':
			select_expr = "*";
			break;
		case "access":
			select_expr = "(accessID)";
			break;
		case 'e':
			select_expr = "(email)";
			break;
		case 'p':
			select_expr = "(password)";
			break;
		default:
			select_expr = "(" +  output + ")";
	}
	return select(select_expr, "users", condition);
}

function selectEvent(output) {
	let condition = "eventID = ?";
	let select_expr = "";
	switch(output)
	{
		case "ALL":
			select_expr = "*";
			break;
		case "creator":
		case "user":
			select_expr = "(creatorID)";
			break;
		case "state":
		case "status":
			select_express("status");
		default:
			select_expr = "(" +  out + ")";
	}
	query = select("*", "events", condition);
	return query;
}

function selectAllEvents() {
	let query = "SELECT * FROM events " +
			"WHERE creatorID = ? " +
			"UNION " +
			"SELECT events.eventID AS eventID, creatorID, addressID, name, description, start, end, status FROM invitations " +
			"INNER JOIN events ON invitations.eventID = events.eventID " +
			"WHERE guestID = ? ORDER BY eventID ASC;";
	return query;
}

function selectAddress() {
	condition = "addressID = ? ";
	query = select("*", "addresses", condition);
	return query;
}

function selectEventTimes(id) {
	condition = "eventID = " + id;
	query = select("*", "times", condition);
	return query;
}

function selectLastEventID()
{
	query = "SELECT eventID FROM events ORDER BY eventID DESC LIMIT 1;"
	return query;
}

function selectEventInvitees()
{
	query = "SELECT email FROM users INNER JOIN invitations ON users.userID = invitations.guestID WHERE eventID = ? ;";
	return query;
}

function selectAddressID(street,streetAdd,suburb,postcode,state,country)
{
	query = "SELECT addressID FROM addresses WHERE street = " + street + " AND streetAdd = " + streetAdd
			+ " AND suburb = " + suburb + " AND postcode = " + postcode
			+ " AND state = " + state + " AND country = " + country + ";";
	return query;
}

// ------------------------------------

// INSERT FUNCTIONS

//INSERT INTO table(select_expr) VALUES values

//SUB queries - user friendly query generation
//--INSERT USER -
function insertUser(access='U') {
	var query = "";

	switch (access) {
		case "user":
		case 'U':
		case "admin":
		case 'A':
			query = insert("users", expr.user.user, placeholder(4));
			break;
		case "guest":
		case "G":
			query = insert("users", expr.user.guest, placeholder(3));
			break;
	}

	return (query);
}

//--INSERT EVENT
function insertEvent(values) {
	var query = "";

	switch (values) {
		case "all":
		case 'A':
			query = insert("events", expr.event.all, placeholder(7));
			break;
		case "location":
		case 'L':
			query = insert("events", expr.event.location, placeholder(5));
			break;
		case "description":
		case 'D':
			query = insert("events", expr.event.description, placeholder(5));
			break;
		case "none":
		case 'N':
		default:
			query = insert("events", expr.event.none, placeholder(4));
	}

	return (query);
}

//--INSERT PLACE
function insertAddress(length) {
	var query = "";

	switch (length) {
		case "full":
		case 'F':
			query = insert("addresses", expr.address.full, placeholder(5));
			break;
		case "street":
		case 'S':
			query = insert("addresses", expr.address.line , placeholder(1));
			break;
		case "extra":
		case 'E':
		default:
			query = insert("addresses", expr.address.extra, placeholder(6));
			break;
	}

	return (query);
}

function insertInvitation(values = "(?,?)") {
	return insert("invitations", "(attendeeID,eventID)", values);
}

function insertTime(values = "(?,?)") {
	return insert("times", " (eventID, start)", values);
}

function insertAvailability(timeID,invitationID){
	query = "INSERT INTO availablity (timeID,invitationID) VALUES (" + timeID + ","+ invitationID + ");"
	return query;
}

function insertNotification()
{
	return insert("notifications", "(userID, type)", "(?,?)");
}

// OTHER FUNCTIONS
function checkIfAddressExists(street,streetAdd,suburb,postcode,state,country)
{
	let query = "SELECT EXISTS(SELECT * FROM addresses WHERE street = "+ street + " AND streetAdd = " + streetAdd
				+ " AND suburb = " + suburb + " AND postcode = " + postcode
				+ " AND state = " + state + " AND country = " + country + ");";
	return query;
}

function updateAvailability(availability,array_length)
{
	//     start = '2022-08-14 12:00:00' OR start = '2022-08-14 12:30:00');
	let query = "UPDATE availablity " +
				"INNER JOIN times ON availablity.timeID = times.timeID " +
				"INNER JOIN invitations ON availablity.invitationID = invitations.invitationID " +
				"SET available = " + availability + " " +
				"WHERE guestID = ? AND ";
	for (let i = 0; i < array_length; i++) {
		if (i === 0)
		{
			query = query + "( start = ? OR ";
		} else if (i === array_length - 1) {
			query = query + "start = ? );";
		} else {
			query = query + "start = ? OR ";
		}
	}
	return query;
}

function updatePlanDetails(eventId, newName, newDescription)
{
	let query = "UPDATE events SET name = \"" + newName + "\", description = \"" + newDescription + "\" ";
	query += "WHERE eventID = " + eventId + ";";
	return query;
}

function finaliseEvent(eventId)
{
	let query = "UPDATE events SET status = \"event\" WHERE eventID = " + eventId + ";";
	return query;
}


function countTotalAvailableInvitees()
{
	query = "SELECT COUNT (available) FROM availablity " +
			"INNER JOIN invitations ON availablity.invitationID = invitations.invitationID " +
			"WHERE eventID = ? AND timeID = ?;";
	return query;
}



module.exports = {
	//basic
	andChain,
	//select
	select,
	selectUser,
	selectEvent,
	selectAllEvents,
	selectAddress,
	selectEventTimes,
	selectLastEventID,
	selectEventInvitees,
	selectAddressID,
	//insert
	insert,
	insertJoin,
	insertUser,
	insertEvent,
	insertAddress,
	insertInvitation,
	insertTime,
	insertAvailability,
	insertNotification,
	//other
	checkIfAddressExists,
	updateAvailability,
	updatePlanDetails,
	finaliseEvent,
	countTotalAvailableInvitees
};
