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
        if (!userCollection.typeOfUser) {
            res.render("profile/profile", {
                title: "Complete Profile",
                page: "profile",
                users: userCollection,
                profiles: null,
                typeUserVal: userCollection.typeOfUser,
                displayName: (0, Util_1.UserDisplayName)(req),
                user: (0, Util_1.UserName)(req)
            });
        }
        else if (userCollection.typeOfUser === 'D' || userCollection.typeOfUser === 'A') {
            dentist_1.default.findOne({ user_id: id }).lean().exec((err, profileCollection) => {
                console.log(profileCollection);
                res.render("profile/profile", {
                    title: "Complete Profile",
                    page: "profile",
                    users: userCollection,
                    profiles: profileCollection,
                    typeUserVal: userCollection.typeOfUser,
                    displayName: (0, Util_1.UserDisplayName)(req),
                    user: (0, Util_1.UserName)(req)
                });
            });
        }
        else if (userCollection.typeOfUser === 'P') {
            patient_1.default.findOne({ user_id: id }).lean().exec((err, profileCollection) => {
                res.render("profile/profile", {
                    title: "Complete Profile",
                    page: "profile",
                    users: userCollection,
                    profiles: profileCollection,
                    typeUserVal: userCollection.typeOfUser,
                    displayName: (0, Util_1.UserDisplayName)(req),
                    user: (0, Util_1.UserName)(req)
                });
            });
        }
    });
}
exports.DisplayAddProfilePage = DisplayAddProfilePage;
function ProcessAddProfilePage(req, res, next) {
    let id = (0, Util_1.UserID)(req);
    let birthdateVar = new Date(req.body.birthDate);
    let edtbirthdate = (0, Util_1.convertUTCEDTDate)(birthdateVar);
    let typeOfUserVal = req.body.TypeOfUser;
    user_1.default.findOneAndUpdate({ _id: id }, { typeOfUser: typeOfUserVal, DisplayName: req.body.name, EmailAddress: req.body.EmailAddress }, function (err, docs) {
        if (err) {
            console.log(err);
        }
    });
    if (typeOfUserVal === "D") {
        dentist_1.default.findOne({ user_id: id }).lean().exec((err, patVal) => {
            if (err) {
                console.log(err);
            }
            if (patVal) {
                let userProfile = new dentist_1.default({
                    _id: patVal._id,
                    user_id: id,
                    dateOfBirth: edtbirthdate,
                    sex: req.body.Sex,
                    address: req.body.address,
                    city: req.body.city,
                    province_state: req.body.province,
                    postalcode: req.body.postalCode,
                    country: req.body.country,
                    phoneNumber: req.body.phoneNumber,
                    comments: req.body.comments,
                    specialty: req.body.specialConsiderations
                });
                dentist_1.default.updateOne({ user_id: id }, userProfile, function (err, docs) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('update');
                });
            }
            else {
                let newUserProfile = new dentist_1.default({
                    user_id: id,
                    dateOfBirth: edtbirthdate,
                    sex: req.body.Sex,
                    address: req.body.address,
                    city: req.body.city,
                    province_state: req.body.province,
                    postalcode: req.body.postalCode,
                    country: req.body.country,
                    phoneNumber: req.body.phoneNumber,
                    comments: req.body.comments,
                    specialty: req.body.specialConsiderations
                });
                dentist_1.default.create(newUserProfile, function (err) {
                    if (err) {
                        console.error(err);
                        res.end(err);
                    }
                    console.log('create');
                });
            }
            res.redirect("/dentist");
        });
    }
    else if (typeOfUserVal === "P") {
        patient_1.default.findOne({ user_id: id }).lean().exec((err, patVal) => {
            if (err) {
                console.log(err);
            }
            if (patVal) {
                let userProfile = new patient_1.default({
                    _id: patVal._id,
                    user_id: id,
                    dateOfBirth: edtbirthdate,
                    sex: req.body.Sex,
                    address: req.body.address,
                    city: req.body.city,
                    province_state: req.body.province,
                    postalcode: req.body.postalCode,
                    country: req.body.country,
                    phoneNumber: req.body.phoneNumber,
                    comments: req.body.comments,
                    specialConsiderations: req.body.specialConsiderations
                });
                patient_1.default.updateOne({ user_id: id }, userProfile, function (err, docs) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('update');
                });
            }
            else {
                let newUserProfile = new patient_1.default({
                    user_id: id,
                    dateOfBirth: edtbirthdate,
                    sex: req.body.Sex,
                    address: req.body.address,
                    city: req.body.city,
                    province_state: req.body.province,
                    postalcode: req.body.postalCode,
                    country: req.body.country,
                    phoneNumber: req.body.phoneNumber,
                    comments: req.body.comments,
                    specialConsiderations: req.body.specialConsiderations
                });
                patient_1.default.create(newUserProfile, function (err) {
                    if (err) {
                        console.error(err);
                        res.end(err);
                    }
                    console.log('create');
                });
            }
            res.redirect("/dentist");
        });
    }
}
exports.ProcessAddProfilePage = ProcessAddProfilePage;
exports.default = router;
//# sourceMappingURL=profile.js.map