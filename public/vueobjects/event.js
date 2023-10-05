function getEventInfo(callback) {
    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("GET", "/request/getEvent", true);

    // Send request
    xhttp.send();

    // Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            let event = JSON.parse(this.responseText)[0];
            callback(event);
        }
    };
}

function getEventInvitees() {
    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("GET", "/request/getEventInvitees", true);

    // Send request
    xhttp.send();

    // Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            let invitees = JSON.parse(this.responseText);
            return invitees;
        }
    };
}

var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
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
  };

// function getEventIdURLParam() {
//     var url = window.location.href
//     var paramIndex = url.indexOf("event/") + 6;
//     var id = url.substring(paramIndex, paramIndex + 1);
//     console.log(id);
//     return id;
// }

// var getEventInfo = function getEventInfo(callback) {
//     var xhttp = new XMLHttpRequest();

//     xhttp.onreadystatechange = function() {
//       if (this.readyState == 4 &&  this.status == 200) {
//         var resObject = JSON.parse(this.response)[0];
//         callback(JSON.parse(this.response)[0]);
//       }
//     };

//     xhttp.open("GET", "/request/getEvent?id=1", true);
//     xhttp.send();
//   }



var vueinst = new Vue({
    el: '#vue_event',
    data: {
        event_name: "",
        event_descr: "",
        event_start: "",
        event_end: "",

        event_addr_street: "",
        event_addr_street_2: "",
        event_addr_city: "",
        event_addr_state: "",
        event_addr_postcode: "",
        event_addr_country: "",

        invitee_email: "",
        invitees: [],

        event_date: "",
        event_time: "",
    },

    methods: {
    onClickAddToCalendar: function() {
        //add to google calendar or generate .ics file
        // console.log(module);

        console.log(this.event_id);

        // createICS(event);
    },
    },
    beforeMount() {
        // Get Event Info
        let event = getEventInfo(event => {
            //console.log(event);
            // Get Event Invitees
            let invitees = [];
            let invitee_array = getEventInvitees(); // Array of objects
            for (invitee in invitee_array){
                invitees.push(invitee.email);
            }
            this.invitees = invitees;

            // Set event details
            this.event_name = event.name;
            this.event_descr = event.description;
            this.event_start = event.start;
            this.event_end = event.end;

            //Set event date and time
            let startDateTime = new Date(event.start); // Need to convert from SQL time
            let endDateTime = new Date(event.end);

            startDateTime = new Date(startDateTime.toISOString().slice(0, 19).replace('T', ' '));
            endDateTime  = new Date(endDateTime.toISOString().slice(0, 19).replace('T', ' '));

            let event_start_day = days[startDateTime.getDay()];
            let event_start_date = startDateTime.getDate();
            let event_start_month = months[startDateTime.getMonth()-1];
            let event_start_year = startDateTime.getFullYear();

            let event_end_day = days[endDateTime.getDay()];
            let event_end_date = endDateTime.getDate();
            let event_end_month = months[endDateTime.getMonth()-1];
            let event_end_year = endDateTime.getFullYear();

            let event_start_time = timeIn12hrFormat(startDateTime.getHours(), startDateTime.getMinutes());
            let event_end_time = timeIn12hrFormat(endDateTime.getHours(), endDateTime.getMinutes());

            this.event_date = event_start_day + " " + event_start_date + " " + event_start_month + " " + event_start_year + " - " + event_end_day + " " + event_end_date + " " + event_end_month + " " + event_end_year;
            this.event_time = event_start_time + " - " + event_end_time;

            // Get Address Info
            let address_id = event.addressID;
            // Create new AJAX request
            var xhttp = new XMLHttpRequest();
            // Open connection
            xhttp.open("POST", "/request/getAddress", true);
            // Set content type to JSON
            xhttp.setRequestHeader("Content-type","application/json");
            // Send request
            xhttp.send(JSON.stringify({addressID: address_id}));

            // Handle response
            xhttp.onreadystatechange = function() {
                if ((this.readyState == 4) && (this.status == 200 || this.status == 304)) {
                    let address = JSON.parse(this.responseText)[0];

                    vueinst.event_addr_street = address.street;
                    vueinst.event_addr_street_2 = address.streetAdd;
                    vueinst.event_addr_city = address.suburb;
                    vueinst.event_addr_state = address.state;
                    vueinst.event_addr_postcode = address.postcode;
                    vueinst.event_addr_country = address.country;
                }
            };
        });
    }
});
