// Preliminary data
var event = {
    name: "Alice's 21th",
    descr: "Cat ipsum dolor sit amet, suddenly go on wild-eyed crazy rampage to pet a cat, rub its belly, endure blood and agony, quietly weep, keep rubbing belly. Mark territory stare at guinea pigs. Love. Floof tum, tickle bum, jellybean footies curly toes do not try to mix old food with new one to fool me! eat from dog's food for meow find a way to fit in tiny box. Steal the warm chair right after you get up. Meow stare at guinea pigs yet i is playing on your console hooman white cat sleeps on a black shirt, and if it fits, i sits but attack the child yet the dog smells bad. ",
    addr_street: "Eiffel Tower",
    addr_street_2: "12 Assembly Dr",
    addr_city: "Tullamarine",
    addr_state: "Victoria",
    addr_postcode: "3043",
    addr_country: "Australia",
    start: new Date("2022-05-28 09:30"),
    end: new Date("2022-05-30 11:30"),
    invitees: ["jane.doe23@gmail.com ",
    "sophie@gmail.com",
    "saschaiscool@gmail.com",
    "hannahiscooltoo@gmail.com",
    "katieiscooler@gmail.com"]
};
// // Preliminary data - link to database
// var current_user = {
//     name: "John",
//     email: "john@gmail.com"
// };

// var getEventInfo = function getEventInfo(callback) {
//     var xhttp = new XMLHttpRequest();

//     xhttp.onreadystatechange = function() {
//       if (this.readyState == 4 &&  this.status == 200) {
//         //var resObject = JSON.parse(this.response)[0];
//         callback(JSON.parse(this.response)[0]);
//       }
//     };

//     //ADD LOGIC HERE FOR WHICH PLAN THE USER IS VIEWING
//     xhttp.open("GET", "/request/getEventWithAddresses?id=1", true);
//     xhttp.send();
//   }

// function getEventInfo() {
//     // Create new AJAX request
//     var xhttp = new XMLHttpRequest();
//     // Open connection
//     xhttp.open("GET", "/request/getEvent", true);

//     // Send request
//     xhttp.send();

//     // Handle response
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
//             let event = JSON.parse(this.responseText)[0];
//             return event;
//         }
//     };
// }

// function getTimes() {
//     // Create new AJAX request
//     var xhttp = new XMLHttpRequest();
//     // Open connection
//     xhttp.open("GET", "/request/getTimes", true);

//     // Send request
//     xhttp.send();

//     // Handle response
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
//             let times = JSON.parse(this.responseText);
//             return times;
//         }
//     };
// }

// // Inserts one row
// function addAvailability(avail) {
//     // Create new AJAX request
//     var xhttp = new XMLHttpRequest();
//     // Open connection
//     xhttp.open("POST", "/request/updateAvail", true);
//     // Set content type to JSON
//     xhttp.setRequestHeader("Content-type","application/json");
//     // Send request
//     xhttp.send(JSON.stringify(avail));
//     // Handle response
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
//             return;
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

// function arrayOfPossibleTimes(start,end) {
//     var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
//     var days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
//     var day = 1000 * 60 * 60 * 24;
//     // Number of days
//     let cols = ((end.getTime() - start.getTime())/ day);
//     // Number of half-hour time_slots
//     let time_slots = ((end.getHours()+end.getMinutes()/60)-(start.getHours()+start.getMinutes()/60))*2;

//     var possible_times = [];
//     var row_slots = [];
//     var time_slot_date = new Date(start);
//     var first_date = start.getDate();
//     // Number of time-slots
//     for (let i = 0; i < time_slots; i++) {
//         // Number of days
//         for (let j = 0; j < cols; j++) {
//             row_slots.push({time: timeIn12hrFormat(time_slot_date.getHours(),
//                             time_slot_date.getMinutes()),
//                             day: days[time_slot_date.getDay()] + " " + time_slot_date.getDate() + " " + months[time_slot_date.getMonth()],
//                             date: new Date(time_slot_date),
//                             selected: false});
//             time_slot_date.setDate(time_slot_date.getDate() + 1);
//         }
//         possible_times.push(row_slots);
//         row_slots = [];
//         time_slot_date.setMinutes(time_slot_date.getMinutes() + 30);
//         time_slot_date.setDate(first_date);
//     }
//     return possible_times;
// }

function arrayOfPossibleTimes(event) {
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    var day = 1000 * 60 * 60 * 24;
    // Number of days
    let cols = ((event.end.getTime() - event.start.getTime())/ day);
    // Number of half-hour time_slots
    let time_slots = ((event.end.getHours()+event.end.getMinutes()/60)-(event.start.getHours()+event.start.getMinutes()/60))*2;

    var possible_times = [];
    var row_slots = [];
    var time_slot_date = new Date(event.start);
    var first_date = event.start.getDate();
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
}

let possible_times = arrayOfPossibleTimes(event);

var vueinst = new Vue({
    el: '#vue_event',
    data: {
        event_name: event.name,
        event_descr: event.descr,
        event_addr_street: event.addr_street,
        event_addr_street_2: event.addr_street_2,
        event_addr_city: event.addr_city,
        event_addr_state: event.addr_state,
        event_addr_postcode: event.addr_postcode,
        event_addr_country: event.addr_country,

        // event_name: "",
        // event_descr: "",
        // event_start: "",
        // event_end: "",

        // event_addr_street: "",
        // event_addr_street_2: "",
        // event_addr_city: "",
        // event_addr_state: "",
        // event_addr_postcode: "",
        // event_addr_country: "",

        guest_name: "",
        guest_email: "",

        // times_data: [],
        times_data: possible_times,
        availability: []
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
            //save guest availability here
            let availability_array = this.availability;
            //availability_array = availability_array.sort(function(time1, time2){return time1 - time2});

            // Get array of TIMEID
            let times = getTimes(); // array of objects {timeID: int, start: datetime}


            // for each datetime in availability_array
            for (avail in availability_array) {
                for ( time in times) {
                    if (avail === time.start) {
                        addAvailability({timeID: time.timeID});
                    }
                }
            }

            // Send email notification to organiser
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
            xhttp.open("POST", "/users/emailresponded", true);
            // Set content type to JSON
            xhttp.setRequestHeader("Content-type","application/json");
            // Send request
            xhttp.send(JSON.stringify(email_data));

            // Handle response
            xhttp.onreadystatechange = function() {
                // Functions once emails have been sent
                location.reload();
            };
        }
    }
    // },

    // beforeMount() {
    //     // getEventInfo(info => {
    //     //     this.event_name = info.name,
    //     //     this.event_descr = info.description,
    //     //     this.event_start = info.start,
    //     //     this.event_end = info.end,
    //     //     this.event_addr_street = info.street,
    //     //     this.event_addr_street_2 = info.streetAdd,
    //     //     this.event_addr_city = info.suburb,
    //     //     this.event_addr_state = info.state,
    //     //     this.event_addr_postcode = info.postcode,
    //     //     this.event_addr_country = info.country,
    //     //     this.times_data = arrayOfPossibleTimes(info.start,info.end)
    //     // });

    //     // Get Event Info
    //     let event = getEventInfo();

    //     this.event_name = event.name;
    //     this.event_descr = event.description;
    //     this.event_start = event.start;
    //     this.event_end = event.end;
    //     this.times_data = arrayOfPossibleTimes(event.start,event.end);

    //     let address_id = event.addressID;

    //     // Get Address Info
    //     // Create new AJAX request
    //     var xhttp = new XMLHttpRequest();
    //     // Open connection
    //     xhttp.open("POST", "/request/getAddress", true);
    //     // Set content type to JSON
    //     xhttp.setRequestHeader("Content-type","application/json");
    //     // Send request
    //     xhttp.send({addressID: address_id});

    //     // Handle response
    //     xhttp.onreadystatechange = function() {
    //         if (this.readyState == 4 && (this.status == 200 OR this.status == 304)) {
    //             let address = JSON.parse(this.responseText)[0];

    //             vuesinst.event_addr_street = address.street;
    //             vuesinst.event_addr_street_2 = address.streetAdd;
    //             vuesinst.event_addr_city = address.suburb;
    //             vuesinst.event_addr_state = address.state;
    //             vuesinst.event_addr_postcode = address.postcode;
    //             vuesinst.event_addr_country = address.country;
    //         }
    //     };
    // }
});

