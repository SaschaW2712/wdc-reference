

var manage_info = new Vue({
    el: '#vue_manage_info',
    data: {
        new_username: "",
        new_email: "",
        new_password: "",
        password1: "",
        password2: "",
        password3: ""
    },

    methods: {
      onClickChangeUsername: function () {
        //Changing username stuff (including maybe confirmation) goes HERE

        //Refresh page after username is changed (UX - feels like something tangible has "happened")
        location.reload();
      },

      onClickChangeEmail: function () {
        //Changing email stuff (including maybe confirmation) goes HERE

        location.reload();
      },

      onClickChangePassword: function () {
        //Changing password stuff (including maybe confirmation) goes HERE

        location.reload();
      },

      onClickDeleteAccount: function () {
        //Delete account stuff (including maybe confirmation) goes HERE
        console.log('here');

        location.assign('/logged_out');
      },
    },
  });

  var manage_user_info = new Vue({
    el: '#vue_manage_user_info',
    data: {
        new_username: "",
        new_email: "",
        new_password: "",
        admin_password: ""
    },

    methods: {
      onClickUpdateUserInfo: function () {
        //Changing user details stuff (including maybe confirmation) goes HERE

        //Refresh page after username is changed (UX - feels like something tangible has "happened")
        location.reload();
      },

      onClickDeleteUserAccount: function () {
        //Deleting a user's account (including maybe confirmation) goes HERE
        console.log('here');

        location.assign('/admin/users');
      },
    }
  })