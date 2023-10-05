// // Preliminary data - testing
// var event = {
//     name: "Alice's 21th",
//     organiser: "SherlockGnome",
//     descr: "Cat ipsum dolor sit amet, suddenly go on wild-eyed crazy rampage to pet a cat, rub its belly, endure blood and agony, quietly weep, keep rubbing belly. Mark territory stare at guinea pigs. Love. Floof tum, tickle bum, jellybean footies curly toes do not try to mix old food with new one to fool me! eat from dog's food for meow find a way to fit in tiny box. Steal the warm chair right after you get up. Meow stare at guinea pigs yet i is playing on your console hooman white cat sleeps on a black shirt, and if it fits, i sits but attack the child yet the dog smells bad. ",
//     addr_street: "Eiffel Tower",
//     addr_street_2: "12 Assembly Dr",
//     addr_city: "Tullamarine",
//     addr_state: "Victoria",
//     addr_postcode: "3043",
//     addr_country: "Australia",
//     start: new Date("2022-05-28 09:30"),
//     end: new Date("2022-05-30 11:30"),
//     invitees: ["jane.doe23@gmail.com ",
//     "sophie@gmail.com",
//     "saschaiscool@gmail.com",
//     "hannahiscooltoo@gmail.com",
//     "katieiscooler@gmail.com"]
// };

// Preliminary data - testing
var event = {
    eventID: 1,
    name: "Alice's 21th",
    creatorID: 5,
    description: "Cat ipsum dolor sit amet, suddenly go on wild-eyed crazy rampage to pet a cat, rub its belly, endure blood and agony, quietly weep, keep rubbing belly. Mark territory stare at guinea pigs. Love. Floof tum, tickle bum, jellybean footies curly toes do not try to mix old food with new one to fool me! eat from dog's food for meow find a way to fit in tiny box. Steal the warm chair right after you get up. Meow stare at guinea pigs yet i is playing on your console hooman white cat sleeps on a black shirt, and if it fits, i sits but attack the child yet the dog smells bad. ",
    addressID: 23,
    start: new Date("2022-05-28 09:30"),
    end: new Date("2022-05-30 11:30"),
    status: 'plan',
    addressID: 23,
    street: "Eiffel Tower",
    streetAdd: "12 Assembly Dr",
    suburb: "Tullamarine",
    state: "Victoria",
    postcode: "3043",
    country: "Australia",
};

var invitees = ["jane.doe23@gmail.com ",
    "sophie@gmail.com",
    "saschaiscool@gmail.com",
    "hannahiscooltoo@gmail.com",
    "katieiscooler@gmail.com"];

//FOR EACH TIMEID, GET THE NUMBER OF INVITEES AVAILABLE / TOTAL NUMBER OF INVITEES
//var opacities: [];

var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
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
}

function arrayOfPossibleTimes(start,end) {
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    var day = 1000 * 60 * 60 * 24;
    // Number of days
    let cols = ((end.getTime() - start.getTime())/ day);
    // Number of half-hour time_slots
    let time_slots = ((end.getHours()+end.getMinutes()/60)-(start.getHours()+start.getMinutes()/60))*2;

    var possible_times = [];
    var row_slots = [];
    var time_slot_date = new Date(start);
    var first_date = start.getDate();
    // Number of time-slots
    for (let i = 0; i < time_slots; i++) {
        // Number of days
        for (let j = 0; j < cols; j++) {
            row_slots.push({time: timeIn12hrFormat(time_slot_date.getHours(),
                            time_slot_date.getMinutes()),
                            day: days[time_slot_date.getDay()] + " " + time_slot_date.getDate() + " " + months[time_slot_date.getMonth()],
                            date: new Date(time_slot_date),
                            selected: false,
                            opacity: 0.2,});
                            time_slot_date.setDate(time_slot_date.getDate() + 1);
        }
        possible_times.push(row_slots);
        row_slots = [];
        time_slot_date.setMinutes(time_slot_date.getMinutes() + 30);
        time_slot_date.setDate(first_date);
    }
    return possible_times;
}

var modify_event = new Vue({
    el: '#vue_modify_event',
    data: {
        event_name: event.name,
        event_organiser: event.creatorID,
        event_descr: event.description,

        event_addr_street: event.street,
        event_addr_street_2: event.streetAdd,
        event_addr_city: event.suburb,
        event_addr_state: event.state,
        event_addr_postcode: event.postcode,
        event_addr_country: event.country,

        event_start_day: days[event.start.getDay()],
        event_start_date: event.start.getDate(),
        event_start_month: months[event.start.getMonth()],
        event_start_year: event.start.getFullYear(),
        event_end_date: event.end.getDate(),
        event_end_month: months[event.end.getMonth()],
        event_end_year: event.end.getFullYear(),
        event_start_time: timeIn12hrFormat(event.start.getHours(), event.start.getMinutes()),
        event_end_time: timeIn12hrFormat(event.end.getHours(), event.end.getMinutes()),

        invitee_email: "",
        invitees: invitees,
        //opacity_array: [],
        times_data: arrayOfPossibleTimes(event.start,event.end),

        chosen_times: [],
        chosen_start: false,
        chosen_end: false,
        message: "Select the time you want your event to start."
    },
    methods:
    {
        onClickSelect: function(i,j) {
            if (this.chosen_start == false && this.chosen_end == false) {
                // Select block
                this.times_data[i][j].selected = true;
                this.times_data[i][j].opacity = 1;
                // Choose start
                let start = new Date(this.times_data[i][j].date);
                this.chosen_times.push(start);
                this.chosen_start = true;
                this.message = "Select the time you want your event to end.";
                return;
            } else if (this.chosen_start == true && this.chosen_end == false){
                // Check if block chosen is a valid end time
                if (this.times_data[i][j].date.getTime() >= this.chosen_times[0].getTime()) {
                    console.log("Valid");
                    // Select block
                    this.times_data[i][j].selected = true;
                    this.times_data[i][j].opacity = 1;
                    // Choose end
                    let end = new Date(this.times_data[i][j].date);
                    this.chosen_times.push(end);
                    this.chosen_end = true;
                    this.message = "You have chosen your start and end times.";
                } else {
                    console.log("Invalid");
                    this.message = "Invalid end time. Choose a time that is after the start time.";
                }
            } else {
                this.message = "Click reset if you want to clear your selection.";
            }
        },
        onClickResetChosenTimes: function() {
            this.chosen_times = [];
            this.chosen_start = false;
            this.chosen_end = false;
            for (let time in this.times_data) {
                for (let day in this.times_data[0]) {
                    this.times_data[time][day].selected = false;
                    this.times_data[time][day].opacity = 0.2;
                }
            }
            this.message = "Select the time you want your event to start.";
        },
        addInvitee: function() {
            this.invitees.push(this.invitee_email);
            this.invitee_email = "";
        },

        removeInvitee: function(invitee) {
            let position = -1;
            for (email in this.invitees){
                if (this.invitees[email] == invitee) {
                    position = email;
                    break;
                }
            }
            if (position != -1) {
                this.invitees.splice(position,1);
            }
        },

        onClickDeletePlanOrganiser: function() {
            //delete plan stuff goes here

            // // Send email notifications to invitees
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
            // xhttp.open("POST", "/users/emailcancelled", true);
            // // Set content type to JSON
            // xhttp.setRequestHeader("Content-type","application/json");
            // // Send request
            // xhttp.send(JSON.stringify(email_data));

            // // Handle response
            // xhttp.onreadystatechange = function() {
            //     // Functions once emails have been sent
            //     location.assign('/user/events');
            // };
        },

        onClickDeletePlanAdmin: function() {
            //delete plan stuff goes here too

            // // Send email notifications to invitees
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
            // xhttp.open("POST", "/users/emailcancelled", true);
            // // Set content type to JSON
            // xhttp.setRequestHeader("Content-type","application/json");
            // // Send request
            // xhttp.send(JSON.stringify(email_data));

            // // Handle response
            // xhttp.onreadystatechange = function() {
            //     // Functions once emails have been sent
            //     location.assign('/admin/events');
            // };
        },

        onClickFinaliseEventOrganiser: function() {
            //finalisation stuff here

            // Update / Finalise Event Details
                // this.event_name
                // this.event_descr
                // this.event_start // Get from this.chosen_times
                // this.event_end // Get from this.chosen_times
            // let event_data = {description: this.event_descr,
            //                     name: this.event_name,
            //                     start: ,
            //                     end: };
            // finaliseEvent(event_data);

            // Update Address
            // Check if needs to be done ????
                // this.event_addr_street
                // this.event_addr_street_2
                // this.event_addr_city
                // this.event_addr_state
                // this.event_addr_postcode
                // this.event_addr_country
            //updateAddress(location_data); -----------

            // Update Invitees
            // Check if needs to be done ????
                // this.invitees
            //addInvitees(add_invitee_emails); --------------
            //deleteInvitees(remove_invitee_emails); ------------

            // Delete Availability and Invitation Data ?????

            // // Send email notifications to invitees
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
            // xhttp.open("POST", "/users/emailfinalised", true);
            // // Set content type to JSON
            // xhttp.setRequestHeader("Content-type","application/json");
            // // Send request
            // xhttp.send(JSON.stringify(email_data));

            // // Handle response
            // xhttp.onreadystatechange = function() {
            //     // Navigation away only once emails have been sent
            //     location.assign('/user/events/event/organiser');
            // };
        },

        onClickFinaliseEventAdmin: function() {
            //finalisation stuff here

            // Send email notifications to invitees
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
            // xhttp.open("POST", "/users/emailfinalised", true);
            // // Set content type to JSON
            // xhttp.setRequestHeader("Content-type","application/json");
            // // Send request
            // xhttp.send(JSON.stringify(email_data));

            // // Handle response
            // xhttp.onreadystatechange = function() {
            //     // Navigation away only once emails have been sent
            //     location.assign('/admin/events/event');
            // };
        },

        onClickUpdatePlanOrganiser: function() {
            //update plan stuff here

            location.reload();
        },

        onClickUpdatePlanAdmin: function() {
            //update plan stuff here

            location.reload();
        },

        onClickAddToCalendar: function() {
            //trigger calendar file download or add to google calendar
        }
    }
});