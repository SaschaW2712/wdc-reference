// Dummy data vue

// // Preliminary data - link to database
var events = [{
    eventID: 1,
    name: "Alice's 21th (P)",
    creatorID: "SherlockGnome",
    start: new Date("2022-05-28 09:14"),
    end: new Date("2022-05-28 10:31"),
    status: 'plan'
},
{
    eventID: 2,
    name: "Bob's 25rd (E)",
    creatorID: "SherlockGnome",
    start: new Date("2022-05-28 13:14"),
    end: new Date("2022-05-28 14:31"),
    status: 'event'
},
{
    eventID: 3,
    name: "Picnic Day (P)",
    creatorID: "SherlockGnome",
    start: new Date("2022-05-28 11:14"),
    end: new Date("2022-05-28 12:31"),
    status: 'plan'
},
{
    eventID: 4,
    name: "Sports Day (E)",
    creatorID: "SherlockGnome",
    start: new Date("2022-05-28 12:00"),
    end: new Date("2022-05-28 12:31"),
    status: 'event'
},
{
    eventID: 5,
    name: "Alice's 21th (P)",
    creatorID: "SherlockGnome",
    start: new Date("2022-05-28 00:00"),
    end: new Date("2022-05-28 6:31"),
    status: 'plan'
},
{
    eventID: 6,
    name: "Bob's 25rd (E)",
    creatorID: "SherlockGnome",
    start: new Date("2022-05-28 09:14"),
    end: new Date("2022-05-28 10:31"),
    status: 'event'
},
{
    eventID: 7,
    name: "Picnic Day (P)",
    creatorID: "SherlockGnome",
    start: new Date("2022-05-28 09:14"),
    end: new Date("2022-05-28 10:31"),
    status: 'plan'
},
{
    eventID: 8,
    name: "Sports Day (E)",
    creatorID: "SherlockGnome",
    start: new Date("2022-05-28 09:14"),
    end: new Date("2022-05-28 10:31"),
    status: 'event'
}
]

function getEvents() {
    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("GET", "/request/getAllEvents", true);

    // set Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            events = JSON.parse(this.responseText); //Array of objects
            //console.log(events);
            //onLoadPage(events);
            //console.log("AFTER GET EVENTS" + events);
            //events.forEach(addEvents);
            //console.log(events);

            // events_split = splitEvents(events);
            // all_events.plan_data = events_split.plans;
            // all_events.event_data = events_split.events;
            let events_split = splitEvents(events);
            return (events_split);
        }
    };

     // Send request
    xhttp.send();
}

function addEvents(item) {
    event_id = item.eventID;
    event_name = item.name;
    event_organiser = "Organiser: " + item.creatorID;
    event_time = "time";
    event_date = "date";
    // event_date = events[event].start.getDate() + " " + months[events[event].start.getMonth()] + " " + events[event].start.getFullYear() + " - " + events[event].end.getDate() + " " + months[events[event].end.getMonth()] + " " + events[event].end.getFullYear();
    // event_time = timeIn12hrFormat(events[event].start.getHours(),events[event].start.getMinutes()) + " - " + timeIn12hrFormat(events[event].end.getHours(),events[event].end.getMinutes());
    events.push({id: event_id, name: event_name, organiser: event_organiser, date: event_date, time: event_time});
}


var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
function timeIn12hrFormat(hours, minutes) {
    if (minutes == 0) {
        minutes = "00";
    }
    if (hours == 12) {
        return "12." + minutes + "pm"
    } else if (hours > 12) {
        return (hours - 12) + "." + minutes + "pm"
    } else if (hours == 0) {
        return "12." + minutes + "am"
    } else {
        return hours + "." + minutes + "am"
    };
  }

function splitEvents(events) {
    let plan_data = [];
    let event_data = [];
    console.log(events[0].eventID);

     for (let event = 0; event < events.length; event++) {
        //console.log("test2");
        event_id = events[event].eventID;
        event_name = events[event].name;
        event_organiser = "Organiser: " + events[event].creatorID;
        // event_date = "test";
        // event_time = "test2";
        event_date = events[event].start.getDate() + " " + months[events[event].start.getMonth()] + " " + events[event].start.getFullYear() + " - " + events[event].end.getDate() + " " + months[events[event].end.getMonth()] + " " + events[event].end.getFullYear();
        event_time = timeIn12hrFormat(events[event].start.getHours(),events[event].start.getMinutes()) + " - " + timeIn12hrFormat(events[event].end.getHours(),events[event].end.getMinutes());
        if (events[event].status == 'event') {
             event_data.push({id: event_id, name: event_name, organiser: event_organiser, date: event_date, time: event_time});
        } else if (events[event].status == 'plan'){
             plan_data.push({id: event_id, name: event_name, organiser: event_organiser, date: event_date, time: event_time});
        }
    }
    return {plans: plan_data, events: event_data};
}

//events = [];

let events_split = splitEvents(events);


var all_events = new Vue({
    el: '#vue_events',
    data: {
        // events_split: getEvents(),
        plan_data: events_split.plans,
        event_data: events_split.events
        // plan_data: events,
        // event_data: events
    },

    methods: {
        onClickPlanCard: function (planId) {
            //if user is organiser
            location.assign('plan/' + planId.toString() + '/organiser');

            //if user is attendee
            //location.assign(eventId.toString() + '/attendee');
        },

        onClickEventCard: function (eventId) {
            //if organiser
            location.assign('event/' + eventId.toString() + '/organiser');

            //if attendee
            // location.assign('event/' + eventId.toString() + '/attendee');

        }
    },
    // beforeMount() {
    //     // Get Events
    //     all_events = getEvents();
    //     console.log("AFTER GET EVENTS" + all_events);
    //     events_split = splitEvents(all_events);

    //     this.plan_data = events_split.plans;
    //     this.event_data = events_split.events;
    // }
  })