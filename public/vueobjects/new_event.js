function addAddress(location_data) {
    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("POST", "/event/addAddress", true);
    // Set content type to JSON
    xhttp.setRequestHeader("Content-type","application/json");
    // Send request
    xhttp.send(JSON.stringify(location_data));
    // Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            let address_id = JSON.parse(this.responseText).addressID;
            let start = new_event.event_start_date + " " + new_event.event_start_time + ":00";
            let end = new_event.event_end_date + " " + new_event.event_end_time + ":00";
            // Define event_data
            let event_data = {addressID: address_id,
                              description: new_event.event_descr,
                              name: new_event.event_name,
                              start: start,
                              end: end};

            // Add new plan to database
            createNewPlan(event_data);
            //return address_id;
        }
    };
}

// function checkIfAddressExists(location_data) {
//     // Create new AJAX request
//     var xhttp = new XMLHttpRequest();
//     // Open connection
//     xhttp.open("POST", "/event/checkIfAddressExists", true);
//     // Set content type to JSON
//     xhttp.setRequestHeader("Content-type","application/json");
//     // Send request
//     xhttp.send(JSON.stringify(location_data));
//     // Handle response
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && (this.status == 200 || this.status == 304)) {
//             let result = JSON.parse(this.responseText)[0].exists;
//             return result;
//         }
//     };
// }

// function getAddress(location_data) {
//     // Create new AJAX request
//     var xhttp = new XMLHttpRequest();
//     // Open connection
//     xhttp.open("POST", "/event/getAddress", true);
//     // Set content type to JSON
//     xhttp.setRequestHeader("Content-type","application/json");
//     // Send request
//     xhttp.send(JSON.stringify(location_data));
//     // Handle response
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && (this.status == 200 || this.status == 304)) {
//             let address_id = JSON.parse(this.responseText)[0].address_id;
//             return address_id;
//         }
//     };
// }

// function addAdress(location_data) {
//     // Create new AJAX request
//     var xhttp = new XMLHttpRequest();
//     // Open connection
//     xhttp.open("POST", "/event/addAdress", true);
//     // Set content type to JSON
//     xhttp.setRequestHeader("Content-type","application/json");
//     // Send request
//     xhttp.send(JSON.stringify(location_data));
//     // Handle response
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && (this.status == 200 || this.status == 304)) {
//             let address_id = JSON.parse(this.responseText)[0].address_id;
//             return address_id;
//         }
//     };
// }

function createNewPlan(event_data) {
    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("POST", "/event/createPlan", true);
    // Set content type to JSON
    xhttp.setRequestHeader("Content-type","application/json");
    // Send request
    xhttp.send(JSON.stringify(event_data));

    // Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            let event_id = JSON.parse(this.responseText).event_id;
            // Define times_data
            let start = new_event.event_start_date + " " + new_event.event_start_time + ":00";
            let end = new_event.event_end_date + " " + new_event.event_end_time + ":00";
            let times_data = {eventID: event_id,
                            start: start,
                            end: end};
                // Add times to database
                createTimes(times_data);
                //return event_id;
        }
    };
}

function createTimes(times_data) {
    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("POST", "/event/addTimes", true);
    // Set content type to JSON
    xhttp.setRequestHeader("Content-type","application/json");
    // Send request
    xhttp.send(JSON.stringify(times_data));
    // Handle response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
            let event_id = JSON.parse(this.responseText).eventID;
            // Add invitations to database
            addGuestEmails(event_id);
            //return timeID_array;
        }
    };
}

function addGuestEmails(event_id) {
    // // Define invit_data
    let invit_data = {eventID: event_id,
                    invitees: new_event.invitees};
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
            getUserIDs();
            return;
        }
    };
}

function getUserIDs() {
    let invit_data = {invitees: new_event.invitees};
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
                    location.assign('/user/events/');
                }
            }
        };
    }
}

// function addInvitation(userID) {
//     // Create new AJAX request
//     var xhttp = new XMLHttpRequest();
//     // Open connection
//     xhttp.open("POST", "/event/addInvitation", true);

//     // Set content type to JSON
//     xhttp.setRequestHeader("Content-type","application/json");
//     // Send request
//     xhttp.send(JSON.stringify({userID: userID}));

//     // Handle response
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
//             //let userID = JSON.parse(this.responseText).userID;
//             //createAvailabilities(userID);
//             return;
//         }
//     };
// }

// function createAvailabilities(userID) {
//     // Create new AJAX request
//     var xhttp = new XMLHttpRequest();
//     // Open connection
//     xhttp.open("POST", "/event/addAvails", true);

//     // Set content type to JSON
//     xhttp.setRequestHeader("Content-type","application/json");
//     // Send request
//     xhttp.send(JSON.stringify({userID: userID}));

//     // // Handle response
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
//             return;
//         }
//     };
// }

var new_event = new Vue({
    el: '#vue_new_event',
    data: {
        event_name: "",
        event_descr: "",

        event_addr_street: "",
        event_addr_street_2: "",
        event_addr_city: "",
        event_addr_state: "",
        event_addr_postcode: "",
        event_addr_country: "",

        event_start_date: "",
        event_end_date: "",
        event_start_time: "09:00",
        event_end_time: "17:00",

        invitee_email: "",
        invitees: [],

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

        // Message on click create
        create_event_message: "",
        disabled: false,

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
        validateDate: function() {
            let start = new Date(this.event_start_date);
            let end = new Date(this.event_end_date);
            let timeDiff = end.getTime() - start.getTime();
            if (timeDiff < 0 ){
                this.dates_message = "End date must be on or after start date. Set to one day after.";
                end.setDate(start.getDate()+1);
                let year = start.getFullYear();
                let month = start.getMonth() + 1;
                if (month < 10) {
                    month = "0" + month;
                }
                let date = end.getDate();
                if (date < 10) {
                    date = "0" + date;
                }
                this.event_end_date = year + "-" + month + "-" + date;
            } else {
                this.dates_message = "";
            }
        },
        validateTime: function() {
            let start = parseInt(this.event_start_time.substring(0,2))*60 +parseInt(this.event_start_time.substring(3,5));
            let end = parseInt(this.event_end_time.substring(0,2))*60 + parseInt(this.event_end_time.substring(3,5));
            let timeDiff = end - start;
            if (timeDiff <= 0 ){
                this.times_message = "End time must be after start time. Set to one hour later.";
                let end = parseInt(this.event_start_time.substring(0,2))+1;
                if (end > 9){
                    this.event_end_time = String(end) + ":" + this.event_start_time.substring(3,5);
                } else {
                    this.event_end_time = "0" + String(end) + ":" + this.event_start_time.substring(3,5);
                }
            } else {
                this.times_message = "";
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

        addInvitee: function() {
            if (!(this.invitees.includes(this.invitee_email))){
                this.invitees.push(this.invitee_email);
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
        },

        onClickCreatePlan: function() {
            //create new plan stuff here

            // Input Validation
            if (this.invitees.length === 0){
                this.invitee_message = "Add at least one invitee.";
            }
            if (this.event_name === ""){
                this.name_message = "Add an event name.";
            }
            if (this.event_addr_street === ""){
                this.location_message = "Fill in at least the street address field with the event location.";
            }
            if ((this.event_start_date === "") || (this.event_end_date === "")){
                this.dates_message = "Event must have a start and an end date.";
            } else {
                this.disabled = true;
                this.create_event_message = "Creating Event!";
                // Define location_data
                let location_data = {street: this.event_addr_street,
                                    streetAdd: this.event_addr_street_2,
                                    suburb: this.event_addr_city,
                                    state: this.event_addr_state,
                                    postcode: this.event_addr_postcode,
                                    country: this.event_addr_country};

                addAddress(location_data);

                // Send email notifications to invitees
                let event_dates = this.event_start_date + " " + this.event_start_month + " " + this.event_start_year +
                " - " + this.event_end_date + " " + this.event_end_month + " " + this.event_end_year;
                let event_times = this.event_start_time + " - " + this.event_end_time;

                let email_data = {invitees: this.invitees,
                    //organiser: this.event_organiser,
                    name: this.event_name,
                    //loc: this.event_loc,
                    descr: this.event_descr,
                    dates: event_dates,
                    times: event_times};

                // Create new AJAX request
                var xhttp = new XMLHttpRequest();
                // Open connection
                xhttp.open("POST", "/users/emailcreated", true);
                // Set content type to JSON
                xhttp.setRequestHeader("Content-type","application/json");
                // Send request
                xhttp.send(JSON.stringify(email_data));

                // Handle response
                xhttp.onreadystatechange = function() {
                    // Send user to different page
                    //location.assign('events/plan/' + event_id.toString() + '/organiser');
                    //location.assign('/user/events/');
                };
            }
        }
    } //methods
    }) //vue