
var manage_notif = new Vue({
    el: '#vue_manage_notif',
    data: {
        responded: true,
        finalised: true,
        cancelled: true
    },

    methods: {
        onClickSave: function() {
            //save email notifs

            location.reload();
        }
    }
    })