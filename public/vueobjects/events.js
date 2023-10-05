
function getEvents() {
    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("GET", "/request/getAllEvents", true);

    // set Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            let all_events = JSON.parse(this.responseText); //Array of objects
            all_events.forEach(splitEvents);
            return;
        }
    };

     // Send request
    xhttp.send();
}

function getUserID() {
    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("GET", "/users/getUserID", true);

    // set Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            let userID = JSON.parse(this.responseText).userID;
            vueinst.userID = userID;
            return;
        }
    };

     // Send request
    xhttp.send();
}


var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
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

  function splitEvents(item) {
    //console.log("test2");
    event_id = item.eventID;
    event_name = item.name;
    event_organiser = item.creatorID;
    event_organiser_id = item.creatorID;
    let start = new Date(item.start);
    let end = new Date(item.end);
    event_start = new Date(start.toISOString().slice(0, 19).replace('T', ' '));
    event_end = new Date(end.toISOString().slice(0, 19).replace('T', ' '));
    event_date = event_start.getDate() + " " + months[event_start.getMonth()] + " " + event_start.getFullYear() + " - " + event_end.getDate() + " " + months[event_end.getMonth()] + " " + event_end.getFullYear();
    event_time = timeIn12hrFormat(event_start.getHours(),event_start.getMinutes()) + " - " + timeIn12hrFormat(event_end.getHours(), event_end.getMinutes());
    if (item.status == 'event') {
            vueinst.event_data.push({id: event_id, name: event_name, organiser: event_organiser, organiser_id: event_organiser_id, date: event_date, time: event_time});
    } else if (item.status == 'plan'){
            vueinst.plan_data.push({id: event_id, name: event_name, organiser: event_organiser, organiser_id: event_organiser_id, date: event_date, time: event_time});
    }
}

var vueinst = new Vue({
    el: '#vue_events',
    data: {
        userID: "",
        plan_data: [],
        event_data: [],

        //Classes
        event_card: 'event-card',
        event_card_organiser: 'event-card-organiser',
        flex_thirds: 'flex-thirds',
    },

    methods: {
        onClickPlanCard: function (planId, cardIndex) {

            var xhttp = new XMLHttpRequest();
            // console.log(this.plan_data[1].organiser);

            // Open connection
            xhttp.open("POST", "/request/setEventId", true);
            // Set content type to JSON
            xhttp.setRequestHeader("Content-type","application/json");
            // Send request

            let planOrganiserId = this.plan_data[cardIndex].organiser_id;

            xhttp.send(JSON.stringify({eventId: planId, organiserId: planOrganiserId}));

            // Handle response
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
                    location.assign('/user/plan/' + planId.toString() + '/which');
                }
            };
        },

        onClickEventCard: function (currEventId, cardIndex) {
            var xhttp = new XMLHttpRequest();
            // console.log(this.plan_data[1].organiser);

            // Open connection
            xhttp.open("POST", "/request/setEventId", true);
            // Set content type to JSON
            xhttp.setRequestHeader("Content-type","application/json");
            // Send request

            let eventOrganiserId = this.event_data[cardIndex].organiser_id;

            xhttp.send(JSON.stringify({eventId: currEventId, organiserId: eventOrganiserId}));

            // Handle response
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
                    location.assign('/user/event/' + currEventId.toString() + '/which');
                }
            };

        }
    },
    beforeMount() {
        let events_split = getEvents();
        getUserID();
    }
  })