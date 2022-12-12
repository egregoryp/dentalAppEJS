"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayDentistList = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = __importDefault(require("../Models/user"));
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
                    EmailAddress: dentistAdd[i].EmailAddress,
                    typeOfUser: dentistAdd[i].typeOfUser
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
            console.log(dentistAdd);
            for (let i = 0; i < dentistAdd.length; i++) {
                dUser = {
                    DisplayName: dentistAdd[i].DisplayName,
                    username: dentistAdd[i].username,
                    EmailAddress: dentistAdd[i].EmailAddress,
                    typeOfUser: dentistAdd[i].typeOfUser
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
                    EmailAddress: dentistAdd[i].EmailAddress,
                    typeOfUser: dentistAdd[i].typeOfUser
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
exports.default = router;
//# sourceMappingURL=dentist-list.js.map