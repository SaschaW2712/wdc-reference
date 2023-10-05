var argon2 = require('argon2');
var date = require('date-and-time');

function pairs(ID, ...results)
{
	let resultPairs = [];
	for(result in results)
	{
		let now = [ID, result];
		resultPairs.push([now]);
	}
	return resultPairs;
}



function timesHelper(eventID, start, end, times) {
	var timeEntry = start;
	while (timeEntry < end) {
		times.push([eventID, timeEntry]);
		timeEntry = date.addMinutes(timeEntry, 30);
	}

};


function times(start = new Date, end = new Date, eventID, returnee) {
	//STEP ONE: count days
	let count = 0;
	let calculate = end;
	while (!date.isSameDay(start, calculate)) {
		count++;
		calculate = date.addDays(calculate, -1);
	}

	//STEP TWO: get days
	let starts = [];
	let ends = [];
	let currentS = start;
	let currentE = end;

	for (let day = 0; day <= count; day++) {
		starts.push(currentS);
		ends.push(currentE);

		currentS = date.addDays(currentS, 1);
		currentE = date.addDays(currentE, -1);
	}

	ends = ends.reverse(); //make sure to reverse this

	//STEP THREE: pair days together

	let pairs = [];
	for (let day = 0; day <= count; day++) {
		pairs.push({
			start: starts[day],
			end: ends[day]
		});
	}

	//pairs.forEach((pair, count) => {
	//	generateTimes(eventID, pair.start, pair.end, final);
	//	});
	returnee.times = [];
	for (pair of pairs) {
		timesHelper(eventID, pair.start, pair.end, returnee.times);
	}
	return;
}



async function encrypt(plain)
{
	try {
		var secret = await argon2.hash(plain);
	} catch(err) {
		throw err;
	}
	return secret;
};

async function decrypt(hashed, given) {
	try {
		var verify = await argon2.verify(hashed, given);
	} catch (err) {
		throw err;
	}
	return verify;
}

async function objectPush(result, parse, first, ...rest)
{
	for(one in rest)
	{
		result.push([first, parse(one)]);
	}
}

module.exports = {
    encrypt,
	decrypt,
	times,
	pairs,
	objectPush
}