function login(details) {
    // Create new AJAX request
    var xhttp = new XMLHttpRequest();
    // Open connection
    xhttp.open("POST", "/login", true);
    // Set content type to JSON
    xhttp.setRequestHeader("Content-type","application/json");
    // Send request
    xhttp.send(JSON.stringify(details));

     // Handle response
     xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            location.assign('/user/events');
            return true;
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Login Unsuccessful");
            return false;
        }
    }
}

var signin = new Vue({
    el: '#vue_signin',
    data: {
        email: "",
        password: "",

        // Validation messages
        email_message: "",
        password_message: "",
    },

    methods: {
        validateEmail: function() {
            if (this.email.length > 64) {
                this.email = this.email.slice(0, 64);
            }
        },
        validatePassword: function() {
            if (this.password.length > 128) {
                this.password = this.password.slice(0, 128);
            }
        },
        onClickUserSignIn: function() {
            console.log("signin");
            //sign in stuff here
            let details = {email: this.email,
                           password: this.password};

            login(details);
        },

        onClickAdminSignIn: function() {
            //sign in stuff here

            location.assign('/admin/events');
        }

    }
})