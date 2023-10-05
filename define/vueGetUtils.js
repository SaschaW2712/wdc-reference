function getAccountInfo() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 &&  this.status == 200) {
        console.log(this.response);
        return JSON.parse(this.response)[0];
      }
    };

    xhttp.open("GET", "/request/getUser?id=1", true);
    xhttp.send();
  }

module.exports = {
    getAccountInfo
}