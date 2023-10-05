// Preliminary data - link to database
var event = {
    id: 1,
    name: "Alice's 21th",
    descr: "Cat ipsum dolor sit amet, suddenly go on wild-eyed crazy rampage to pet a cat, rub its belly, endure blood and agony, quietly weep, keep rubbing belly. Mark territory stare at guinea pigs. Love. Floof tum, tickle bum, jellybean footies curly toes do not try to mix old food with new one to fool me! eat from dog's food for meow find a way to fit in tiny box. Steal the warm chair right after you get up. Meow stare at guinea pigs yet i is playing on your console hooman white cat sleeps on a black shirt, and if it fits, i sits but attack the child yet the dog smells bad. ",
    addr_street: "Eiffel Tower",
    addr_street_2: "12 Assembly Dr",
    addr_city: "Tullamarine",
    addr_state: "Victoria",
    addr_postcode: "3043",
    addr_country: "Australia",
    start: new Date("2022-05-28 09:14"),
    end: new Date("2022-05-28 10:31"),
    invitees: ["jane.doe23@gmail.com ",
    "sophie@gmail.com",
    "saschaiscool@gmail.com",
    "hannahiscooltoo@gmail.com",
    "katieiscooler@gmail.com"]
};

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

// function getEventInvitees() {
//     // Create new AJAX request
//     var xhttp = new XMLHttpRequest();
//     // Open connection
//     xhttp.open("GET", "/request/getEventInvitees", true);

//     // Send request
//     xhttp.send();

//     // Handle response
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
//             let invitees = JSON.parse(this.responseText);
//             return invitees;
//         }
//     };
// }

var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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

var modify_event = new Vue({
    el: '#vue_event',
    data: {
        event_name: event.name,
        event_descr: event.descr,
        event_start: event.start,
        event_end: event.end,

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

        invitee_email: "",
        invitees: [],

        event_start_day: days[event.start.getDay()],
        event_start_date: event.start.getDate(),
        event_start_month: months[event.start.getMonth()],
        event_start_year: event.start.getFullYear(),
        event_start_time: timeIn12hrFormat(event.start.getHours(), event.start.getMinutes()),
        event_end_time: timeIn12hrFormat(event.end.getHours(), event.end.getMinutes()),

        // event_start_day: "",
        // event_start_date: "",
        // event_start_month: "",
        // event_start_year: "",
        // event_start_time: "",
        // event_end_time: "",
    },

    methods: {

    onClickAddToCalendar: function() {
        //add to google calendar or generate .ics file
        // console.log(module);

        console.log(this.event_id);

        // createICS(event);
    },
    },

    // beforeMount() {
    //     // getEventInfo(info => {
    //     //     event_id = info.eventID;
    //     //     event_name = info.name;
    //     //     event_descr = info.description;
    //     //     // event_loc = getAddress(event_id);
    //     //     // event_start_day: days[info.start.getDay()],
    //     //     // event_start_date: event.start.getDate(),
    //     //     // event_start_month: months[event.start.getMonth()],
    //     //     // event_start_year: event.start.getFullYear(),
    //     //     // event_start_time: timeIn12hrFormat(event.start.getHours(), event.start.getMinutes()),
    //     //     // event_end_time: timeIn12hrFormat(event.end.getHours(), event.end.getMinutes()),
    //     //     // invitee_email: "",
    //     //     // invitees: event.invitees
    //     // });

    //     // Get Event Info
    //     let event = getEventInfo();

    //     // Get Event Invitees
    //     let invitees = [];
    //     let invitee_array = getEventInvitees(); // Array of objects
    //     for (invitee in invitee_array){
    //         invitees.push(invitee.email);
    //     }
    //     this.invitees = invitees;

    //     this.event_name = event.name;
    //     this.event_descr = event.description;
    //     this.event_start = event.start;
    //     this.event_end = event.end;

    //     this.event_start_day: days[event.start.getDay()],
    //     this.event_start_date: event.start.getDate(),
    //     this.event_start_month: months[event.start.getMonth()],
    //     this.event_start_year: event.start.getFullYear(),
    //     this.event_start_time: timeIn12hrFormat(event.start.getHours(), event.start.getMinutes()),
    //     this.event_end_time: timeIn12hrFormat(event.end.getHours(), event.end.getMinutes()),

    //     this.times_data = arrayOfPossibleTimes(event.start,event.end,opacities);

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
