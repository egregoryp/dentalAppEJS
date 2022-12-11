"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessDetailsAppointment = exports.DisplayDetailsAppointment = exports.ProcessDeletePage = exports.ProcessBookAppointment = exports.DisplayBookAppointment = exports.DisplayDentistAppointments = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const appointment_1 = __importDefault(require("../Models/appointment"));
const user_1 = __importDefault(require("../Models/user"));
const patient_1 = __importDefault(require("../Models/patient"));
const dentist_1 = __importDefault(require("../Models/dentist"));
const Util_1 = require("../Util");
function DisplayDentistAppointments(req, res, next) {
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
                    appointment_1.default.find({ Dentist_ID: dent.id }, function (err, appointments) {
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
                });
            });
        }
        else {
            patient_1.default.findOne({ user_id: docs.id }, function (err, pat) {
                patient_1.default.countDocuments({ user_id: docs.id }, function (err, count) {
                    if (count <= 0) {
                        res.redirect("/edituser");
                    }
                    else {
                        appointment_1.default.find({ Patient_ID: pat.id }, function (err, appointments) {
                            console.log(appointments);
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
            let id = (0, Util_1.UserID)(req);
            patient_1.default.countDocuments({ user_id: id }, function (err, count) {
                if (count <= 0) {
                    res.redirect("/edituser");
                }
                else {
                    res.render("appointment/bookAppointments", {
                        title: "appointments",
                        page: "appointments",
                        displayName: (0, Util_1.UserDisplayName)(req),
                        typeUser: (0, Util_1.TypeOfUser)(req),
                        user: (0, Util_1.UserName)(req),
                        userID: (0, Util_1.UserID)(req),
                        dentist: dentists,
                    });
                }
            });
        }
    });
}
exports.DisplayBookAppointment = DisplayBookAppointment;
function ProcessBookAppointment(req, res, next) {
    let dentist_id = req.params.id;
    let u_id = (0, Util_1.UserID)(req);
    patient_1.default.findOne({ user_id: u_id }, function (err, pat) {
        if (err) {
            console.log(err);
        }
        if (pat.id === null) {
            res.redirect("/profile");
        }
        dentist_1.default.findOne({ _id: dentist_id }, function (err, dent) {
            if (err) {
                console.log(err);
            }
            let d_u_id = dent.user_id;
            user_1.default.findOne({ _id: d_u_id }, function (err, dentuser) {
                let appointment_date = new Date(req.body.appointmentDate);
                let edtappointmentDate = (0, Util_1.convertUTCEDTDate)(appointment_date);
                let newAppointment = new appointment_1.default({
                    Subject: req.body.subject,
                    Dentist_ID: dentist_id,
                    Dentist_name: dentuser.username,
                    Patient_ID: pat.id,
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
                res.redirect("/appointment");
            });
        });
    });
}
exports.ProcessBookAppointment = ProcessBookAppointment;
function ProcessDeletePage(req, res, next) {
    let id = req.params.id;
    console.log(id);
    appointment_1.default.remove({ _id: id }, function (err) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.redirect('/appointment');
    });
}
exports.ProcessDeletePage = ProcessDeletePage;
function DisplayDetailsAppointment(req, res, next) {
    let id = req.params.id;
    appointment_1.default.findById(id, {}, {}, function (err, appointmentDetais) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render("appointment/appointmentDetails", { title: 'appointmentdetails',
            page: 'details',
            appointment: appointmentDetais,
            displayName: (0, Util_1.UserDisplayName)(req)
        });
    });
}
exports.DisplayDetailsAppointment = DisplayDetailsAppointment;
function ProcessDetailsAppointment(req, res, next) {
    let id = req.params.id;
    appointment_1.default.findOne({ _id: id }, function (err, app) {
        let appointment_date = new Date(req.body.appointmentDate);
        let edtappointmentDate = (0, Util_1.convertUTCEDTDate)(appointment_date);
        let newAppointment = new appointment_1.default({
            "_id": app.id,
            Subject: req.body.subject,
            Dentist_ID: app.Dentist_ID,
            Dentist_name: app.dentist_name,
            Patient_ID: app.Patient_ID,
            Patient_Name: app.Patient_Name,
            type: '',
            Appointment_Date: edtappointmentDate,
            Description: req.body.description,
        });
        appointment_1.default.updateOne({ _id: id }, newAppointment, function (err) {
            if (err) {
                console.error(err);
                res.end(err);
            }
        });
        res.redirect("/appointment");
    });
}
exports.ProcessDetailsAppointment = ProcessDetailsAppointment;
//# sourceMappingURL=appointment.js.map