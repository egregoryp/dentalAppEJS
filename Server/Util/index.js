"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertUTCEDTDate = exports.getEDTDate = exports.getFormattedDate = exports.AuthGuardEditDelete = exports.AuthGuard = exports.UserEmail = exports.UserName = exports.UserDisplayName = void 0;
const dentist_1 = __importDefault(require("../Models/dentist"));
const set_tz_1 = __importDefault(require("set-tz"));
(0, set_tz_1.default)('America/Toronto');
function UserDisplayName(req) {
    if (req.user) {
        let user = req.user;
        return user.DisplayName.toString();
    }
    return '';
}
exports.UserDisplayName = UserDisplayName;
function UserName(req) {
    if (req.user) {
        let user = req.user;
        return user.username.toString();
    }
    return '';
}
exports.UserName = UserName;
function UserEmail(req) {
    if (req.user) {
        let user = req.user;
        return user.EmailAddress.toString();
    }
    return '';
}
exports.UserEmail = UserEmail;
function AuthGuard(req, res, next) {
    let user = req.user;
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}
exports.AuthGuard = AuthGuard;
function AuthGuardEditDelete(req, res, next) {
    let user = req.user;
    let id = req.params.id;
    dentist_1.default.findOne({ _id: id }).lean().exec((err, doc) => {
        if (err) {
            console.log(err);
            res.end(err);
        }
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }
        else if (user.username.toString() != doc.OwnerUserName) {
            return res.redirect('/dentist');
        }
        next();
    });
}
exports.AuthGuardEditDelete = AuthGuardEditDelete;
function getFormattedDate(inputDate, fullDate = false) {
    const dateFromServer = new Date(inputDate);
    const localOffset = new Date().getTimezoneOffset();
    const localOffsetMillis = 60 * 1000 * localOffset;
    const inputDateF = new Date(dateFromServer.getTime() + localOffsetMillis);
    let hoursAMPM;
    let vAMPM;
    let date_return;
    if (inputDateF.getHours() > 12) {
        hoursAMPM = inputDateF.getHours() - 12;
        vAMPM = "PM";
    }
    else {
        hoursAMPM = inputDateF.getHours();
        vAMPM = "AM";
    }
    if (fullDate) {
        date_return =
            ("0" + (inputDateF.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + inputDateF.getDate()).slice(-2) +
                "-" +
                inputDateF.getFullYear() +
                " " +
                ("0" + hoursAMPM).slice(-2) +
                ":" +
                ("0" + inputDateF.getMinutes()).slice(-2) +
                ":" +
                ("0" + inputDateF.getSeconds()).slice(-2) + " " + vAMPM;
    }
    else {
        date_return =
            ("0" + (inputDateF.getMonth() + 1)).slice(-2) + "-" +
                ("0" + inputDateF.getDate()).slice(-2) + "-" +
                inputDateF.getFullYear();
    }
    return date_return;
}
exports.getFormattedDate = getFormattedDate;
function getEDTDate(lastHour) {
    const dateFromServer = new Date();
    const localOffset = new Date().getTimezoneOffset();
    const localOffsetMillis = 60 * 1000 * localOffset;
    const edtDate = new Date(dateFromServer.getTime() - localOffsetMillis);
    if (lastHour) {
        edtDate.setHours(0);
        edtDate.setHours(19);
        edtDate.setMinutes(59);
        edtDate.setSeconds(59);
    }
    return edtDate;
}
exports.getEDTDate = getEDTDate;
function convertUTCEDTDate(utcDate) {
    const dateFromServer = utcDate;
    const localOffset = new Date().getTimezoneOffset();
    const localOffsetMillis = 60 * 1000 * localOffset;
    const edtDate = new Date(dateFromServer.getTime() - localOffsetMillis);
    return edtDate;
}
exports.convertUTCEDTDate = convertUTCEDTDate;
//# sourceMappingURL=index.js.map