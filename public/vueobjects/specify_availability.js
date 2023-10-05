// Change to get the eventID from the session
function getEventInfo(eventID) {
    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("GET", "/request/getEvent?eventID=" + encodeURIComponent(eventID), true);

    // Send request
    xhttp.send();

    // Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            let event = JSON.parse(this.responseText)[0];

            vueinst.event_name = event.name;
            vueinst.event_organiser = event.creatorID;
            vueinst.event_descr = event.description;
            vueinst.event_addr_street = event.street;
            vueinst.event_addr_street_2 = event.streetAdd;
            vueinst.event_addr_city = event.suburb;
            vueinst.event_addr_state = event.state;
            vueinst.event_addr_postcode = event.postcode;
            vueinst.event_addr_country = event.country;
            vueinst.times_data = arrayOfPossibleTimes(event.start,event.end);

            return;
        }
    };
};

function updateAvailability(avail_data) {
    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("POST", "/request/updateAvailability", true);
    // Set content type to JSON
    xhttp.setRequestHeader("Content-type","application/json");
    // Send request
    xhttp.send(JSON.stringify(avail_data));
    // Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            // Go somewhere
            // alert("Availability Updated!"); // Change to a more elegant message
            location.assign('/user/events/');
        }
    };
}

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

  function arrayOfPossibleTimes(event_start,event_end) {
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    var day = 1000 * 60 * 60 * 24;

    // Convert start and end times
    // Reference: https://stackoverflow.com/questions/3075577/convert-mysql-datetime-stamp-into-javascripts-date-format
    var t = event_start.slice(0, 19).replace('T', ' ').split(/[- :]/);
    var start = new Date(t[0], t[1], t[2], t[3], t[4], t[5]);
    t = event_end.slice(0, 19).replace('T', ' ').split(/[- :]/);
    var end = new Date(t[0], t[1], t[2], t[3], t[4], t[5]);

    // Number of days
    let cols = Math.ceil((end.getTime() - start.getTime())/ day);
    // Number of half-hour time_slots
    let time_slots = ((end.getHours()+end.getMinutes()/60)-(start.getHours()+start.getMinutes()/60))*2;

    var possible_times = [];
    var row_slots = [];
    var time_slot_date = new Date(start);
    time_slot_date.setMonth(time_slot_date.getMonth() - 1);
    var first_date = start.getDate();
    // Number of time-slots
    for (let i = 0; i < time_slots; i++) {
        // Number of days
        for (let j = 0; j < cols; j++) {
            row_slots.push({time: timeIn12hrFormat(time_slot_date.getHours(),
                            time_slot_date.getMinutes()),
                            day: days[time_slot_date.getDay()] + " " + time_slot_date.getDate() + " " + months[time_slot_date.getMonth()],
                            date: new Date(time_slot_date),
                            selected: false});
            time_slot_date.setDate(time_slot_date.getDate() + 1);
        }
        possible_times.push(row_slots);
        row_slots = [];
        time_slot_date.setMinutes(time_slot_date.getMinutes() + 30);
        time_slot_date.setDate(first_date);
    }
    return possible_times;
};

var vueinst = new Vue({
    el: '#vue_event',
    data: {
        // event_id: 122, // Delete later, using for testing. Get eventID from session <<<------------------------------------
        //user_id: 7, // Delete later, using for testing. Get userID from session <<<------------------------------------

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

        guest_name: "",
        guest_email: "",

        times_data: [],
        availability: [],

        // Add Availability message
        add_avail_message: "",
        disabled: false,
    },
    methods: {
        onClickSelect: function(i,j) {
            if (this.times_data[i][j].selected == false) {
                this.times_data[i][j].selected = true;
                this.availability.push(this.times_data[i][j].date);
            } else {
                this.times_data[i][j].selected = false;
                let position = -1;
                for (date in this.availability) {
                    if (this.availability[date] === this.times_data[i][j].date) {
                        position = date;
                        break;
                    }
                }
                if (position != -1) {
                    this.availability.splice(position,1);
                }
            }
        },

        onClickSave: function() {
            this.add_avail_message = "Updating Availbility...";
            this.disabled = true;
            //save guest availability here
            let availability = this.availability;
            availability = availability.sort(function(time1, time2){return time1 - time2});

            let availability_strings = [];
            let unavailability_strings = [];

            for (let time of this.times_data){
                for (let day of time) {
                    // Convert time SQL-friendly string
                    let year = day.date.getFullYear();
                    let month = day.date.getMonth() + 1;
                    if (month < 10) {
                        month = "0" + month;
                    }
                    let date = day.date.getDate();
                    if (date < 10) {
                        date = "0" + date;
                    }
                    let datetime = year + "-" + month + "-" + date + " " + day.date.toLocaleTimeString();

                    if (availability.includes(day.date)){
                        availability_strings.push(datetime);
                    } else {
                        unavailability_strings.push(datetime);
                    }
                }
            }

            updateAvailability({avail: availability_strings, unavail: unavailability_strings});

            // // Send email notification to organiser
            // let event_dates = this.event_start_date + " " + this.event_start_month + " " + this.event_start_year +
            // " - " + this.event_end_date + " " + this.event_end_month + " " + this.event_end_year;
            // let event_times = this.event_start_time + " - " + this.event_end_time;

            // let email_data = {invitees: this.invitees,
            //     organiser: this.event_organiser,
            //     name: this.event_name,
            //     //loc: this.event_loc,
            //     descr: this.event_descr,
            //     dates: event_dates,
            //     times: event_times};

            // // Create new AJAX request
            // var xhttp = new XMLHttpRequest();
            // // Open connection
            // xhttp.open("POST", "/users/emailresponded", true);
            // // Set content type to JSON
            // xhttp.setRequestHeader("Content-type","application/json");
            // // Send request
            // xhttp.send(JSON.stringify(email_data));

            // // Handle response
            // xhttp.onreadystatechange = function() {
            //     // Functions once emails have been sent
            //     location.reload();
            // };
        }
    },

    beforeMount() {
        // Create new AJAX request
        var xhttp = new XMLHttpRequest();
        // Open connection
        xhttp.open("GET", "/request/getCurrentEventId", true);

        // set Handle response
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
                // Get Event Info
                getEventInfo(this.response);
            }
        };

        // Send request
        xhttp.send();
    }
});

