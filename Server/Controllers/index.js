"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessContactPage = exports.DisplayContactPage = exports.DisplayServicesPage = exports.DisplayCalendarPage = exports.DisplayAboutPage = exports.DisplayHomePage = void 0;
const Util_1 = require("../Util");
const appointment_1 = __importDefault(require("../Models/appointment"));
const user_1 = __importDefault(require("../Models/user"));
const patient_1 = __importDefault(require("../Models/patient"));
const dentist_1 = __importDefault(require("../Models/dentist"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
function DisplayHomePage(req, res, next) {
    res.render("content/index", {
        title: "Home",
        page: "home",
        displayName: (0, Util_1.UserDisplayName)(req),
        userType: (0, Util_1.TypeOfUser)(req),
        userID: (0, Util_1.UserID)(req),
        surveys: "",
    });
}
exports.DisplayHomePage = DisplayHomePage;
function DisplayAboutPage(req, res, next) {
    res.render("content/about", {
        title: "About Us",
        page: "about",
        displayName: (0, Util_1.UserDisplayName)(req),
        userType: (0, Util_1.TypeOfUser)(req),
        userID: (0, Util_1.UserID)(req),
        surveys: "",
    });
}
exports.DisplayAboutPage = DisplayAboutPage;
function DisplayCalendarPage(req, res, next) {
    let id = (0, Util_1.UserID)(req);
    user_1.default.findOne({ _id: id }, function (err, docs) {
        if (err) {
            console.log(err);
        }
        if (docs.typeOfUser == 'D') {
            dentist_1.default.findOne({ user_id: docs.id }, function (err, dent) {
                dentist_1.default.countDocuments({ user_id: docs.id }, function (err, count) {
                    if (count <= 0) {
                        res.redirect("/edituser");
                    }
                    appointment_1.default.aggregate([
                        {
                            "$project": {
                                _id: 0,
                                "title": {
                                    "$toString": "$Subject"
                                },
                                "start": {
                                    "$dateToString": { format: "%Y-%m-%d", date: "$Appointment_Date" }
                                }
                            }
                        }
                    ]).exec((err, appointments) => {
                        if (err) {
                            return console.error(err);
                        }
                        else {
                            let apCalendarArr = [];
                            console.log(appointments);
                            res.render("content/calendar", {
                                title: "Calendar",
                                page: "calendar",
                                displayName: (0, Util_1.UserDisplayName)(req),
                                userType: (0, Util_1.TypeOfUser)(req),
                                userID: (0, Util_1.UserID)(req),
                                appointmentList: appointments
                            });
                        }
                    });
                });
            });
        }
        else if (docs.typeOfUser == 'P') {
            patient_1.default.findOne({ user_id: docs.id }, function (err, pat) {
                patient_1.default.countDocuments({ user_id: docs.id }, function (err, count) {
                    if (count <= 0) {
                        res.redirect("/edituser");
                    }
                    else {
                        appointment_1.default.find({ Patient_ID: pat.id }, { Subject: 1, Appointment_Date: 1, _id: 0 }, function (err, appointments) {
                            console.log(appointments);
                            if (err) {
                                return console.error(err);
                            }
                            else {
                                res.render("content/calendar", {
                                    title: "Calendar",
                                    page: "calendar",
                                    displayName: (0, Util_1.UserDisplayName)(req),
                                    userType: (0, Util_1.TypeOfUser)(req),
                                    userID: (0, Util_1.UserID)(req),
                                    appointmentList: appointments
                                });
                            }
                        }).sort({ Appointment_Date: -1 });
                    }
                });
            });
        }
    });
}
exports.DisplayCalendarPage = DisplayCalendarPage;
function DisplayServicesPage(req, res, next) {
    res.render("content/services", {
        title: "Services",
        page: "services",
        displayName: (0, Util_1.UserDisplayName)(req),
        userType: (0, Util_1.TypeOfUser)(req),
        userID: (0, Util_1.UserID)(req),
        surveys: "",
    });
}
exports.DisplayServicesPage = DisplayServicesPage;
function DisplayContactPage(req, res, next) {
    res.render("content/contact", {
        title: "Contact Us",
        page: "contact",
        displayName: (0, Util_1.UserDisplayName)(req),
        userType: (0, Util_1.TypeOfUser)(req),
        userID: (0, Util_1.UserID)(req),
        surveys: "",
    });
}
exports.DisplayContactPage = DisplayContactPage;
function ProcessContactPage(req, res, next) {
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY ?? '');
    let query = "?" + req.params.query;
    const params = new URLSearchParams(query);
    const contactMe = Object.fromEntries(params);
    const msg = {
        to: 'epenaeve@my.centennialcollege.ca',
        from: 'epenaeve@my.centennialcollege.ca',
        subject: "Dental Appointment App Book a'Smile by Mantis Dev - Contact Email: " + contactMe.subject,
        text: contactMe.msg,
        html: "<h1><strong>Dental Appointment App Book a'Smile by Mantis Dev - Contact Email</strong></h1>" +
            "<p>From: " + contactMe.name + "</p>" +
            "<p>Email: " + contactMe.email + "</p>" +
            "<p>Comments: </p>" + contactMe.msg,
    };
    mail_1.default
        .send(msg)
        .then(() => {
        console.log('Email sent');
    })
        .catch((error) => {
        console.error(error);
    });
}
exports.ProcessContactPage = ProcessContactPage;
//# sourceMappingURL=index.js.map