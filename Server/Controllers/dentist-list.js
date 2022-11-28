"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessDeleteDentistPage = exports.ProcessEditDentistPage = exports.DisplayEditDentistPage = exports.ProcessAddDentistPage = exports.DisplayAddDentistList = exports.DisplayAppointmentList = exports.DisplayDentistList = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const mongoose_1 = __importDefault(require("mongoose"));
const appointment_1 = __importDefault(require("../Models/appointment"));
const question_1 = __importDefault(require("../Models/question"));
const response_1 = __importDefault(require("../Models/response"));
const Util_1 = require("../Util");
const set_tz_1 = __importDefault(require("set-tz"));
(0, set_tz_1.default)('America/Toronto');
function DisplayDentistList(req, res, next) {
    let OwnerUsrName = (0, Util_1.UserName)(req);
    if (OwnerUsrName) {
        appointment_1.default.find({ OwnerUserName: OwnerUsrName }).lean().exec((err, dentists) => {
            if (err) {
                return console.error(err);
            }
            else {
                res.render("dentist/dentists", {
                    title: "dentist",
                    page: "dentist",
                    displayName: (0, Util_1.UserDisplayName)(req),
                    user: (0, Util_1.UserName)(req),
                    surveys: dentists,
                });
            }
        });
    }
    else {
        appointment_1.default.find({ isActive: true }).lean().exec((err, dentists) => {
            if (err) {
                return console.error(err);
            }
            else {
                res.render("dentist/dentists", {
                    title: "dentists",
                    page: "dentists",
                    displayName: (0, Util_1.UserDisplayName)(req),
                    user: (0, Util_1.UserName)(req),
                    surveys: dentists,
                });
            }
        });
    }
}
exports.DisplayDentistList = DisplayDentistList;
function DisplayAppointmentList(req, res, next) {
    appointment_1.default.find({ isActive: true }).lean().exec((err, dentists) => {
        if (err) {
            return console.error(err);
        }
        else {
            res.render("dentist/appointments", {
                title: "appointments",
                page: "appointments",
                displayName: (0, Util_1.UserDisplayName)(req),
                user: (0, Util_1.UserName)(req),
                surveys: dentists,
            });
        }
    });
}
exports.DisplayAppointmentList = DisplayAppointmentList;
function DisplayAddDentistList(req, res, next) {
    let questionArr = new Array();
    res.render("dentist/details", {
        title: "Add dentist",
        page: "details",
        surveys: "",
        displayName: (0, Util_1.UserDisplayName)(req),
        questions: questionArr,
    });
    console.log(questionArr);
}
exports.DisplayAddDentistList = DisplayAddDentistList;
function ProcessAddDentistPage(req, res, next) {
    let start_date = new Date(req.body.startDate);
    let edtStartDate = (0, Util_1.convertUTCEDTDate)(start_date);
    let end_date = new Date(req.body.endDate);
    let edtEndDate = (0, Util_1.convertUTCEDTDate)(end_date);
    let edtDateTime = (0, Util_1.getEDTDate)(false);
    let itsActive;
    if (edtEndDate < edtDateTime) {
        itsActive = false;
    }
    else {
        itsActive = true;
    }
    let newDentist = new appointment_1.default({
        Name: req.body.name,
        Owner: (0, Util_1.UserDisplayName)(req),
        OwnerUserName: (0, Util_1.UserName)(req),
        isActive: itsActive,
        type: req.body.type,
        Start_Date: edtStartDate,
        End_Date: edtEndDate
    });
    appointment_1.default.create(newDentist, function (err) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        let newQuestion = new question_1.default({
            Survey_ID: newDentist._id,
            question: [
                req.body.q1,
                req.body.q2,
                req.body.q3,
                req.body.q4,
                req.body.q5,
            ],
        });
        question_1.default.create(newQuestion, function (err) {
            if (err) {
                console.error(err);
                res.end(err);
            }
        });
        res.redirect("/dentist");
    });
}
exports.ProcessAddDentistPage = ProcessAddDentistPage;
function DisplayEditDentistPage(req, res, next) {
    let id = req.params.id;
    appointment_1.default.findById(id, function (err, dentists) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        let qId = new mongoose_1.default.Types.ObjectId(id);
        question_1.default.find({ Survey_ID: qId }, function (err, questions) {
            if (err) {
                console.log(err);
                res.end(err);
            }
            res.render("dentist/details", {
                title: "Edit dentist",
                page: "details",
                surveys: dentists,
                displayName: (0, Util_1.UserDisplayName)(req),
                user: (0, Util_1.UserName)(req),
                questions: questions,
            });
        });
    });
}
exports.DisplayEditDentistPage = DisplayEditDentistPage;
function ProcessEditDentistPage(req, res, next) {
    let id = req.params.id;
    let start_date = new Date(req.body.startDate);
    let edtStartDate = (0, Util_1.convertUTCEDTDate)(start_date);
    let end_date = new Date(req.body.endDate);
    let edtEndDate = (0, Util_1.convertUTCEDTDate)(end_date);
    let edtDateTime = (0, Util_1.getEDTDate)(false);
    let itsActive;
    if (edtEndDate < edtDateTime) {
        itsActive = false;
    }
    else {
        itsActive = Boolean(req.body.activeSurvey);
    }
    let dentistFound = new appointment_1.default({
        _id: id,
        Name: req.body.name,
        Owner: (0, Util_1.UserDisplayName)(req),
        OwnerUserName: (0, Util_1.UserName)(req),
        isActive: itsActive,
        type: req.body.type,
        Start_Date: edtStartDate,
        End_Date: edtEndDate
    });
    appointment_1.default.updateOne({ _id: id }, dentistFound, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
    });
    let questionFound = [];
    questionFound.push(req.body.q1);
    questionFound.push(req.body.q2);
    questionFound.push(req.body.q3);
    questionFound.push(req.body.q4);
    questionFound.push(req.body.q5);
    let qid = new mongoose_1.default.Types.ObjectId(id);
    question_1.default.findOneAndUpdate({ Survey_ID: qid }, { question: questionFound }, function (err, docs) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.redirect("/dentist");
    });
}
exports.ProcessEditDentistPage = ProcessEditDentistPage;
function ProcessDeleteDentistPage(req, res, next) {
    let id = req.params.id;
    appointment_1.default.remove({ _id: id }, function (err) {
        if (err) {
            console.error(err);
            res.end(err);
        }
    });
    let qid = new mongoose_1.default.Types.ObjectId(id);
    question_1.default.findOneAndDelete({ Survey_ID: qid }, function (err, docs) {
        if (err) {
            console.error(err);
            res.end(err);
        }
    });
    response_1.default.deleteMany({ Survey_ID: id }, function (err) {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.redirect("/dentist");
    });
}
exports.ProcessDeleteDentistPage = ProcessDeleteDentistPage;
exports.default = router;
//# sourceMappingURL=dentist-list.js.map