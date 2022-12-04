"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessBookAppointment = exports.DisplayBookAppointment = exports.DisplayDentistAppointments = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const appointment_1 = __importDefault(require("../Models/appointment"));
const user_1 = __importDefault(require("../Models/user"));
const patient_1 = __importDefault(require("../Models/patient"));
const Util_1 = require("../Util");
function DisplayDentistAppointments(req, res, next) {
    let id = (0, Util_1.UserID)(req);
    user_1.default.findOne({ _id: id }, function (err, docs) {
        if (err) {
            console.log(err);
        }
        if (docs.typeOfUser == 'D') {
            appointment_1.default.find({}, function (err, appointments) {
                if (err) {
                    return console.error(err);
                }
                else {
                    res.render("appointment/dentistAppointment", {
                        title: "Appointments",
                        page: "appointment",
                        displayName: (0, Util_1.UserDisplayName)(req),
                        userType: (0, Util_1.TypeOfUser)(req),
                        appointmentList: appointments
                    });
                }
            });
        }
        else {
            appointment_1.default.find({}, function (err, appointments) {
                if (err) {
                    return console.error(err);
                }
                else {
                    res.render("appointment/userAppointment", {
                        title: "Appointments",
                        page: "userAppointment",
                        displayName: (0, Util_1.UserDisplayName)(req),
                        userType: (0, Util_1.TypeOfUser)(req),
                        appointmentList: appointments
                    });
                }
            });
        }
    });
}
exports.DisplayDentistAppointments = DisplayDentistAppointments;
function DisplayBookAppointment(req, res, next) {
    appointment_1.default.find({ isActive: true }).lean().exec((err, dentists) => {
        if (err) {
            return console.error(err);
        }
        else {
            res.render("appointment/bookAppointments", {
                title: "appointments",
                page: "appointments",
                displayName: (0, Util_1.UserDisplayName)(req),
                typeUser: (0, Util_1.TypeOfUser)(req),
                user: (0, Util_1.UserName)(req),
                userID: (0, Util_1.UserID)(req),
                surveys: dentists,
            });
        }
    });
}
exports.DisplayBookAppointment = DisplayBookAppointment;
function ProcessBookAppointment(req, res, next) {
    let dentist_id = req.params.id;
    let u_id = (0, Util_1.UserID)(req);
    res.send({
        'id': dentist_id
    });
    patient_1.default.findOne({ user_id: u_id }, function (err, docs) {
        if (err) {
            console.log(err);
        }
        let appointment_date = new Date(req.body.appointmentDate);
        let edtappointmentDate = (0, Util_1.convertUTCEDTDate)(appointment_date);
        let newAppointment = new appointment_1.default({
            Subject: req.body.subject,
            Dentist_ID: dentist_id,
            Patient_ID: docs.id,
            Patient_Name: (0, Util_1.UserDisplayName)(req),
            type: '',
            Appointment_Date: edtappointmentDate,
            Description: req.body.description,
        });
        appointment_1.default.create(newAppointment, function (err) {
            if (err) {
                console.error(err);
                res.end(err);
            }
        });
    });
    res.redirect("/appointment");
}
exports.ProcessBookAppointment = ProcessBookAppointment;
//# sourceMappingURL=appointment.js.map