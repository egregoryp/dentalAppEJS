"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessContactPage = exports.DisplayContactPage = exports.DisplayCalendarPage = exports.DisplayAboutPage = exports.DisplayHomePage = void 0;
const Util_1 = require("../Util");
const mail_1 = __importDefault(require("@sendgrid/mail"));
function DisplayHomePage(req, res, next) {
    res.render("content/index", {
        title: "Home",
        page: "home",
        displayName: (0, Util_1.UserDisplayName)(req),
        surveys: "",
    });
}
exports.DisplayHomePage = DisplayHomePage;
function DisplayAboutPage(req, res, next) {
    res.render("content/about", {
        title: "About Us",
        page: "about",
        displayName: (0, Util_1.UserDisplayName)(req),
        surveys: "",
    });
}
exports.DisplayAboutPage = DisplayAboutPage;
function DisplayCalendarPage(req, res, next) {
    res.render("content/calendar", {
        title: "Calendar",
        page: "calendar",
        displayName: (0, Util_1.UserDisplayName)(req),
        surveys: "",
    });
}
exports.DisplayCalendarPage = DisplayCalendarPage;
function DisplayContactPage(req, res, next) {
    res.render("content/contact", {
        title: "Contact Us",
        page: "contact",
        displayName: (0, Util_1.UserDisplayName)(req),
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
        subject: "Mega Survey by Mantis Dev - Contact Email: " + contactMe.subject,
        text: contactMe.msg,
        html: "<h1><strong>Mega Survey by Mantis Dev - Contact Email</strong></h1>" +
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