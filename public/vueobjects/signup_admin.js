
var signup_admin = new Vue({
    el: '#vue_signup_admin',
    data: {
        username: "",
        email: "",
        password: "",
        admin_password: ""
    },

    methods: {
        onClickSignUpAnAdmin: function() {
            //sign up admin stuff here

            location.assign('/admin/account');
        }
    }
})