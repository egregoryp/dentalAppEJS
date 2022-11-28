"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessAddProfilePage = exports.DisplayAddProfilePage = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = __importDefault(require("../Models/user"));
const patient_1 = __importDefault(require("../Models/patient"));
const dentist_1 = __importDefault(require("../Models/dentist"));
const Util_1 = require("../Util");
const set_tz_1 = __importDefault(require("set-tz"));
(0, set_tz_1.default)('America/Toronto');
function DisplayAddProfilePage(req, res, next) {
    let id = (0, Util_1.UserID)(req);
    user_1.default.findOne({ _id: id }).lean().exec((err, userCollection) => {
        if (err) {
            console.log(err);
            res.end(err);
        }
        console.log(userCollection.typeOfUser);
        if (userCollection.typeOfUser === 'D') {
            dentist_1.default.findOne({ user_id: id }).lean().exec((err, profileCollection) => {
                console.log(profileCollection);
                res.render("profile/profile", {
                    title: "Complete Profile",
                    page: "profile",
                    users: userCollection,
                    profiles: profileCollection,
                    displayName: (0, Util_1.UserDisplayName)(req),
                    user: (0, Util_1.UserName)(req)
                });
            });
        }
        else if (userCollection.typeOfUser === 'P') {
            dentist_1.default.findOne({ user_id: id }).lean().exec((err, profileCollection) => {
                res.render("profile/profile", {
                    title: "Complete Profile",
                    page: "profile",
                    users: userCollection,
                    profiles: profileCollection,
                    displayName: (0, Util_1.UserDisplayName)(req),
                    user: (0, Util_1.UserName)(req)
                });
            });
        }
    });
}
exports.DisplayAddProfilePage = DisplayAddProfilePage;
function ProcessAddProfilePage(req, res, next) {
    let birthdateVar = new Date(req.body.birthDate);
    let edtbirthdate = (0, Util_1.convertUTCEDTDate)(birthdateVar);
    let typeOfUserVal = req.body.TypeOfUser;
    user_1.default.findOneAndUpdate({ _id: (0, Util_1.UserID)(req) }, { typeOfUser: typeOfUserVal, DisplayName: req.body.name, EmailAddress: req.body.EmailAddress }, function (err, docs) {
        if (err) {
            console.log(err);
        }
    });
    let userProfile;
    if (typeOfUserVal === "D") {
        userProfile = new dentist_1.default({
            user_id: (0, Util_1.UserID)(req),
            dateOfBirth: edtbirthdate,
            sex: req.body.Sex,
            address: req.body.address,
            city: req.body.city,
            province_state: req.body.province,
            postalcode: req.body.postalcode,
            country: req.body.country,
            phoneNumber: req.body.phoneNumber,
            comments: req.body.comments,
            specialty: req.body.specialty,
        });
        dentist_1.default.create(userProfile, function (err) {
            if (err) {
                console.error(err);
                res.end(err);
            }
            res.redirect("/dentist");
        });
    }
    else if (typeOfUserVal === "P") {
        userProfile = new patient_1.default({
            user_id: (0, Util_1.UserID)(req),
            dateOfBirth: edtbirthdate,
            sex: req.body.Sex,
            address: req.body.address,
            city: req.body.city,
            province_state: req.body.province,
            postalcode: req.body.postalcode,
            country: req.body.country,
            phoneNumber: req.body.phoneNumber,
            comments: req.body.comments,
            specialConsiderations: req.body.specialty,
        });
        patient_1.default.create(userProfile, function (err) {
            if (err) {
                console.error(err);
                res.end(err);
            }
            res.redirect("/");
        });
    }
}
exports.ProcessAddProfilePage = ProcessAddProfilePage;
exports.default = router;
//# sourceMappingURL=profile.js.map