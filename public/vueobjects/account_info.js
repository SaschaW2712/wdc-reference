var getAccountInfo = function getAccountInfo(callback) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status >= 200 && this.status <= 399)) {
      // console.log(this.response);
      callback(JSON.parse(this.response)[0]);
    }
  };

  //ADD LOGIC HERE FOR WHICH USER IS LOGGED IN
  xhttp.open("GET", "/request/getUserById", true);
  xhttp.send();
};

function logOut()
{
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", '/log_out', true);
  console.log("USER: log_out called");
  xhttp.send();
  console.log("sent!");

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("log out successful");
      location.assign('/logged_out');
      return true;
    } else if (this.readyState == 4 && this.status >= 400) {
      alert("Log Out Unsuccessful");
      return false;
    }
  }
};

var user_info = new Vue({
    el: '#vue_user_info',

    data: {
      name: "",
      email: "",
    },

    methods: {
      onClickSignOut: function () {
          logOut();
      }
  },
  beforeMount() {
    getAccountInfo(info => {
      this.name = info.name
      this.email = info.email
    });
  },
});