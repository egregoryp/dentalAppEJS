"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessDeleteDentistPage = exports.ProcessEditDentistPage = exports.DisplayEditDentistPage = exports.DisplayDentistList = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../Models/user"));
const appointment_1 = __importDefault(require("../Models/appointment"));
const dentist_1 = __importDefault(require("../Models/dentist"));
const question_1 = __importDefault(require("../Models/question"));
const Util_1 = require("../Util");
const set_tz_1 = __importDefault(require("set-tz"));
(0, set_tz_1.default)('America/Toronto');
function DisplayDentistList(req, res, next) {
    let typeOfUser = (0, Util_1.TypeOfUser)(req);
    let userID = (0, Util_1.UserID)(req);
    if (typeOfUser == 'D') {
        user_1.default.aggregate([
            {
                "$project": {
                    "_id": {
                        "$toString": "$_id"
                    },
                    "DisplayName": {
                        "$toString": "$DisplayName"
                    },
                    "username": {
                        "$toString": "$username"
                    },
                    "EmailAddress": {
                        "$toString": "$EmailAddress"
                    },
                    "typeOfUser": {
                        "$toString": "$typeOfUser"
                    }
                }
            },
            { "$match": { "_id": userID, "typeOfUser": "D" } },
            {
                "$lookup": {
                    "from": "dentist",
                    "localField": "_id",
                    "foreignField": "user_id",
                    "as": "dentist"
                }
            }
        ]).exec((err, dentistAdd) => {
            let dUser;
            let dentistUser;
            let dentistUserArr = [];
            for (let i = 0; i < dentistAdd.length; i++) {
                dUser = {
                    DisplayName: dentistAdd[i].DisplayName,
                    username: dentistAdd[i].username,
                    EmailAddress: dentistAdd[i].EmailAddress
                };
                dentistUser = {
                    ...dUser,
                    ...dentistAdd[i].dentist[0]
                };
                dentistUserArr.push(dentistUser);
            }
            res.render("dentist/dentists", {
                title: "dentists",
                page: "dentists",
                displayName: (0, Util_1.UserDisplayName)(req),
                typeUser: (0, Util_1.TypeOfUser)(req),
                user: (0, Util_1.UserName)(req),
                userID: (0, Util_1.UserID)(req),
                typeOfUser: typeOfUser,
                dentists: dentistUserArr,
                surveys: dentistUserArr,
            });
        });
    }
    else if (typeOfUser == 'A') {
        user_1.default.aggregate([
            {
                "$project": {
                    "_id": {
                        "$toString": "$_id"
                    },
                    "DisplayName": {
                        "$toString": "$DisplayName"
                    },
                    "username": {
                        "$toString": "$username"
                    },
                    "EmailAddress": {
                        "$toString": "$EmailAddress"
                    },
                    "typeOfUser": {
                        "$toString": "$typeOfUser"
                    }
                }
            },
            {
                "$lookup": {
                    "from": "dentist",
                    "localField": "_id",
                    "foreignField": "user_id",
                    "as": "dentist"
                }
            },
            {
                "$lookup": {
                    "from": "patient",
                    "localField": "_id",
                    "foreignField": "user_id",
                    "as": "patient"
                }
            }
        ]).exec((err, dentistAdd) => {
            let dUser;
            let dentistPatientUser;
            let dentistUserArr = [];
            for (let i = 0; i < dentistAdd.length; i++) {
                dUser = {
                    DisplayName: dentistAdd[i].DisplayName,
                    username: dentistAdd[i].username,
                    EmailAddress: dentistAdd[i].EmailAddress
                };
                if (dentistAdd[i].dentist[0]) {
                    dentistPatientUser = {
                        ...dUser,
                        ...dentistAdd[i].dentist[0]
                    };
                }
                else {
                    dentistPatientUser = {
                        ...dUser,
                        ...dentistAdd[i].patient[0]
                    };
                }
                dentistUserArr.push(dentistPatientUser);
            }
            res.render("dentist/dentists", {
                title: "dentists",
                page: "dentists",
                displayName: (0, Util_1.UserDisplayName)(req),
                typeUser: (0, Util_1.TypeOfUser)(req),
                user: (0, Util_1.UserName)(req),
                userID: (0, Util_1.UserID)(req),
                typeOfUser: typeOfUser,
                dentists: dentistUserArr,
                surveys: dentistUserArr,
            });
        });
    }
    else {
        user_1.default.aggregate([
            {
                "$project": {
                    "_id": {
                        "$toString": "$_id"
                    },
                    "DisplayName": {
                        "$toString": "$DisplayName"
                    },
                    "username": {
                        "$toString": "$username"
                    },
                    "EmailAddress": {
                        "$toString": "$EmailAddress"
                    },
                    "typeOfUser": {
                        "$toString": "$typeOfUser"
                    }
                }
            },
            { "$match": { "typeOfUser": "D" } },
            {
                "$lookup": {
                    "from": "dentist",
                    "localField": "_id",
                    "foreignField": "user_id",
                    "as": "dentist"
                }
            }
        ]).exec((err, dentistAdd) => {
            let dUser;
            let dentistUser;
            let dentistUserArr = [];
            for (let i = 0; i < dentistAdd.length; i++) {
                dUser = {
                    DisplayName: dentistAdd[i].DisplayName,
                    username: dentistAdd[i].username,
                    EmailAddress: dentistAdd[i].EmailAddress
                };
                dentistUser = {
                    ...dUser,
                    ...dentistAdd[i].dentist[0]
                };
                dentistUserArr.push(dentistUser);
            }
            res.render("dentist/dentists", {
                title: "dentists",
                page: "dentists",
                displayName: (0, Util_1.UserDisplayName)(req),
                typeUser: (0, Util_1.TypeOfUser)(req),
                user: (0, Util_1.UserName)(req),
                userID: (0, Util_1.UserID)(req),
                typeOfUser: typeOfUser,
                dentists: dentistUserArr,
                surveys: dentistUserArr,
            });
        });
    }
}
exports.DisplayDentistList = DisplayDentistList;
function DisplayEditDentistPage(req, res, next) {
    let id = req.params.id;
    dentist_1.default.findById(id, function (err, dentists) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        user_1.default.find({ _id: dentists.user_id }, function (err, questions) {
            if (err) {
                console.log(err);
                res.end(err);
            }
            res.render("dentist/details", {
                title: "Edit dentist",
                page: "details",
                displayName: (0, Util_1.UserDisplayName)(req),
                typeUser: (0, Util_1.TypeOfUser)(req),
                user: (0, Util_1.UserName)(req),
                userID: (0, Util_1.UserID)(req),
                dentists: dentists
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
    dentist_1.default.remove({ _id: id }, function (err) {
        if (err) {
            console.error(err);
            res.end(err);
        }
    });
    user_1.default.findOneAndUpdate({ user_id: id }, { typeOfUser: "" }, function (err, docs) {
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