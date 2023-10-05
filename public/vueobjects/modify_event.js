// Change to get the eventID from the session
function getEventInvitees(eventID) {
    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("GET", "/request/getEventInvitees?eventID=" + encodeURIComponent(eventID), true);

    // Send request
    xhttp.send();

    // Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            let invitees = JSON.parse(this.responseText);
            let emails = []
            for (let invitee of invitees){
                emails.push(invitee.email);
            }
            vueinst.invitees = emails;

            // Get Event Times and the total number of people available for each time
            getTimesAndAvailabilities(vueinst.event_id); //getTimesAndAvailabilities();
            return;
        }
    };
};

// Change to get the eventID from the session
function getTimesAndAvailabilities(eventID) {
    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("GET", "/request/getTimesAndAvailabilities?eventID=" + encodeURIComponent(eventID), true);

    // Send request
    xhttp.send();

    // Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            let times = JSON.parse(this.responseText);
            //console.log(times);

            let total_invitees = vueinst.invitees.length;

            vueinst.zero_opacity = (1 / (total_invitees+1));

            //console.log(total_invitees);
            let opacities = [];
            for (let time of times){
                opacities.push((time.total_available+1) / (total_invitees+1));
            }
            vueinst.opacity_array = opacities;

            // Create opacity array
            // Opacity = total availbale people / total number of invitees

            // Get Event Info
            getEventInfo(vueinst.event_id); //getEventInfo();
            return;
        }
    };
}

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
            vueinst.address_id = event.addressID;
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

function finaliseEvent()
{
    let event_data = {
        eventID: vueinst.event_id,
        name: vueinst.event_name,
        description: vueinst.event_descr,
        start: vueinst.chosen_times[0],
        end: vueinst.chosen_times[1],
    };
    //console.log(event_data);

    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("POST", "/users/finaliseevent", true);
    // Set content type to JSON
    xhttp.setRequestHeader("Content-type","application/json");
    // Send request
    xhttp.send(JSON.stringify(event_data));

    // Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            console.log(this.response);
            updateAddressDetails();
        }
    };
}

function deleteTimesAndAvailabilities() {
    let event_data = {
        eventID: vueinst.event_id,
    };
    //console.log(event_data);

    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("POST", "/users/finaliseEventDeleteActions", true);
    // Set content type to JSON
    xhttp.setRequestHeader("Content-type","application/json");
    // Send request
    xhttp.send(JSON.stringify(event_data));

    // Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            console.log(this.response);
        }
    };
}

function updatePlanDetails()
{
    let event_data = {
        eventID: vueinst.event_id,
        name: vueinst.event_name,
        description: vueinst.event_descr,
    };

    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("POST", "/users/eventupdated", true);
    // Set content type to JSON
    xhttp.setRequestHeader("Content-type","application/json");
    // Send request
    xhttp.send(JSON.stringify(event_data));

    // Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            console.log(this.response);
            updateAddressDetails();
        }
    };
}

function updateAddressDetails()
{
    let address_data = {
        addressID: vueinst.address_id,
        street: vueinst.event_addr_street,
        streetAdd: vueinst.event_addr_street_2,
        suburb: vueinst.event_addr_city,
        state: vueinst.event_addr_state,
        postcode: vueinst.event_addr_postcode,
        country: vueinst.event_addr_country,
    };
    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("POST", "/users/addressupdated", true);
    // Set content type to JSON
    xhttp.setRequestHeader("Content-type","application/json");
    // Send request
    xhttp.send(JSON.stringify(address_data));

    // Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            console.log(this.response);
            removeInvitees();
        }
    };
}

function removeInvitees()
{
    let invitee_data = {
        eventID: vueinst.event_id,
        delete_invitations: vueinst.remove_invitees,
    };

    // Check no emails to remove
    if (invitee_data.delete_invitations.length === 0) {
        addGuestEmails();
    } else {
        // Create new AJAX request
        var xhttp = new XMLHttpRequest();
        // Open connection
        xhttp.open("POST", "/users/removeinvitees", true);
        // Set content type to JSON
        xhttp.setRequestHeader("Content-type","application/json");
        // Send request
        xhttp.send(JSON.stringify(invitee_data));

        // Handle response
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
                console.log(this.response);
                addGuestEmails();
            }
        };
    }
}

function addGuestEmails() {
    // // Define invit_data
    let invit_data = {eventID: vueinst.event_id,
        invitees: vueinst.add_invitees};

    // Check no invitees to add
    if (invit_data.invitees.length === 0){
        // Check if user is updating or finalising plan
        if (!vueinst.finalised) {
            // Updated Event
            location.reload();
        } else {
            // Finalised Event
            location.assign('/user/event/' + vueinst.eventId + '/organiser');
        }
    } else {
        // Create new AJAX request
        var xhttp = new XMLHttpRequest();
        // Open connection
        xhttp.open("POST", "/event/addGuestEmails", true);
        // Set content type to JSON
        xhttp.setRequestHeader("Content-type","application/json");
        // Send request
        xhttp.send(JSON.stringify(invit_data));
        // Handle response
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
                console.log("response from addGuestEmails");
                getUserIDs();
                return;
            }
        };
    }
}

function getUserIDs() {
    let invit_data = {invitees: vueinst.add_invitees};
    //let userIDs = [];
    let email = "";
    let invitees = invit_data.invitees;

    for (let i = 0; i < invitees.length; i++)
    {
        email = invitees[i];
        //console.log(email);
        // Create new AJAX request
        var xhttp = new XMLHttpRequest();
        // Open connection
        xhttp.open("POST", "/event/getUserID", true);
        // Set content type to JSON
        xhttp.setRequestHeader("Content-type","application/json");
        // Send request
        xhttp.send(JSON.stringify({email: email}));
        // Handle response
        xhttp.onreadystatechange =  function() {
            if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
                let guest_email = JSON.parse(this.responseText).email;
                //userIDs.push(userID);
                //addInvitation(userID);
                // check if email is last in list
                if (guest_email == invitees[invitees.length-1]) {
                    // Check if user is updating or finalising plan
                    if (!vueinst.finalised) {
                        // Updated Event
                        window.scrollTo(0,0);
                        location.reload();
                    } else {
                        // Finalised Event
                        location.assign('/user/event/' + vueinst.eventId + '/organiser');
                    }
                }
            }
        };
    }
}

// Slightly modified updatePlanDetails to above: ^ (Sorry, I'm not comfortable using callback functions!!)
// function updatePlanDetails(currEventId, newName, newDescription, callback)
// {
//     console.log("newDescription in vue func: " + newDescription);
//     let event_data = {
//         eventId: currEventId,
//         name: newName,
//         description: newDescription,
//     }

//     // Create new AJAX request
//     var xhttp = new XMLHttpRequest();
//     // Open connection
//     xhttp.open("POST", "/users/eventupdated", true);
//     // Set content type to JSON
//     xhttp.setRequestHeader("Content-type","application/json");
//     // Send request
//     xhttp.send(JSON.stringify(event_data));

//     // Handle response
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
//             console.log(this.response);
//             callback("done");
//         }
//     };
// }

// Slightly modified finaliseEvent to above: ^ (Sorry, I'm not comfortable using callback functions!!)
// function finaliseEvent(currEventId, callback)
// {
//     let event_data = {
//         eventId: currEventId
//     }

//     // Create new AJAX request
//     var xhttp = new XMLHttpRequest();
//     // Open connection
//     xhttp.open("POST", "/users/finaliseevent", true);
//     // Set content type to JSON
//     xhttp.setRequestHeader("Content-type","application/json");
//     // Send request
//     xhttp.send(JSON.stringify(event_data));

//     // Handle response
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
//             callback(this.response);
//         }
//     };
// }

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
    var first_date = start.getDate();
    // Number of time-slots
    for (let i = 0; i < time_slots; i++) {
        // Number of days
        for (let j = 0; j < cols; j++) {
            row_slots.push({time: timeIn12hrFormat(time_slot_date.getHours(),
                            time_slot_date.getMinutes()),
                            day: days[time_slot_date.getDay()] + " " + time_slot_date.getDate() + " " + months[time_slot_date.getMonth()-1],
                            date: new Date(time_slot_date),
                            selected: false,
                            opacity: vueinst.opacity_array[i+time_slots*j]});
            time_slot_date.setDate(time_slot_date.getDate() + 1);
        }
        possible_times.push(row_slots);
        row_slots = [];
        time_slot_date.setMinutes(time_slot_date.getMinutes() + 30);
        time_slot_date.setDate(first_date);
    }
    return possible_times;
}

//Check which invitees want notifications
// Not finished
function inviteesToEmail(invitees, email_type) {
    let invitee_list = [];
    for (invitee in invitees) {
        // Check if invitee wants to receive notifications
        if (true /* change later*/) {
            invitee_list.push(invitee);
        }
    }
    return invitee_list;
}

var vueinst = new Vue({
    el: '#vue_modify_event',
    data: {
        event_id: '', //Populated once current event ID is fetched

        event_name: "",
        event_descr: "",
        event_start: "",
        event_end: "",

        address_id: "",
        event_addr_street: "",
        event_addr_street_2: "",
        event_addr_city: "",
        event_addr_state: "",
        event_addr_postcode: "",
        event_addr_country: "",

        link: "thisplanlink",

        invitee_email: "",
        invitees: [],
        remove_invitees: [],
        add_invitees: [],

        opacity_array: [],
        zero_opacity: 0.1,
        all_opacity: 1,

        invitees_email_finalised: [], // Not used yet
        invitees_email_cancelled: [], // Not used yet

        times_data: [],

        chosen_times: [],
        chosen_start: false,
        chosen_end: false,
        message: "Select the time you want your event to start.",

        // Validation messages for empty or invalid input
        name_message: "",
        location_message: "",
        dates_message: "",
        times_message: "",
        invitee_message: "",

        // Validation messages for input that is too long
        name_length_message: "",
        descr_message: "",
        location_length_message: "",
        email_message: "",

        // Hide finalise event times picker
        hidden: true,

        // Delete / Finalise / Update message
        update_event_message: "",
        disabled: false,
        finalised: false,

    },
    methods: {
        validateName: function() {
            if (this.event_name.length > 56) {
                this.name_length_message = "Name must be 56 characters or less.";
                this.event_name = this.event_name.slice(0, 56);
            } else {
                this.name_length_message = "";
            }
        },
        validateDescription: function() {
            if (this.event_descr.length > 256) {
                this.descr_message = "Description must be 256 characters or less.";
                this.event_descr = this.event_descr.slice(0, 256);
            } else {
                this.descr_message = "";
            }
        },
        validateStreet: function() {
            if (this.event_addr_street.length > 256) {
                this.location_length_message = "Street Address must be 256 characters or less.";
                this.event_addr_street = this.event_addr_street.slice(0, 256);
            } else {
                this.location_length_message = "";
            }
        },
        validateStreet_2: function() {
            if (this.event_addr_street_2.length > 256) {
                this.location_length_message = "Street Address Line 2 must be 256 characters or less.";
                this.event_addr_street_2 = this.event_addr_street_2.slice(0, 256);
            } else {
                this.location_length_message = "";
            }
        },
        validateCity: function() {
            if (this.event_addr_city.length > 256) {
                this.location_length_message = "City must be 256 characters or less.";
                this.event_addr_city = this.event_addr_city.slice(0, 256);
            } else {
                this.location_length_message = "";
            }
        },
        validateState: function() {
            if (this.event_addr_state.length > 64) {
                this.location_length_message = "State must be 64 characters or less.";
                this.event_addr_state = this.event_addr_state.slice(0, 64);
            } else {
                this.location_length_message = "";
            }
        },
        validatePostcode: function() {
            if (this.event_addr_postcode.length > 16) {
                this.location_length_message = "Post Code must be 16 characters or less.";
                this.event_addr_postcode = this.event_addr_postcode.slice(0, 16);
            } else {
                this.location_length_message = "";
            }
        },
        validateCountry: function() {
            if (this.event_addr_country.length > 64) {
                this.location_length_message = "Country must be 64 characters or less.";
                this.event_addr_country = this.event_addr_country.slice(0, 64);
            } else {
                this.location_length_message = "";
            }
        },
        validateEmail: function() {
            if (this.invitee_email.length > 64) {
                this.email_message = "Email must be 64 characters or less.";
                this.invitee_email = this.invitee_email.slice(0, 64);
            } else {
                this.email_message = "";
            }
        },
        onClickSelect: function(i,j) {
            if (this.chosen_start == false && this.chosen_end == false) {
                // Select block
                this.times_data[i][j].selected = true;
                this.times_data[i][j].opacity = 1;
                // Choose start
                let start = new Date(this.times_data[i][j].date);

                // Convert start to SQL friendly time
                let year = start.getFullYear();
                let month = start.getMonth() + 1;
                if (month < 10) {
                    month = "0" + month;
                }
                let date = start.getDate();
                if (date < 10) {
                    date = "0" + date;
                }
                let datetime = year + "-" + month + "-" + date + " " + start.toLocaleTimeString();

                // Add to array
                this.chosen_times.push(datetime);
                this.chosen_start = true;
                this.message = "Select the time you want your event to end.";
                return;
            } else if (this.chosen_start == true && this.chosen_end == false){
                // Check if block chosen is a valid end time
                if (this.times_data[i][j].date.getTime() >= new Date(this.chosen_times[0]).getTime()) {
                    console.log("Valid");
                    // Select block
                    this.times_data[i][j].selected = true;
                    this.times_data[i][j].opacity = 1;
                    // Choose end
                    let end = new Date(this.times_data[i][j].date);
                    // Add one half hour to correct end time
                    end.setMinutes(end.getMinutes() + 30);

                    // Convert end to SQL friendly time
                    let year = end.getFullYear();
                    let month = end.getMonth() + 1;
                    if (month < 10) {
                        month = "0" + month;
                    }
                    let date = end.getDate();
                    if (date < 10) {
                        date = "0" + date;
                    }
                    let datetime = year + "-" + month + "-" + date + " " + end.toLocaleTimeString();

                    // Add to array
                    this.chosen_times.push(datetime);
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
                    let k = parseInt(time) + this.times_data.length*parseInt(day);
                    this.times_data[time][day].selected = false;
                    this.times_data[time][day].opacity = this.opacity_array[k]; // Need to get from array of opacities
                }
            }
            this.message = "Select the time you want your event to start.";
        },

        addInvitee: function() {
            if (!(this.invitees.includes(this.invitee_email))){
                this.invitees.push(this.invitee_email);
                if (!(this.add_invitees.includes(this.invitee_email))){
                    this.add_invitees.push(this.invitee_email);
                }
            }
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
            if (!(this.remove_invitees.includes(invitee))){
                this.remove_invitees.push(invitee);
            }
        },

        onClickShowTimes: function() {
            this.hidden = false;
        },

        onClickDeletePlanOrganiser: function() {
            //delete plan stuff goes here
            this.disabled = true; // disable buttons
            this.update_event_message = "Deleting plan...";

            // Send email notifications to invitees
            let event_dates = this.event_start_date + " " + this.event_start_month + " " + this.event_start_year +
            " - " + this.event_end_date + " " + this.event_end_month + " " + this.event_end_year;
            let event_times = this.event_start_time + " - " + this.event_end_time;

            let email_data = {invitees: this.invitees,
                organiser: this.event_organiser,
                name: this.event_name,
                //loc: this.event_loc,
                descr: this.event_descr,
                dates: event_dates,
                times: event_times};

            // Create new AJAX request
            var xhttp = new XMLHttpRequest();
            // Open connection
            xhttp.open("POST", "/users/emailcancelled", true);
            // Set content type to JSON
            xhttp.setRequestHeader("Content-type","application/json");
            // Send request
            xhttp.send(JSON.stringify(email_data));

            // Handle response
            xhttp.onreadystatechange = function() {
                // Functions once emails have been sent
                location.assign('/user/events');
            };
        },

        onClickDeletePlanAdmin: function() {
            //delete plan stuff goes here too
            this.disabled = true; // disable buttons
            this.update_event_message = "Deleting plan...";

            // Send email notifications to invitees
            let event_dates = this.event_start_date + " " + this.event_start_month + " " + this.event_start_year +
            " - " + this.event_end_date + " " + this.event_end_month + " " + this.event_end_year;
            let event_times = this.event_start_time + " - " + this.event_end_time;

            let email_data = {invitees: this.invitees,
                organiser: this.event_organiser,
                name: this.event_name,
                //loc: this.event_loc,
                descr: this.event_descr,
                dates: event_dates,
                times: event_times};

            // Create new AJAX request
            var xhttp = new XMLHttpRequest();
            // Open connection
            xhttp.open("POST", "/users/emailcancelled", true);
            // Set content type to JSON
            xhttp.setRequestHeader("Content-type","application/json");
            // Send request
            xhttp.send(JSON.stringify(email_data));

            // Handle response
            xhttp.onreadystatechange = function() {
                // Functions once emails have been sent
                location.assign('/admin/events');
            };
        },

        onClickFinaliseEventOrganiser: function() {
            //finalisation stuff here

            // Add logic to see if start and end times have been chosen
            if (this.chosen_times.length < 2) {
                // Need to choose end and start times
            } else {
                this.finalised = true;
                this.disabled = true; // disable buttons
                this.update_event_message = "Finalising plan...";

                // Delete Times and Availabilities
                deleteTimesAndAvailabilities();
                // Finalise Event
                finaliseEvent();

                //Causing error
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
                //     times: event_times,
                //     finalised: true};

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
                //     finaliseEvent(this.event_id, eventId => {
                //         console.log(eventId)
                //         //location.assign('/user/event/' + eventId + '/organiser');
                //     })
                //     // Navigation away only once emails have been sent and event is finalised
                // };
            }
        },

        onClickFinaliseEventAdmin: function() {
            //finalisation stuff here
            this.disabled = true; // disable buttons
            this.update_event_message = "Finalising plan...";

            // Send email notifications to invitees
            let event_dates = this.event_start_date + " " + this.event_start_month + " " + this.event_start_year +
            " - " + this.event_end_date + " " + this.event_end_month + " " + this.event_end_year;
            let event_times = this.event_start_time + " - " + this.event_end_time;

            let email_data = {invitees: this.invitees,
                organiser: this.event_organiser,
                name: this.event_name,
                //loc: this.event_loc,
                descr: this.event_descr,
                dates: event_dates,
                times: event_times};

            // Create new AJAX request
            var xhttp = new XMLHttpRequest();
            // Open connection
            xhttp.open("POST", "/users/emailfinalised", true);
            // Set content type to JSON
            xhttp.setRequestHeader("Content-type","application/json");
            // Send request
            xhttp.send(JSON.stringify(email_data));

            // Handle response
            xhttp.onreadystatechange = function() {
                // Navigation away only once emails have been sent
                location.assign('/admin/events/event');
            };
        },

        onClickUpdatePlanOrganiser: function() {
            // Do not update times ... only fo this for finalise time
            this.disabled = true; // disable buttons
            this.update_event_message = "Updating plan...";

            //console.log(this.event_descr);
            //update plan stuff here

            updatePlanDetails();

            // Slightly modified updatePlan to above: ^ (Sorry! not comfortable with callback functions!!)
            // let newName = this.event_name;
            // let newDescription = this.event_descr;

            // updatePlanDetails(this.event_id, newName, newDescription, result => {
            //     console.log(result);
            //     location.reload();
            // });
        },

        onClickUpdatePlanAdmin: function() {
            //update plan stuff here
            this.disabled = true; // disable buttons
            this.update_event_message = "Updating plan...";

            location.reload();
        },

        onClickAddToCalendar: function() {
            //trigger calendar file download or add to google calendar
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
                // Get Event Invitees
                vueinst.event_id = this.response
                getEventInvitees(this.response);
            }
        };

        // Send request
        xhttp.send();
      }
});
