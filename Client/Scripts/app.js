"use strict";
(function () {
    function confirmDelete() {
        $("a.delete").on("click", function (event) {
            if (!confirm("Are you sure?")) {
                event.preventDefault();
                location.href = '/surveys';
            }
        });
    }
    function validateSurveyDates() {
        $("button.submit").on("click", function (event) {
            let start_date = $("#StartDateTextField").val();
            let end_date = $("#EndDateTextField").val();
            if (end_date < start_date) {
                event.preventDefault();
                alert('Please enter valid date intervals');
            }
        });
    }
    function validateRegistrationPWDMatch() {
        $("button.registerButton").on("click", function (event) {
            let pwd = $("#password").val();
            let pwd_confirm = $("#confirmPassword").val();
            if (pwd !== pwd_confirm) {
                event.preventDefault();
                alert('Password and Password Confirmation must match!');
            }
        });
        $("button.editButton").on("click", function (event) {
            let pwd = $("#editpassword").val();
            let pwd_confirm = $("#editConfirmPassword").val();
            if (pwd !== pwd_confirm) {
                event.preventDefault();
                alert('Password and Password Confirmation must match!');
            }
        });
    }
    function Start() {
        console.log("App Started");
        confirmDelete();
        validateSurveyDates();
        validateRegistrationPWDMatch();
    }
    $("button.btnExport").on("click", function (event) {
        window.open("/statistics");
    });
    $("button.sendEmailBtn").on("click", function (event) {
        if ($('#contactName').val() &&
            $('#contactEmail').val() &&
            $('#contactSubject').val() &&
            $('#contactComments').val()) {
            window.open("/contact/mail"
                +
                    "/name=" + $('#contactName').val() +
                "&email=" + $('#contactEmail').val() +
                "&subject=" + $('#contactSubject').val() +
                "&msg=" + $('#contactComments').val(), "_self");
            alert("Contact Email Sent!");
            $('#contactName').val('');
            $('#contactEmail').val('');
            $('#contactSubject').val('');
            $('#contactComments').val('');
        }
    });
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map